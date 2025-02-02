package product

import (
	"gateway/internal/domain/application/batch"

	"github.com/google/uuid"
)

type UnitOfMeasure string

const (
	KILOGRAM   UnitOfMeasure = "kilogram"
	GRAM       UnitOfMeasure = "gram"
	LITER      UnitOfMeasure = "liter"
	MILLILITER UnitOfMeasure = "milliliter"
	METER      UnitOfMeasure = "meter"
	CENTIMETER UnitOfMeasure = "centimeter"
	UNIT       UnitOfMeasure = "unit"
	INCH       UnitOfMeasure = "inch"
	FOOT       UnitOfMeasure = "foot"
	YARD       UnitOfMeasure = "yard"
	GALLON     UnitOfMeasure = "gallon"
)

type PhysicalProduct struct {
	Product       Product
	Batches       batch.BatchSet
	UnitOfMeasure UnitOfMeasure
}

func NewPhysicalProduct(
	product Product,
	batches batch.BatchSet,
	unitOfMeasure UnitOfMeasure,
) (*PhysicalProduct, error) {
	return &PhysicalProduct{
		Product:       product,
		Batches:       batches,
		UnitOfMeasure: unitOfMeasure,
	}, nil
}

func (p *PhysicalProduct) AddBatch(batch batch.Batch) {
	p.Batches.Add(batch)
}

func (p *PhysicalProduct) RemoveBatch(batch batch.Batch) error {
	return p.Batches.Remove(batch)
}

func (p *PhysicalProduct) ListBatches() []batch.Batch {
	return p.Batches.List()
}

func (p *PhysicalProduct) GetBatchByID(batchID uuid.UUID) *batch.Batch {
	return p.Batches.GetByID(batchID)
}
