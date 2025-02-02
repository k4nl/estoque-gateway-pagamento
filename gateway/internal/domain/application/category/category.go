package category

import (
	"fmt"

	"github.com/google/uuid"
)

type Category struct {
	ID      uuid.UUID  `json:"id"`
	Name    string     `json:"name"`
	OwnerID *uuid.UUID `json:"owner_id,omitempty"`
}

type CategorySet map[Category]struct{}

func New(name string, ownerID *uuid.UUID) (*Category, error) {
	return &Category{
		ID:      uuid.New(),
		Name:    name,
		OwnerID: ownerID,
	}, nil
}

func NewSet() CategorySet {
	return make(CategorySet)
}

func (cs CategorySet) Add(c Category) {
	cs[c] = struct{}{}
}

func (cs CategorySet) Remove(c Category) error {
	if _, exists := cs[c]; !exists {
		return fmt.Errorf("category %s does not exist", c.ID)
	}
	delete(cs, c)
	return nil
}

func (cs CategorySet) List(userID *uuid.UUID) []Category {
	categories := make([]Category, 0, len(cs))
	for c := range cs {
		// Categoria pública ou pertence ao usuário
		if c.OwnerID == nil || (userID != nil && *c.OwnerID == *userID) {
			categories = append(categories, c)
		}
	}
	return categories
}
