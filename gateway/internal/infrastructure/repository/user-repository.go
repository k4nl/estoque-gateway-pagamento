package repository

import (
	"fmt"
	"gateway/internal/domain/application/user"
	"gateway/internal/infrastructure/schemas"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// FindUserByDocument encontra um usuário pelo documento.
func (r *Repository) FindUserByDocument(document string) *user.User {
	var user user.User
	// Procurar o usuário pelo documento
	result := r.Database.Where("document = ?", document).First(&user)

	// Se o erro é "record not found", retornamos nil
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding user: %v", result.Error)
		return nil
	}

	// Se o usuário foi encontrado, retornamos o objeto
	return &user
}

func (r *Repository) FindUserById(id uuid.UUID) *user.User {
	var user user.User
	// Procurar o usuário pelo documento
	result := r.Database.Where("id = ?", id).First(&user)

	// Se o erro é "record not found", retornamos nil
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding user: %v", result.Error)
		return nil
	}

	// Se o usuário foi encontrado, retornamos o objeto
	return &user
}

func (r *Repository) FindClientById(id uuid.UUID) *user.Client {
	var client user.Client
	// Procurar o usuário pelo documento
	result := r.Database.Model(&schemas.User{}).Where("id = ?", id).First(&client)

	// Se o erro é "record not found", retornamos nil
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		// Em caso de erro diferente, logamos e retornamos o erro
		log.Printf("Error finding user: %v", result.Error)
		return nil
	}

	// Se o usuário foi encontrado, retornamos o objeto
	return &client
}

// SaveClient salva um novo usuário (client) no banco de dados.
func (r *Repository) CreateClient(clientData *user.Client) error {

	transaction := r.Database.Begin()

	if err := transaction.Find(&schemas.Plan{}, "name = ?", clientData.Plan.Name).Error; err != nil {
		transaction.Rollback()
		return fmt.Errorf("error finding plan: %v", err)
	}

	clientSchema := schemas.User{
		ID:        clientData.ID,
		Name:      clientData.Name,
		Document:  clientData.Document,
		Password:  clientData.Password,
		Role:      clientData.Role,
		IsBlocked: clientData.IsBlocked,
		CreatedAt: clientData.CreatedAt,
		UpdatedAt: clientData.UpdatedAt,
		PlanID:    clientData.Plan.ID,
		PlanUsage: &schemas.PlanUsage{
			UserID: clientData.ID,
			PlanID: clientData.Plan.ID,
		},
	}

	if err := transaction.Create(&clientSchema).Error; err != nil {
		transaction.Rollback()
		return fmt.Errorf("error saving client: %v", err)
	}

	// Confirmar transação
	if err := transaction.Commit().Error; err != nil {
		log.Fatalf("Erro ao fazer commit: %v", err)
	}

	return nil
}

func (r *Repository) UpdateUser(userData *user.User) error {
	result := r.Database.Model(&schemas.User{}).Where("id = ?", userData.ID).Updates(user.User{
		Password:  userData.Password,
		IsBlocked: userData.IsBlocked,
		UpdatedAt: userData.UpdatedAt,
	})

	if result.Error != nil {
		return fmt.Errorf("error updating user: %v", result.Error)
	}

	return nil
}

func (r *Repository) UpdateClientPlan(client *user.Client) error {
	result := r.Database.Model(&schemas.User{}).Where("id = ?", client.ID).Updates(user.Client{
		Plan:      client.Plan,
		PlanUsage: client.PlanUsage,
	})

	if result.Error != nil {
		return fmt.Errorf("error updating client plan: %v", result.Error)
	}

	return nil
}
