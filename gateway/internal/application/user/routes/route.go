package router

import (
	"gateway/config/events"
	userController "gateway/internal/application/user/controller"
	userService "gateway/internal/application/user/service"
	"gateway/internal/domain/core/middleware"
	"gateway/internal/infrastructure/repository"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(server *gin.Engine, repository *repository.Repository) {

	userProducer := events.NewUserProducer(events.GetRedisClient())
	service := userService.NewUserService(repository, userProducer)
	controller := userController.NewUserController(service)

	userPublicRoutes := server.Group("/user")
	userSecuredRoutes := server.Group("/user").Use(middleware.JWTAuthMiddleware(service))
	adminSecuredRoutes := server.Group("/user").Use(middleware.JWTAuthAdminMiddleware())

	userPublicRoutes.POST("/", func(c *gin.Context) {
		controller.CreateUser(c)
	})

	userSecuredRoutes.GET("/:document", func(c *gin.Context) {
		controller.FindUser(c)
	})

	adminSecuredRoutes.PATCH("/:userId/block", func(c *gin.Context) {
		controller.BlockUser(c)
	})

	adminSecuredRoutes.PATCH("/:userId/unblock", func(c *gin.Context) {
		controller.UnblockUser(c)
	})

	userSecuredRoutes.PATCH("/password", func(c *gin.Context) {
		controller.ChangePassword(c)
	})

}
