package places

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"togetlink-api/internal/config"
	"togetlink-api/internal/models"
)

type Cache struct {
	client *firestore.Client
	ttl    time.Duration
}

func NewCache(client *firestore.Client, cfg *config.Config) *Cache {
	return &Cache{
		client: client,
		ttl:    time.Duration(cfg.PlacesCacheTTLHours) * time.Hour,
	}
}

func (c *Cache) Get(ctx context.Context, placeID string) (*models.PlaceCache, error) {
	doc, err := c.client.Collection("placeCache").Doc(placeID).Get(ctx)
	if err != nil {
		return nil, err
	}

	var pc models.PlaceCache
	if err := doc.DataTo(&pc); err != nil {
		return nil, err
	}

	// Check expiration
	if time.Now().UTC().After(pc.ExpiresAt) {
		return nil, fmt.Errorf("cache expired")
	}

	return &pc, nil
}

func (c *Cache) Set(ctx context.Context, pc *models.PlaceCache) error {
	pc.ExpiresAt = time.Now().UTC().Add(c.ttl)
	pc.LastFetchedAt = time.Now().UTC()

	_, err := c.client.Collection("placeCache").Doc(pc.PlaceID).Set(ctx, pc)
	return err
}

// Cleanup deletes expired cache entries. Can be run periodically.
func (c *Cache) Cleanup(ctx context.Context) error {
	iter := c.client.Collection("placeCache").Where("expiresAt", "<", time.Now().UTC()).Documents(ctx)
	batch := c.client.Batch()
	count := 0

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		batch.Delete(doc.Ref)
		count++
		
		if count >= 500 {
			_, err := batch.Commit(ctx)
			if err != nil {
				return err
			}
			batch = c.client.Batch()
			count = 0
		}
	}

	if count > 0 {
		_, err := batch.Commit(ctx)
		if err != nil {
			return err
		}
	}
	return nil
}
