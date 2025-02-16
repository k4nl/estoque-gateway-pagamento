package user

import (
	"errors"
	"fmt"
	userdto "gateway/internal/application/user/dto"
	value_object "gateway/package/value-object"
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
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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
	u.UpdatedAt = time.Now()

	return nil
}

func (u *User) Unblock() error {
	u.IsBlocked = false
	u.UpdatedAt = time.Now()
	return nil
}

func (u *User) ChangePassword(changeUserPassword userdto.ChangeUserPasswordDTO) error {

	newPassword, err := value_object.NewPassword(changeUserPassword.NewPassword)

	if err != nil {
		return err
	}

	if _, err := value_object.ComparePassword(newPassword, u.Password); err != nil {
		return fmt.Errorf("invalid previous password")
	}

	u.Password = newPassword.String()

	return nil

}
