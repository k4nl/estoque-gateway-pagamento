package value_object

import (
	"errors"
	"regexp"
)

type Name struct {
	value string
}

func ValidadeName(value string) (*Name, error) {
	// Verifica se o nome tem entre 6 e 20 caracteres e contém apenas letras e números
	var nameRegex = regexp.MustCompile(`^[a-zA-Z0-9]{6,20}$`)

	if !nameRegex.MatchString(value) {
		return nil, errors.New("invalid name: must contain only alphanumeric characters and be between 6 and 20 characters long")
	}

	return &Name{value: value}, nil
}
