package authdto

import value_object "gateway/package/value-object"

type LoginDTO struct {
	Document string `json:"document" validate:"required,min=11,max=14"`
	Password string `json:"password" validate:"required"`
}

func New(document, password string) (*LoginDTO, error) {

	if _, err := value_object.ValidadeDocument(document); err != nil {
		return nil, err
	}

	if _, err := value_object.ValidatePassword(password); err != nil {
		return nil, err
	}

	return &LoginDTO{Document: value_object.CleanDocument(document), Password: password}, nil

}
