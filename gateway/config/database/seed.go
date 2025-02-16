package database

import (
	"gateway/internal/domain/application/plan"
	"gateway/internal/infrastructure/schemas"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedPlan(db *gorm.DB) {

	freePlan := plan.New(
		uuid.New(),
		plan.Free,
		"Plano gratuito",
		0,
		true,
		10,
		10,
		100,
		10,
		plan.FreeDashboard,
	)

	basicPlan := plan.New(
		uuid.New(),
		plan.Basic,
		"Plano básico",
		9.99,
		true,
		100,
		100,
		1000,
		100,
		plan.BasicDashboard,
	)

	premiumPlan := plan.New(
		uuid.New(),
		plan.Premium,
		"Plano premium",
		19.99,
		true,
		1000,
		1000,
		10000,
		1000,
		plan.PremiumDashboard,
	)

	if alreadyExists := db.First(&schemas.Plan{}, "name = ?", freePlan.Name).Error; alreadyExists != nil {
		log.Println("Creating free plan")
		db.Create(&freePlan)
	}

	if alreadyExists := db.First(&schemas.Plan{}, "name = ?", basicPlan.Name).Error; alreadyExists != nil {
		log.Println("Creating basic plan")
		db.Create(&basicPlan)
	}

	if alreadyExists := db.First(&schemas.Plan{}, "name = ?", premiumPlan.Name).Error; alreadyExists != nil {
		log.Println("Creating premium plan")
		db.Create(&premiumPlan)
	}

}
