package plan

import "github.com/google/uuid"

type Name string

const (
	Free    Name = "free"
	Basic   Name = "basic"
	Premium Name = "premium"
)

type DashboardAccess string

const (
	FreeDashboard    DashboardAccess = "free"
	BasicDashboard   DashboardAccess = "basic"
	PremiumDashboard DashboardAccess = "premium"
)

type Plan struct {
	ID                     uuid.UUID       `json:"id"`
	Name                   Name            `json:"name"`
	Description            string          `json:"description"`
	Price                  float32         `json:"price"`
	IsAvailable            bool            `json:"is_available"`
	ProductsLimit          int             `json:"products_limit"`
	CategoriesLimit        int             `json:"categories_limit"`
	RequestsPerDayLimit    int             `json:"requests_per_day_limit"`
	RequestsPerMinuteLimit int             `json:"requests_per_minute_limit"`
	DashboardAccess        DashboardAccess `json:"dashboard_access"`
}

func New(id uuid.UUID, name Name, description string, price float32, isAvailable bool, productsLimit int, categoriesLimit int, requestsPerDayLimit int, requestsPerMinuteLimit int, dashboardAccess DashboardAccess) *Plan {
	return &Plan{
		ID:                     id,
		Name:                   name,
		Description:            description,
		Price:                  price,
		IsAvailable:            isAvailable,
		ProductsLimit:          productsLimit,
		CategoriesLimit:        categoriesLimit,
		RequestsPerDayLimit:    requestsPerDayLimit,
		RequestsPerMinuteLimit: requestsPerMinuteLimit,
		DashboardAccess:        dashboardAccess,
	}
}
