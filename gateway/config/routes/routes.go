package routes

import (
	router "gateway/internal/application/user/routes"
	"gateway/internal/infrastructure/repository"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes is a function that registers routes in the application

func RegisterRoutes(server *gin.Engine, repository *repository.Repository) {
	router.RegisterUserRoutes(server, repository)
}
