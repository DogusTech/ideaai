package notifications

import (
	"context"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/middleware"
)

type Handlers struct {
	fs *firestore.Client
}

func NewHandlers(fs *firestore.Client) *Handlers {
	return &Handlers{fs: fs}
}

type Notification struct {
	ID        string    `json:"id" firestore:"-"`
	Type      string    `json:"type" firestore:"type"` // e.g., "checkin", "message"
	Content   string    `json:"content" firestore:"content"`
	Unread    bool      `json:"unread" firestore:"unread"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	
	// Actor details
	ActorID   string    `json:"actorId" firestore:"actorId"`
	ActorName string    `json:"actorName" firestore:"actorName"`
	ActorImg  string    `json:"actorImg" firestore:"actorImg"`
}

// GET /api/notifications
func (h *Handlers) List(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	iter := h.fs.Collection("users").Doc(uid).Collection("notifications").
		OrderBy("createdAt", firestore.Desc).
		Limit(50).
		Documents(r.Context())
	defer iter.Stop()

	var notifs []Notification
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to query notifications")
			return
		}
		var n Notification
		if err := doc.DataTo(&n); err != nil {
			continue
		}
		n.ID = doc.Ref.ID
		notifs = append(notifs, n)
	}

	if notifs == nil {
		notifs = []Notification{}
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"notifications": notifs})
}

// PUT /api/notifications/read
func (h *Handlers) MarkAllRead(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	ctx := r.Context()
	notifsRef := h.fs.Collection("users").Doc(uid).Collection("notifications")
	
	// Get all unread notifications
	iter := notifsRef.Where("unread", "==", true).Documents(ctx)
	defer iter.Stop()

	batch := h.fs.Batch()
	count := 0
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "error fetching unread notifications")
			return
		}
		
		batch.Update(doc.Ref, []firestore.Update{{Path: "unread", Value: false}})
		count++
		
		if count >= 500 {
			// Commit in chunks of 500
			_, err = batch.Commit(ctx)
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, "failed to commit read batch")
				return
			}
			batch = h.fs.Batch()
			count = 0
		}
	}
	
	if count > 0 {
		_, err := batch.Commit(ctx)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to commit read batch")
			return
		}
	}

	httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// Internal helper to create a notification
func CreateNotification(ctx context.Context, fs *firestore.Client, targetUserId string, notif Notification) error {
	notif.CreatedAt = time.Now()
	notif.Unread = true
	_, _, err := fs.Collection("users").Doc(targetUserId).Collection("notifications").Add(ctx, notif)
	return err
}
