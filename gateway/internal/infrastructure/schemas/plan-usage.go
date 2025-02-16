package schemas

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlanUsage struct {
	UserID                     uuid.UUID `gorm:"type:uuid;not null"`
	PlanID                     uuid.UUID `gorm:"type:uuid;not null"`
	ProductsLimitUsed          int       `gorm:"default:0"`
	CategoriesLimitUsed        int       `gorm:"default:0"`
	RequestsPerDayLimitUsed    int       `gorm:"default:0"`
	RequestsPerMinuteLimitUsed int       `gorm:"default:0"`

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Plan Plan `gorm:"foreignKey:PlanID;constraint:OnDelete:CASCADE"`

	gorm.Model
}
