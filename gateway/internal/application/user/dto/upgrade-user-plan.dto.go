package userdto

import "github.com/google/uuid"

type UpgradeUserPlanDTO struct {
	PlanId uuid.UUID `json:"plan_id"`
}
