package transaction

import (
	"time"

	"github.com/google/uuid"
)

type Type string
type Status string
type TransactionPurpose string

const (
	Deposit  Type = "deposit"
	Withdraw Type = "withdraw"
)

const (
	Approved Status = "approved"
	Pending  Status = "pending"
	Rejected Status = "rejected"
	Returned Status = "returned"
)

const (
	UpgradePlan   TransactionPurpose = "upgrade plan"
	QuotaIncrease TransactionPurpose = "quota increase"
)

type Transaction struct {
	ID                 uuid.UUID          `json:"id"`
	UserId             uuid.UUID          `json:"user"`
	Type               Type               `json:"type"`
	Total              float32            `json:"total"`
	Discount           float32            `json:"discount"`
	Status             Status             `json:"status"`
	ExternalID         *string            `json:"external_id,omitempty"`
	CreatedAt          time.Time          `json:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at"`
	TransactionPurpose TransactionPurpose `json:"transaction_purpose"`
}

func New(userId uuid.UUID, transactionType Type, total, discount float32, externalID *string, purpose TransactionPurpose) *Transaction {
	return &Transaction{
		ID:                 uuid.New(),
		UserId:             userId,
		Type:               transactionType,
		Total:              total,
		Discount:           discount,
		Status:             Pending,
		ExternalID:         externalID,
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
		TransactionPurpose: purpose,
	}
}

func (t *Transaction) Approve() {
	t.Status = Approved
	t.UpdatedAt = time.Now()
}

func (t *Transaction) Reject() {
	t.Status = Rejected
	t.UpdatedAt = time.Now()
}

func (t *Transaction) Return() {
	t.Status = Returned
	t.UpdatedAt = time.Now()
}

func (t *Transaction) UpdateExternalID(externalID string) {
	t.ExternalID = &externalID
	t.UpdatedAt = time.Now()
}
