package userdto

type CreateUserDTO struct {
	Name     string `json:"name" validate:"required"`
	Document string `json:"document" validate:"required"`
	Password string `json:"password" validate:"required"`
}
