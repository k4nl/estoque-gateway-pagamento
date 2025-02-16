package webhookservice

import (
	"errors"
	"gateway/internal/domain/application/transaction"
	"gateway/internal/infrastructure/repository"

	"github.com/google/uuid"
)

type TransactionReceivedMessage struct {
	TransactionID string
	Amount        float32
	ExternalID    uuid.UUID
	Status        transaction.Status
	Type          transaction.Type
}

type WebhookService struct {
	database *repository.Repository
}

func NewWebhookService(database *repository.Repository) *WebhookService {
	return &WebhookService{database: database}
}

func (ws WebhookService) TransactionHandler(message TransactionReceivedMessage) error {

	switch {
	case message.Status == transaction.Approved:
		return ws.transactionApproved(message)
	case message.Status == transaction.Rejected:
		return ws.transactionRejected(message)
	case message.Status == transaction.Returned:
		return ws.transactionReturned(message)
	default:
		return errors.New("invalid transaction status")
	}

}

func (ws WebhookService) transactionApproved(message TransactionReceivedMessage) error {

	transactionDb := ws.database.FindTransactionById(message.ExternalID)

	if transactionDb == nil {
		return errors.New("transaction not found")
	}

	transaction := transaction.New(
		transactionDb.ID,
		transactionDb.Type,
		transactionDb.Total,
		transactionDb.Discount,
		&message.TransactionID,
		transactionDb.TransactionPurpose,
	)

	transaction.Approve()

	err := ws.database.UpdateTransactionStatus(transaction)

	if err != nil {
		return err
	}

	return nil

}

func (ws WebhookService) transactionRejected(message TransactionReceivedMessage) error {

	transactionDb := ws.database.FindTransactionById(message.ExternalID)

	if transactionDb == nil {
		return errors.New("transaction not found")
	}

	transaction := transaction.New(
		transactionDb.ID,
		transactionDb.Type,
		transactionDb.Total,
		transactionDb.Discount,
		&message.TransactionID,
		transactionDb.TransactionPurpose,
	)

	transaction.Reject()

	err := ws.database.UpdateTransactionStatus(transaction)

	if err != nil {
		return err
	}

	return nil
}

func (ws WebhookService) transactionReturned(message TransactionReceivedMessage) error {

	transactionDb := ws.database.FindTransactionById(message.ExternalID)

	if transactionDb == nil {
		return errors.New("transaction not found")
	}

	transaction := transaction.New(
		transactionDb.ID,
		transactionDb.Type,
		transactionDb.Total,
		transactionDb.Discount,
		&message.TransactionID,
		transactionDb.TransactionPurpose,
	)

	transaction.Return()

	err := ws.database.UpdateTransactionStatus(transaction)

	if err != nil {
		return err
	}

	return nil
}
