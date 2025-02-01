package schemas

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserAuth struct {
	gorm.Model

	UserID        uuid.UUID `gorm:"primaryKey;size:36"`
	URLPrivateKey string    `gorm:"size:255"`
	URLPublicKey  string    `gorm:"size:255"`

	// Relacionamento reverso com User
	User *User `gorm:"foreignKey:UserID"`
}
