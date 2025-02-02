package user

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Document  string    `json:"document"`
	Password  string    `json:"password"`
	Role      Role      `json:"role"`
	IsBlocked bool      `json:"is_blocked"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
}

type Role string

const (
	AdminRole  Role = "admin"
	ClientRole Role = "client"
)

func (u *User) Block() error {

	if u.Role == AdminRole {
		return errors.New("admin user cannot be blocked")
	}

	u.IsBlocked = true
	u.UpdatedAt = time.Now().Format(time.RFC3339)

	return nil
}

func (u *User) Unblock() error {
	u.IsBlocked = false
	return nil
}
