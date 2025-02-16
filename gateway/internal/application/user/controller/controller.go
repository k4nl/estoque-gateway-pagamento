package userController

import (
	"encoding/json"
	userdto "gateway/internal/application/user/dto"
	userService "gateway/internal/application/user/service"
	"gateway/internal/domain/application/user"
	value_object "gateway/package/value-object"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserController struct {
	UserService *userService.UserService
}

func NewUserController(userService *userService.UserService) *UserController {
	return &UserController{UserService: userService}
}

func (uc UserController) CreateUser(c *gin.Context) {

	// Parse request body
	var userDto *userdto.CreateUserDTO

	err := json.NewDecoder(c.Request.Body).Decode(&userDto)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": "Invalid request body"})
		return
	}

	response, err := uc.UserService.CreateClient(userDto)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

func (uc UserController) FindUser(c *gin.Context) {

	param_document := c.Param("document")

	validated_document, err := value_object.ValidadeDocument(param_document)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	response := uc.UserService.FindUser(validated_document.Value())

	c.JSON(http.StatusOK, response)
}

func (uc UserController) BlockUser(c *gin.Context) {
	param := c.Param("userId")

	err := uuid.Validate(param)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	userId, err := uuid.Parse(param)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	err = uc.UserService.BlockUser(userId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "User blocked successfully"})

}

func (uc UserController) UnblockUser(c *gin.Context) {
	param := c.Param("userId")

	err := uuid.Validate(param)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": "Invalid request body"})
		return
	}

	userId, err := uuid.Parse(param)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	err = uc.UserService.UnblockUser(userId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "User blocked successfully"})
}

func (uc UserController) ChangePassword(c *gin.Context) {

	var changePasswordDTO userdto.ChangeUserPasswordDTO

	err := json.NewDecoder(c.Request.Body).Decode(&changePasswordDTO)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": "Invalid request body"})
		return
	}

	userPayload, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
		return
	}

	user, ok := userPayload.(user.User)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
		return
	}

	err = uc.UserService.ChangePassword(changePasswordDTO, user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "Password changed successfully"})

}

func (uc UserController) UpgradePlan(c *gin.Context) {

	var upgradeUserPlanDTO userdto.UpgradeUserPlanDTO

	err := json.NewDecoder(c.Request.Body).Decode(&upgradeUserPlanDTO)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": "Invalid request body"})
		return
	}

	clientPayload, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
		return
	}

	clientData, ok := clientPayload.(user.Client)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
		return
	}

	err = uc.UserService.UpgradePlan(upgradeUserPlanDTO, &clientData)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "Plan upgraded successfully"})

}
