package userController

import (
	"encoding/json"
	userdto "gateway/internal/application/user/dto"
	userService "gateway/internal/application/user/service"
	value_object "gateway/package/value-object"
	"net/http"

	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
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
