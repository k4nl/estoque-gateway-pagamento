package userService

import (
	"fmt"
	"gateway/config/events"
	userdto "gateway/internal/application/user/dto"
	"gateway/internal/domain/auth"
	"gateway/internal/domain/user"
	userRepository "gateway/internal/infrastructure/repository"
	response "gateway/internal/interfaces"
	"log"
)

type UserService struct {
	database *userRepository.UserRepository
	producer *events.UserProducer
}

// NewUserService cria uma nova instância do UserService.
func NewUserService(repository *userRepository.UserRepository, producer *events.UserProducer) *UserService {
	return &UserService{database: repository, producer: producer}
}

func (u *UserService) FindUser(userDocument string) *user.User {
	return u.database.FindUserByDocument(userDocument)
}

func (u *UserService) CreateClient(userDto *userdto.CreateUserDTO) (*response.CreateUserResponse, error) {

	newClient, err := user.NewClient(userDto.Name, userDto.Document, userDto.Password)

	if err != nil {
		return nil, err
	}

	userAlreadyExists := u.FindUser(newClient.Document)

	if userAlreadyExists != nil {
		return nil, fmt.Errorf("user already exists")
	}

	// Publish the event to the user channel
	err = u.producer.PublishUserEvent(events.UserCreated)

	if err != nil {

		log.Printf("error publishing event: %v", err)
		return nil, fmt.Errorf("error publishing event")
	}

	// create user credentials

	_, err = auth.CreateRSAKeys(&newClient.User)

	if err != nil {
		return nil, err
	}

	err = u.database.CreateClient(newClient)

	if err != nil {

		log.Printf("%s", err.Error())

		return nil, err
	}

	return &response.CreateUserResponse{
		Message: fmt.Sprintf("User %s created successfully", newClient.Name),
	}, nil
}
