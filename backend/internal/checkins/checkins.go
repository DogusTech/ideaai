package checkins

import (
	"context"
	"encoding/json"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"togetlink-api/internal/middleware"
	"togetlink-api/internal/notifications"
)

type Handlers struct {
	FS *firestore.Client
}

func NewHandlers(fs *firestore.Client) *Handlers {
	return &Handlers{FS: fs}
}

// GET /api/checkins/me
func (h *Handlers) Me(w http.ResponseWriter, r *http.Request) {
	uid, ok := r.Context().Value(middleware.UIDKey).(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	iter := h.FS.Collection("checkins").Where("uid", "==", uid).Documents(r.Context())
	var checkins []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to fetch checkins", http.StatusInternalServerError)
			return
		}
		data := doc.Data()
		data["id"] = doc.Ref.ID
		checkins = append(checkins, data)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(checkins)
}

// POST /api/checkins
func (h *Handlers) Create(w http.ResponseWriter, r *http.Request) {
	uid, ok := r.Context().Value(middleware.UIDKey).(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		HubID          string `json:"hubId"`
		LocationStatus string `json:"locationStatus"`
		WorkingOn      string `json:"workingOn"`
		Appearance     string `json:"appearance"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.HubID == "" || req.LocationStatus == "" || req.WorkingOn == "" || req.Appearance == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	
	err := h.FS.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		hubRef := h.FS.Collection("hubs").Doc(req.HubID)
		
		// 1. Read the hub to ensure it exists
		hubSnap, err := tx.Get(hubRef)
		if err != nil {
			return err
		}

		// 2. Increment checkedInCount
		currentCount := int64(0)
		if val, err := hubSnap.DataAt("checkedInCount"); err == nil {
			if count, ok := val.(int64); ok {
				currentCount = count
			}
		}
		
		err = tx.Update(hubRef, []firestore.Update{
			{Path: "checkedInCount", Value: currentCount + 1},
		})
		if err != nil {
			return err
		}

		// 3. Create the checkin document
		checkinRef := h.FS.Collection("checkins").NewDoc()
		err = tx.Set(checkinRef, map[string]interface{}{
			"id":             checkinRef.ID,
			"uid":            uid,
			"hubId":          req.HubID,
			"locationStatus": req.LocationStatus,
			"workingOn":      req.WorkingOn,
			"appearance":     req.Appearance,
			"createdAt":      firestore.ServerTimestamp,
		})
		return err
	})

	if err != nil {
		http.Error(w, "Failed to check in: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Trigger a notification to the user who checked in (for testing purposes)
	// Alternatively, we could notify other users in the hub, but this verifies the flow.
	go func() {
		// Use a background context since request context will cancel
		bgCtx := context.Background()
		userDoc, _ := h.FS.Collection("users").Doc(uid).Get(bgCtx)
		userName := "A User"
		if userDoc != nil && userDoc.Exists() {
			if name, ok := userDoc.Data()["name"].(string); ok {
				userName = name
			}
		}

		hubDoc, _ := h.FS.Collection("hubs").Doc(req.HubID).Get(bgCtx)
		hubName := "a hub"
		if hubDoc != nil && hubDoc.Exists() {
			if name, ok := hubDoc.Data()["name"].(string); ok {
				hubName = name
			}
		}

		notif := notifications.Notification{
			Type:      "checkin",
			Content:   "checked into " + hubName,
			ActorID:   uid,
			ActorName: userName,
			ActorImg:  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80", // placeholder
		}
		
		// Let's send the notification to the user themselves so they can see it instantly
		notifications.CreateNotification(bgCtx, h.FS, uid, notif)
	}()

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"success":true}`))
}

// GET /api/checkins/recent
func (h *Handlers) Recent(w http.ResponseWriter, r *http.Request) {
	// We need to fetch recent checkins, ordered by createdAt DESC
	// Note: Firestore requires an index if we order by createdAt and filter. For this simple feed, we just fetch globally.
	iter := h.FS.Collection("checkins").OrderBy("createdAt", firestore.Desc).Limit(50).Documents(r.Context())
	
	var recentCheckins []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to fetch recent checkins", http.StatusInternalServerError)
			return
		}
		
		data := doc.Data()
		data["id"] = doc.Ref.ID
		
		// For the network feed, we also want the user profile!
		// Since Firestore is NoSQL, we either duplicate user info into the checkin document,
		// or fetch it here. Since this is an MVP, we will fetch the user profile for each checkin.
		if uid, ok := data["uid"].(string); ok {
			userDoc, err := h.FS.Collection("users").Doc(uid).Get(r.Context())
			if err == nil {
				userData := userDoc.Data()
				data["user"] = map[string]interface{}{
					"name":     userData["name"],
					"headline": userData["headline"],
					"company":  userData["company"],
				}
			}
		}

		// Also fetch hub info
		if hubId, ok := data["hubId"].(string); ok {
			hubDoc, err := h.FS.Collection("hubs").Doc(hubId).Get(r.Context())
			if err == nil {
				hubData := hubDoc.Data()
				data["hub"] = map[string]interface{}{
					"name": hubData["name"],
					"city": hubData["city"],
				}
			}
		}

		recentCheckins = append(recentCheckins, data)
	}

	w.Header().Set("Content-Type", "application/json")
	if recentCheckins == nil {
		recentCheckins = make([]map[string]interface{}, 0)
	}
	json.NewEncoder(w).Encode(recentCheckins)
}
