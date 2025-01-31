package user

import (
	"gateway/package/document"
	"gateway/package/name"
	"time"
)

type Admin struct {
	User
}

func NewAdmin(userName, userDocument string) (*Admin, error) {
	
	if _, err := name.ValidadeName(userName); err != nil {
		return nil, err
	}

	if _, err := document.ValidadeDocument(userDocument); err != nil {
		return nil, err
	}

	return &Admin{
		User: User{
			Name: userName,
			Document: userDocument,
			Role: AdminRole,
			IsBlocked: false,
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		},
	}, nil
}