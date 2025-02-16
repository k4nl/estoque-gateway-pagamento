package database

import (
	"fmt"
	"gateway/internal/infrastructure/schemas"
	"log"
	"os"

	_ "github.com/lib/pq" // Import necessário para PostgreSQL
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db     *gorm.DB
	logger *log.Logger
)

func InitDatabase() error {
	var err error

	// Initialize Postgres

	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	// Conectando ao banco de dados

	db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalln("Error connecting to the database: ", err)
		return err
	}

	// Create database enums

	CreateDatabaseEnums(db)

	// Migrate the schema
	if err := db.AutoMigrate(
		&schemas.User{},
		&schemas.Plan{},
		&schemas.PlanUsage{},
	); err != nil {
		log.Fatalln("Error migrating database: ", err)
		return err
	}

	SeedPlan(db)

	return nil
}

func GetDatabase() *gorm.DB {
	return db
}
