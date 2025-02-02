package product

import (
	"gateway/internal/domain/application/category"
	"gateway/internal/domain/application/inventory"

	"github.com/google/uuid"
)

type ProductReservationType string

const (
	Reservable    ProductReservationType = "reservable"
	NonReservable ProductReservationType = "non_reservable"
)

type Product struct {
	ID              uuid.UUID              `json:"id"`
	Name            string                 `json:"name"`
	Description     string                 `json:"description"`
	Category        category.CategorySet   `json:"category"`
	ReservationType ProductReservationType `json:"reservation_type"`
}

func NewProduct(
	name string,
	description string,
	category category.CategorySet,
	inventory inventory.Inventory,
	reservationType ProductReservationType,
) (*Product, error) {
	return &Product{
		ID:              uuid.New(),
		Name:            name,
		Description:     description,
		Category:        category,
		ReservationType: reservationType,
	}, nil
}

func (d *DigitalProduct) GetID() string {
	return d.Product.ID.String()
}

func (p *PhysicalProduct) GetID() string {
	return p.Product.ID.String()
}

func (d *DigitalProduct) GetName() string {
	return d.Product.Name
}

func (p *PhysicalProduct) GetName() string {
	return p.Product.Name
}

func (d *DigitalProduct) GetDescription() string {
	return d.Product.Description
}

func (p *PhysicalProduct) GetDescription() string {
	return p.Product.Description
}

func (d *DigitalProduct) GetCategories() category.CategorySet {
	return d.Product.Category
}

func (p *PhysicalProduct) GetCategories() category.CategorySet {
	return p.Product.Category
}

func (d *DigitalProduct) GetReservationType() ProductReservationType {
	return d.Product.ReservationType
}

func (p *PhysicalProduct) GetReservationType() ProductReservationType {
	return p.Product.ReservationType
}

func (d *DigitalProduct) SetName(name string) {
	d.Product.Name = name
}

func (p *PhysicalProduct) SetName(name string) {
	p.Product.Name = name
}

func (d *DigitalProduct) SetDescription(description string) {
	d.Product.Description = description
}

func (p *PhysicalProduct) SetDescription(description string) {
	p.Product.Description = description
}

func (d *DigitalProduct) SetCategories(categories category.CategorySet) {
	d.Product.Category = categories
}

func (p *PhysicalProduct) SetCategories(categories category.CategorySet) {
	p.Product.Category = categories
}

func (d *DigitalProduct) SetReservationType(reservationType ProductReservationType) {
	d.Product.ReservationType = reservationType
}

func (p *PhysicalProduct) SetReservationType(reservationType ProductReservationType) {
	p.Product.ReservationType = reservationType
}
