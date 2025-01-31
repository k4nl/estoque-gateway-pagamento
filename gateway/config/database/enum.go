package database

import "gorm.io/gorm"

func CreateDatabaseEnums(db *gorm.DB) {

	db.Exec("CREATE TYPE user_role AS ENUM ('admin', 'client')")
}
