package repository

import (
	"gateway/internal/domain/application/transaction"
	"gateway/internal/infrastructure/schemas"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *Repository) CreateTransaction(transaction *transaction.Transaction) error {

	result := r.Database.Create(&schemas.Transaction{
		ID:                 transaction.ID,
		ClientID:           transaction.UserId,
		Type:               transaction.Type,
		Total:              transaction.Total,
		Discount:           transaction.Discount,
		Status:             transaction.Status,
		ExternalID:         nil,
		TransactionPurpose: transaction.TransactionPurpose,
	})

	if result.Error != nil {
		log.Printf("Error creating transaction: %v", result.Error)
		return result.Error
	}

	return nil
}

func (r *Repository) FindTransactionById(transactionID uuid.UUID) *transaction.Transaction {

	var _transaction schemas.Transaction
	result := r.Database.Where("id = ?", transactionID).First(&_transaction)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding transaction: %v", result.Error)
		return nil
	}

	return &transaction.Transaction{
		ID:         _transaction.ID,
		UserId:     _transaction.ClientID,
		Type:       _transaction.Type,
		Total:      _transaction.Total,
		Discount:   _transaction.Discount,
		Status:     _transaction.Status,
		ExternalID: _transaction.ExternalID,
		CreatedAt:  _transaction.CreatedAt,
		UpdatedAt:  _transaction.UpdatedAt,
	}
}

func (r *Repository) UpdateTransactionStatus(transaction *transaction.Transaction) error {

	result := r.Database.Model(&schemas.Transaction{}).Where("id = ?", transaction.ID).Updates(schemas.Transaction{
		Status:    transaction.Status,
		UpdatedAt: transaction.UpdatedAt,
	})

	if result.Error != nil {
		log.Printf("Error updating transaction: %v", result.Error)
		return result.Error
	}

	return nil
}
