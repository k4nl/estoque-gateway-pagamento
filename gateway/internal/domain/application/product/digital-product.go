package product

type DigitalProduct struct {
	Product          Product
	isUnlimitedStock bool
}

func NewDigitalProduct(product Product, isUnlimitedStock bool) (*DigitalProduct, error) {
	return &DigitalProduct{
		Product:          product,
		isUnlimitedStock: isUnlimitedStock,
	}, nil
}

func (d *DigitalProduct) IsUnlimitedStock() bool {
	return d.isUnlimitedStock
}

func (d *DigitalProduct) SetUnlimitedStock(unlimitedStock bool) {
	d.isUnlimitedStock = unlimitedStock
}

func (d *DigitalProduct) GetProduct() Product {
	return d.Product
}
