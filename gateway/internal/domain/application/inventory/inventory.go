package inventory

type Inventory struct{}

func NewInventory() *Inventory {
	return &Inventory{}
}

func Reserve(quantity float32) {}
