package user

import (
	value_object "gateway/package/value-object"
	"time"

	"github.com/google/uuid"
)

type Client struct {
	User
	Plan Plan `json:"plan"`
}

type Plan string

const (
	Free    Plan = "free"
	Basic   Plan = "basic"
	Premium Plan = "premium"
)

func NewClient(userName string, userDocument string, userPassword string) (*Client, error) {

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
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		},
		Plan: Free,
	}, nil

}
