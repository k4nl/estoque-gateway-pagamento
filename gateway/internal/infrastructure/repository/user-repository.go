package repository

import (
	"fmt"
	"gateway/internal/domain/user"
	"gateway/internal/infrastructure/schemas"
	"log"

	"gorm.io/gorm"
)

type UserRepository struct {
	Database *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{Database: db}
}

// FindUserByDocument encontra um usuário pelo documento.
func (u *UserRepository) FindUserByDocument(document string) *user.User {
	var user user.User
	// Procurar o usuário pelo documento
	result := u.Database.Where("document = ?", document).First(&user)

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

// SaveClient salva um novo usuário (client) no banco de dados.
func (r *UserRepository) CreateClient(clientData *user.Client) error {

	transaction := r.Database.Begin()

	if err := transaction.Create(&user.User{
		ID:        clientData.ID,
		Name:      clientData.Name,
		Document:  clientData.Document,
		Password:  clientData.Password,
		Role:      clientData.Role,
		IsBlocked: clientData.IsBlocked,
		CreatedAt: clientData.CreatedAt,
		UpdatedAt: clientData.UpdatedAt,
	}).Error; err != nil {
		transaction.Rollback()
		return fmt.Errorf("error saving client: %v", err)
	}

	if err := transaction.Create(&schemas.UserAuth{
		UserID:        clientData.ID,
		URLPrivateKey: fmt.Sprintf("private_key_%s_%s.pem", clientData.Name, clientData.Document),
		URLPublicKey:  fmt.Sprintf("public_key_%s_%s.pem", clientData.Name, clientData.Document),
	}).Error; err != nil {
		transaction.Rollback()
		return fmt.Errorf("error saving auth: %v", err)
	}

	// Confirmar transação
	if err := transaction.Commit().Error; err != nil {
		log.Fatalf("Erro ao fazer commit: %v", err)
	}

	return nil
}
