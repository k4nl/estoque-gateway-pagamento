package value_object

import (
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type Password struct {
	value string
}

func Encrypt(value string) (*Password, error) {

	value = strings.TrimSpace(value)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(value), bcrypt.DefaultCost)

	if err != nil {
		return nil, err
	}

	return &Password{value: string(hashedPassword)}, nil

}

func Compare(password Password, value string) (*Password, error) {

	err := bcrypt.CompareHashAndPassword([]byte(password.value), []byte(value))

	if err != nil {
		return nil, err
	}

	return &password, nil
}

func Validate(value string) (*Password, error) {

	value = strings.TrimSpace(value)

	if len(value) < 6 {
		return nil, errors.New("invalid password: must have at least 6 characters")
	}

	return &Password{value: value}, nil
}

func NewPassword(value string) (*Password, error) {

	if _, err := Validate(value); err != nil {
		return nil, err
	}

	return Encrypt(value)

}

func (p *Password) String() string {
	return p.value
}
