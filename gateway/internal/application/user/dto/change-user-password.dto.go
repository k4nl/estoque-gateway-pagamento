package userdto

import (
	value_object "gateway/package/value-object"
)

type ChangeUserPasswordDTO struct {
	PreviousPassword string `json:"previous_password"`
	NewPassword      string `json:"new_password"`
}

func New(previousPassword, newPassword string) (*ChangeUserPasswordDTO, error) {

	_, err := value_object.ValidatePassword(newPassword)

	if err != nil {
		return nil, err
	}

	_, err = value_object.ValidatePassword(previousPassword)

	if err != nil {
		return nil, err
	}

	return &ChangeUserPasswordDTO{
		PreviousPassword: previousPassword,
		NewPassword:      newPassword,
	}, nil
}
