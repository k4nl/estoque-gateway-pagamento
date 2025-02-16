package user

import (
	value_object "gateway/package/value-object"
	"time"
)

type Admin struct {
	User
}

func NewAdmin(userName, userDocument string) (*Admin, error) {

	if _, err := value_object.ValidadeName(userName); err != nil {
		return nil, err
	}

	if _, err := value_object.ValidadeDocument(userDocument); err != nil {
		return nil, err
	}

	return &Admin{
		User: User{
			Name:      userName,
			Document:  userDocument,
			Role:      AdminRole,
			IsBlocked: false,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
