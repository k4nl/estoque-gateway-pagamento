package user

import (
	"gateway/package/document"
	"gateway/package/name"
	"gateway/package/password"
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

	if _, err := name.ValidadeName(userName); err != nil {
		return nil, err
	}

	if _, err := document.ValidadeDocument(userDocument); err != nil {
		return nil, err
	}

	pwd, err := password.NewPassword(userPassword)
	if err != nil {
		return nil, err
	}

	return &Client{
		User: User{
			ID:        uuid.New(),
			Name:      userName,
			Document:  document.CleanDocument(userDocument),
			Role:      ClientRole,
			IsBlocked: false,
			Password:  pwd.String(),
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		},
		Plan: Free,
	}, nil

}
