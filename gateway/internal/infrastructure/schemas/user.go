package schemas

import (
	"gateway/internal/domain/application/user"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	// Se você não quer o campo deleted_at, remova gorm.Model
	gorm.Model

	ID        uuid.UUID `gorm:"primaryKey;size:36"`              // O ID pode ser uma string com um tamanho específico
	Name      string    `gorm:"size:20;index"`                   // Máximo de 20 caracteres
	Document  string    `gorm:"uniqueIndex;size:11"`             // Máximo de 11 caracteres
	Password  string    `gorm:"size:200"`                        // Máximo de 200 caracteres
	Role      user.Role `gorm:"type:user_role;default:'client'"` // Definindo um tipo enum com valores 'ADMIN' ou 'CLIENT'
	IsBlocked bool
	CreatedAt time.Time
	UpdatedAt time.Time

	// Relacionamento do usuario com o plano dele
	PlanID       uuid.UUID     `gorm:"type:uuid;not null"`
	Plan         Plan          `gorm:"foreignKey:PlanID"`
	PlanUsage    *PlanUsage    `gorm:"foreignKey:UserID"`
	Transactions []Transaction `gorm:"foreignKey:ClientID"`
}
