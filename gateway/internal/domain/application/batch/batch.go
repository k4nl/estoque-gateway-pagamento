package batch

import (
	"fmt"

	"cloud.google.com/go/civil"
	"github.com/google/uuid"
)

type Batch struct {
	ID             uuid.UUID  `json:"id"`
	Quantity       float32    `json:"quantity"`
	ExpirationDate civil.Date `json:"expiration_date"`
}

type BatchSet map[uuid.UUID]Batch

func New(quantity float32, expirationDate civil.Date) (*Batch, error) {
	return &Batch{
		ID:             uuid.New(),
		Quantity:       quantity,
		ExpirationDate: expirationDate,
	}, nil
}

func NewSet(batches ...Batch) BatchSet {
	set := make(BatchSet)
	for _, batch := range batches {
		set[batch.ID] = batch
	}
	return set
}

func (bs BatchSet) Add(b Batch) {
	bs[b.ID] = b
}

func (bs BatchSet) Remove(b Batch) error {
	if _, exists := bs[b.ID]; !exists {
		return fmt.Errorf("batch %s does not exist", b.ID)
	}
	delete(bs, b.ID)
	return nil
}

func (bs BatchSet) GetByID(batchID uuid.UUID) *Batch {
	if batch, ok := bs[batchID]; ok {
		return &batch
	}
	return nil
}

func (bs BatchSet) List() []Batch {
	batches := make([]Batch, 0, len(bs))
	for _, batch := range bs {
		batches = append(batches, batch)
	}
	return batches
}
