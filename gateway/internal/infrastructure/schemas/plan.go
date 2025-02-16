package schemas

import (
	"gateway/internal/domain/application/plan"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Plan struct {
	gorm.Model

	ID                     uuid.UUID `gorm:"primaryKey;size:36"`
	Name                   plan.Name `gorm:"type:plan_name;uniqueIndex"`
	Description            string    `gorm:"size:200"`
	Price                  float32   `gorm:"type:decimal(4,2)"`
	IsAvailable            bool      `gorm:"default:true"`
	ProductsLimit          int
	CategoriesLimit        int
	RequestsPerDayLimit    int
	RequestsPerMinuteLimit int
	DashboardAccess        plan.DashboardAccess `gorm:"type:dashboard_access;index"`
}
