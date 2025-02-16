package transactionservice

import (
	"fmt"
	"gateway/config/events"
	"gateway/internal/domain/application/transaction"
	"gateway/internal/infrastructure/repository"

	"github.com/google/uuid"
)

type TransactionService struct {
	database *repository.Repository
	producer *events.TransactionProducer
}

func NewTransactionService(database *repository.Repository, producer *events.TransactionProducer) *TransactionService {
	return &TransactionService{database: database, producer: producer}
}

func (ts TransactionService) CreateQrcode(clientID uuid.UUID, amount float32, purpose transaction.TransactionPurpose) (*transaction.PaymentTransaction, error) {
	transaction := transaction.New(clientID, transaction.Deposit, amount, 0, nil, purpose)

	err := ts.database.CreateTransaction(transaction)

	if err != nil {
		return nil, err
	}

	qrcodeResponse, err := GenerateQrCode(amount, transaction.ID, clientID)

	if err != nil {
		ts.RejectTransaction(transaction)
		return nil, fmt.Errorf("error generating qrcode")
	}

	return qrcodeResponse, nil

}

func (ts TransactionService) RejectTransaction(transaction *transaction.Transaction) {
	transaction.Reject()
	ts.database.UpdateTransactionStatus(transaction)
}
