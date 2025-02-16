package user

import (
	"gateway/internal/domain/application/plan"
	value_object "gateway/package/value-object"
	"time"

	"github.com/google/uuid"
)

type Client struct {
	User
	Plan      plan.Plan      `json:"plan"`
	PlanUsage plan.PlanUsage `json:"plan_usage"`
}

func NewClient(userName string, userDocument string, userPassword string, plan *plan.Plan) (*Client, error) {

	if _, err := value_object.ValidadeName(userName); err != nil {
		return nil, err
	}

	if _, err := value_object.ValidadeDocument(userDocument); err != nil {
		return nil, err
	}

	pwd, err := value_object.NewPassword(userPassword)
	if err != nil {
		return nil, err
	}

	return &Client{
		User: User{
			ID:        uuid.New(),
			Name:      userName,
			Document:  value_object.CleanDocument(userDocument),
			Role:      ClientRole,
			IsBlocked: false,
			Password:  pwd.String(),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		Plan: *plan,
	}, nil

}

func (c *Client) UpgradePlan(planUsageData plan.PlanUsage) (*Client, error) {

	return &Client{
		Plan: planUsageData.UserPlanUsage,
		PlanUsage: plan.PlanUsage{
			ID:                      planUsageData.ID,
			UserPlanUsage:           planUsageData.UserPlanUsage,
			IsAvailable:             true,
			ProductsLimitUsed:       0,
			CategoriesLimitUsed:     0,
			RequestsPerDayLimitUsed: 0,
		},
	}, nil

}
