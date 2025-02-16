package plan

import "github.com/google/uuid"

type PlanUsage struct {
	ID                         uuid.UUID `json:"id"`
	UserPlanUsage              Plan      `json:"user_plan_usage"`
	IsAvailable                bool      `json:"is_available"`
	ProductsLimitUsed          int       `json:"products_limit"`
	CategoriesLimitUsed        int       `json:"categories_limit"`
	RequestsPerDayLimitUsed    int       `json:"requests_per_day_limit"`
	RequestsPerMinuteLimitUsed int       `json:"requests_per_minute_limit"`
}

func NewPlanUsage(userPlanUsage Plan, userPlan Plan) *PlanUsage {
	return &PlanUsage{
		ID:                         uuid.New(),
		UserPlanUsage:              userPlanUsage,
		IsAvailable:                userPlan.IsAvailable,
		ProductsLimitUsed:          userPlan.ProductsLimit,
		CategoriesLimitUsed:        userPlan.CategoriesLimit,
		RequestsPerDayLimitUsed:    userPlan.RequestsPerDayLimit,
		RequestsPerMinuteLimitUsed: userPlan.RequestsPerMinuteLimit,
	}
}

func (pu *PlanUsage) IsUserPlanProductsLimitUsageExceeded() bool {
	return pu.UserPlanUsage.ProductsLimit < pu.ProductsLimitUsed
}

func (pu *PlanUsage) IsUserPlanCategoriesLimitUsageExceeded() bool {
	return pu.UserPlanUsage.CategoriesLimit < pu.CategoriesLimitUsed
}

func (pu *PlanUsage) IsUserPlanRequestsPerDayLimitUsageExceeded() bool {
	return pu.UserPlanUsage.RequestsPerDayLimit < pu.RequestsPerDayLimitUsed
}

func (pu *PlanUsage) IsUserPlanRequestsPerMinuteLimitUsageExceeded() bool {
	return pu.UserPlanUsage.RequestsPerMinuteLimit < pu.RequestsPerMinuteLimitUsed
}
