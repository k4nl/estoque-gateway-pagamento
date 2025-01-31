package router

import (
	"gateway/config/database"
	"gateway/config/events"
	userController "gateway/internal/application/user/controller"
	userService "gateway/internal/application/user/service"
	"gateway/internal/infrastructure/repository"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(server *gin.Engine) {

	database := database.GetDatabase()
	userRepository := repository.NewUserRepository(database)
	userProducer := events.NewUserProducer(events.GetRedisClient())
	service := userService.NewUserService(userRepository, userProducer)
	controller := userController.NewUserController(service)

	server.GET("/user/:document", func(c *gin.Context) {
		controller.FindUser(c)
	})

	server.POST("/user", func(c *gin.Context) {
		controller.CreateUser(c)
	})
}
