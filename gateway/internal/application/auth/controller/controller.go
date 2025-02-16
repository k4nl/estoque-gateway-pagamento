package authController

import (
	"encoding/json"
	authdto "gateway/internal/application/auth/dto"
	authservice "gateway/internal/application/auth/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	AuthService *authservice.AuthService
}

func NewAuthController(authService *authservice.AuthService) *AuthController {
	return &AuthController{AuthService: authService}
}

func (ac AuthController) Login(c *gin.Context) {

	// Parse request body
	var authDto *authdto.LoginDTO

	err := json.NewDecoder(c.Request.Body).Decode(&authDto)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	// valida o authDto

	validatedDto, err := authdto.New(authDto.Document, authDto.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	response, err := ac.AuthService.Login(validatedDto)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}
