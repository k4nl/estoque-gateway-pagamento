package webhook

import "github.com/google/uuid"

type TransactionStatus string

const (
	Success TransactionStatus = "success"
	Denied  TransactionStatus = "denied"
)

type TransactionDTO struct {
	TransactionID string            `json:"transaction_id"`
	Amount        int               `json:"amount"`
	Status        TransactionStatus `json:"status"`
	ExternalID    uuid.UUID         `json:"external_id"`
}

type QrcodeDto struct {
	TransactionID string `json:"transaction_id"`
	Amount        int    `json:"amount"`
	ExternalID    string `json:"external_id"`
	PaymentLink   string `json:"payment_link"`
	PaymentCode   string `json:"payment_code"`
}
