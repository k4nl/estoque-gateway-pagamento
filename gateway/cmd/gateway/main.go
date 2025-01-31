package main

import (
	"gateway/config"
	"gateway/config/database"
	"gateway/config/events"
	"gateway/config/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	logger := config.NewLogger("GATEWAY")
	err := database.InitDatabase()

	if err != nil {
		logger.Errorf("Error initializing database: %v", err)
	}

	err = events.StartClient()

	if err != nil {
		logger.Errorf("Error initializing Redis: %v", err)
	}

	server := gin.Default()

	routes.RegisterRoutes(server)

	server.Run(":8080")
}
