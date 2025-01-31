package routes

import (
	router "gateway/internal/application/user/routes"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes is a function that registers routes in the application

func RegisterRoutes(server *gin.Engine) {
	router.RegisterUserRoutes(server)
}
