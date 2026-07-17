package chat

import (
	"context"
	"encoding/json"
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

// Data models
type Chat struct {
	ID            string    `json:"id" firestore:"-"`
	Participants  []string  `json:"participants" firestore:"participants"`
	LastMessage   string    `json:"lastMessage" firestore:"lastMessage"`
	LastMessageAt time.Time `json:"lastMessageAt" firestore:"lastMessageAt"`
	CreatedAt     time.Time `json:"createdAt" firestore:"createdAt"`
}

type Message struct {
	ID        string    `json:"id" firestore:"-"`
	SenderID  string    `json:"senderId" firestore:"senderId"`
	Text      string    `json:"text" firestore:"text"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
}

type UserProfilePreview struct {
	UID      string `json:"uid"`
	Name     string `json:"name"`
	Headline string `json:"headline"`
}

// GET /api/chat/conversations
// Returns a list of chats for the logged-in user, populated with participant details.
func (h *Handlers) List(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	// Query chats where participants array contains 'uid'
	iter := h.fs.Collection("chats").
		Where("participants", "array-contains", uid).
		OrderBy("lastMessageAt", firestore.Desc).
		Documents(r.Context())
	defer iter.Stop()

	var chats []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to query chats")
			return
		}

		var chat Chat
		if err := doc.DataTo(&chat); err != nil {
			continue
		}
		chat.ID = doc.Ref.ID

		// To make the frontend easy, let's fetch the details of the *other* participant (assuming 1-on-1 for now)
		var otherUserId string
		for _, p := range chat.Participants {
			if p != uid {
				otherUserId = p
				break
			}
		}

		otherUser := UserProfilePreview{UID: otherUserId, Name: "Unknown", Headline: ""}
		if otherUserId != "" {
			userDoc, err := h.fs.Collection("users").Doc(otherUserId).Get(r.Context())
			if err == nil {
				otherUser.Name = userDoc.Data()["name"].(string)
				if headline, ok := userDoc.Data()["headline"].(string); ok {
					otherUser.Headline = headline
				}
			}
		}

		chats = append(chats, map[string]interface{}{
			"id":            chat.ID,
			"lastMessage":   chat.LastMessage,
			"lastMessageAt": chat.LastMessageAt,
			"otherUser":     otherUser,
		})
	}

	if chats == nil {
		chats = []map[string]interface{}{}
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"conversations": chats})
}

// GET /api/chat/{chatId}/messages
func (h *Handlers) ListMessages(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	chatId := r.PathValue("chatId")
	if chatId == "" {
		httpx.Error(w, http.StatusBadRequest, "missing chatId")
		return
	}

	// Verify user is in chat
	chatDoc, err := h.fs.Collection("chats").Doc(chatId).Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "chat not found")
		return
	}
	var chat Chat
	if err := chatDoc.DataTo(&chat); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "error parsing chat")
		return
	}
	isParticipant := false
	for _, p := range chat.Participants {
		if p == uid {
			isParticipant = true
			break
		}
	}
	if !isParticipant {
		httpx.Error(w, http.StatusForbidden, "not a participant in this chat")
		return
	}

	iter := h.fs.Collection("chats").Doc(chatId).Collection("messages").
		OrderBy("createdAt", firestore.Asc).
		Documents(r.Context())
	defer iter.Stop()

	var messages []Message
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to query messages")
			return
		}
		var msg Message
		if err := doc.DataTo(&msg); err != nil {
			continue
		}
		msg.ID = doc.Ref.ID
		messages = append(messages, msg)
	}

	if messages == nil {
		messages = []Message{}
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"messages": messages})
}

// POST /api/chat/{chatId}/messages
func (h *Handlers) SendMessage(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	chatId := r.PathValue("chatId")
	if chatId == "" {
		httpx.Error(w, http.StatusBadRequest, "missing chatId")
		return
	}

	var req struct {
		Text string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Text == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid message text")
		return
	}

	// Verify participation
	chatRef := h.fs.Collection("chats").Doc(chatId)
	chatDoc, err := chatRef.Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "chat not found")
		return
	}
	
	var chat Chat
	if err := chatDoc.DataTo(&chat); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "error parsing chat")
		return
	}
	
	isParticipant := false
	for _, p := range chat.Participants {
		if p == uid {
			isParticipant = true
			break
		}
	}
	if !isParticipant {
		httpx.Error(w, http.StatusForbidden, "not a participant")
		return
	}

	now := time.Now()
	
	// Create message
	msg := Message{
		SenderID:  uid,
		Text:      req.Text,
		CreatedAt: now,
	}

	// Run in transaction to update chat lastMessage and insert message
	err = h.fs.RunTransaction(r.Context(), func(ctx context.Context, tx *firestore.Transaction) error {
		// Add new message to subcollection
		newMsgRef := chatRef.Collection("messages").NewDoc()
		if err := tx.Set(newMsgRef, msg); err != nil {
			return err
		}
		
		// Update parent chat
		return tx.Update(chatRef, []firestore.Update{
			{Path: "lastMessage", Value: msg.Text},
			{Path: "lastMessageAt", Value: now},
		})
	})

	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to send message")
		return
	}

	httpx.JSON(w, http.StatusCreated, map[string]string{"status": "sent"})
}

// POST /api/chat/create
// Creates a new 1-on-1 chat if it doesn't exist.
func (h *Handlers) CreateOrGet(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		TargetUserId string `json:"targetUserId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.TargetUserId == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid request")
		return
	}
	
	if uid == req.TargetUserId {
		httpx.Error(w, http.StatusBadRequest, "cannot chat with yourself")
		return
	}

	// Simplistic check for existing 1-on-1 chat
	// We'll query chats where participants contains 'uid'. Then filter manually to find exact match of [uid, targetUserId].
	iter := h.fs.Collection("chats").
		Where("participants", "array-contains", uid).
		Documents(r.Context())
	defer iter.Stop()

	var existingChatId string
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			break
		}
		
		var chat Chat
		if err := doc.DataTo(&chat); err == nil {
			if len(chat.Participants) == 2 {
				p1, p2 := chat.Participants[0], chat.Participants[1]
				if (p1 == uid && p2 == req.TargetUserId) || (p1 == req.TargetUserId && p2 == uid) {
					existingChatId = doc.Ref.ID
					break
				}
			}
		}
	}

	if existingChatId != "" {
		httpx.JSON(w, http.StatusOK, map[string]string{"chatId": existingChatId})
		return
	}

	// Create new chat
	chat := Chat{
		Participants:  []string{uid, req.TargetUserId},
		LastMessage:   "",
		LastMessageAt: time.Now(),
		CreatedAt:     time.Now(),
	}
	
	ref, _, err := h.fs.Collection("chats").Add(r.Context(), chat)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to create chat")
		return
	}

	httpx.JSON(w, http.StatusCreated, map[string]string{"chatId": ref.ID})
}
