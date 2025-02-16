package userService

import (
	"fmt"
	"gateway/config/events"
	userdto "gateway/internal/application/user/dto"
	"gateway/internal/domain/application/plan"
	planDomain "gateway/internal/domain/application/plan"
	"gateway/internal/domain/application/user"
	"gateway/internal/domain/core/auth"
	repository "gateway/internal/infrastructure/repository"
	response "gateway/internal/interfaces"
	"log"

	"github.com/google/uuid"
)

type UserService struct {
	database *repository.Repository
	producer *events.UserProducer
}

// NewUserService cria uma nova instância do UserService.
func NewUserService(repository *repository.Repository, producer *events.UserProducer) *UserService {
	return &UserService{database: repository, producer: producer}
}

func (u *UserService) FindUser(userDocument string) *user.User {
	return u.database.FindUserByDocument(userDocument)
}

func (u *UserService) FindClientById(userId uuid.UUID) *user.Client {
	return u.database.FindClientById(userId)
}

func (u *UserService) CreateClient(userDto *userdto.CreateUserDTO) (*response.CreateUserResponse, error) {

	plan := u.database.FindPlanByName(plan.Free)

	if plan == nil {
		return nil, fmt.Errorf("plan not found")
	}

	newClient, err := user.NewClient(userDto.Name, userDto.Document, userDto.Password, plan)

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

func (u *UserService) BlockUser(userId uuid.UUID) error {

	user := u.database.FindUserById(userId)

	if user == nil {
		return fmt.Errorf("user not found")
	}

	if user.IsBlocked {
		return fmt.Errorf("user is already blocked")
	}

	user.Block()

	err := u.database.UpdateUser(user)

	if err != nil {
		return err
	}

	return nil

}

func (u *UserService) UnblockUser(userId uuid.UUID) error {

	user := u.database.FindUserById(userId)

	if user == nil {
		return fmt.Errorf("user not found")
	}

	if user.IsBlocked {
		return fmt.Errorf("user is already blocked")
	}

	user.Unblock()

	err := u.database.UpdateUser(user)

	if err != nil {
		return err
	}

	return nil

}

func (u *UserService) ChangePassword(changeUserPasswordDTO userdto.ChangeUserPasswordDTO, userPayload user.User) error {

	user := u.database.FindUserById(userPayload.ID)

	if user == nil {
		return fmt.Errorf("user not found")
	}

	if user.IsBlocked {
		return fmt.Errorf("user is blocked")
	}

	user.ChangePassword(changeUserPasswordDTO)

	err := u.database.UpdateUser(user)

	if err != nil {
		return err
	}

	return nil

}

func (u *UserService) UpgradePlan(upgradeUserPlanDTO userdto.UpgradeUserPlanDTO, clientPayload *user.Client) error {

	client := u.database.FindClientById(clientPayload.ID)
	plan := u.database.FindPlanById(upgradeUserPlanDTO.PlanId)

	if client == nil {
		return fmt.Errorf("user not found")
	}

	if client.IsBlocked {
		return fmt.Errorf("user is blocked")
	}

	if plan == nil {
		return fmt.Errorf("plan not found")
	}

	if client.Plan.Name == plan.Name {
		return fmt.Errorf("user already has this plan")
	}

	if !plan.IsAvailable {
		return fmt.Errorf("plan is not available")
	}

	newUserPlan := planDomain.NewPlanUsage(client.Plan, *plan)

	client.UpgradePlan(*newUserPlan)

	err := u.database.UpdateClientPlan(client)

	if err != nil {
		return err
	}

	return nil

}
