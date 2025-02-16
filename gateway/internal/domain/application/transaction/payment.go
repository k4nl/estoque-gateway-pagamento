package transaction

import "github.com/google/uuid"

type PaymentTransaction struct {
	TransactionId uuid.UUID `json:"transaction_id"`
	PaymentLink   string    `json:"payment_link"`
	PaymentCode   string    `json:"payment_code"`
}

func NewPaymentTransaction(transactionID uuid.UUID, paymentLink, paymentCode string) *PaymentTransaction {
	return &PaymentTransaction{
		TransactionId: transactionID,
		PaymentLink:   paymentLink,
		PaymentCode:   paymentCode,
	}
}
