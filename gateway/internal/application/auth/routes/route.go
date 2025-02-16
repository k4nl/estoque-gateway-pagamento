package router

import (
	authController "gateway/internal/application/auth/controller"
	authService "gateway/internal/application/auth/service"
	"gateway/internal/infrastructure/repository"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(server *gin.Engine, repository *repository.Repository) {

	service := authService.NewAuthService(repository)
	controller := authController.NewAuthController(service)

	server.POST("/login", func(c *gin.Context) {
		controller.Login(c)
	})

}
