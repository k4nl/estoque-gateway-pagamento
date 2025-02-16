package schemas

import (
	"gateway/internal/domain/application/transaction"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID                 uuid.UUID          `gorm:"primaryKey;size:36"`
	ClientID           uuid.UUID          `gorm:"size:36"`
	Type               transaction.Type   `gorm:"type:transaction_type"`
	Total              float32            `gorm:"type:float"`
	Discount           float32            `gorm:"type:float"`
	Status             transaction.Status `gorm:"type:transaction_status"`
	ExternalID         *string            `gorm:"size:36,omitempty"`
	TransactionPurpose transaction.TransactionPurpose
	CreatedAt          time.Time
	UpdatedAt          time.Time

	Client User `gorm:"foreignKey:ClientID"`

	gorm.Model
}
