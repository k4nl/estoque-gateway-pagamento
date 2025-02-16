package authservice

import (
	"errors"
	authdto "gateway/internal/application/auth/dto"
	"gateway/internal/domain/core/token"
	"gateway/internal/infrastructure/repository"
)

type AuthService struct {
	repository *repository.Repository
}

func NewAuthService(repository *repository.Repository) *AuthService {
	return &AuthService{repository: repository}
}

func (a *AuthService) Login(loginDto *authdto.LoginDTO) (*string, error) {

	user := a.repository.FindUserByDocument(loginDto.Document)

	if user == nil {
		return nil, errors.New("user not found")
	}

	token, err := token.CreateToken(*user)

	if err != nil {
		return nil, err
	}

	return token, nil

}
