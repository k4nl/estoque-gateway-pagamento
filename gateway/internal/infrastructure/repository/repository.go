package repository

import "gorm.io/gorm"

type Repository struct {
	Database *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{Database: db}
}
