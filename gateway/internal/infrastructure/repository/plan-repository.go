package repository

import (
	"gateway/internal/domain/application/plan"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *Repository) FindPlanByName(name plan.Name) *plan.Plan {

	var plan plan.Plan
	result := r.Database.Where("name = ?", name).First(&plan)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding plan: %v", result.Error)
		return nil
	}
	return &plan
}

func (r *Repository) FindPlanById(id uuid.UUID) *plan.Plan {

	// deve retornar a instancia de plan e nao o que esta no banco

	var plan plan.Plan
	result := r.Database.Where("id = ?", id).First(&plan)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding plan: %v", result.Error)
		return nil
	}

	return &plan

}
