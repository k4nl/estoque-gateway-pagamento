package userdto

type CreateUserDTO struct {
	Name     string `json:"name" validate:"required,min=6,max=20"`
	Document string `json:"document" validate:"required,min=11,max=14"`
	Password string `json:"password" validate:"required,min=6,max=20"`
}
