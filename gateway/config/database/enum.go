package database

import (
	"gorm.io/gorm"
)

func CreateDatabaseEnums(db *gorm.DB) {

	query := `
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
					CREATE TYPE user_role AS ENUM ('admin', 'client');
				END IF;
			END $$;
		`

	// Executar a query
	db.Exec(query)

}
