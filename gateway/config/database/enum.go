package database

import (
	"gorm.io/gorm"
)

func CreateDatabaseEnums(db *gorm.DB) {

	CreateUserRoleEnum(db)
	CreatePlanTypeEnum(db)
	CreateDashboardAccessEnum(db)
	CreateTransactionInfoPurposeEnum(db)

}

func CreateDashboardAccessEnum(db *gorm.DB) {

	query := `
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dashboard_access') THEN
					CREATE TYPE dashboard_access AS ENUM ('basic', 'premium', 'free');
				END IF;
			END $$;
		`

	// Executar a query
	db.Exec(query)
}

func CreatePlanTypeEnum(db *gorm.DB) {

	query := `
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_name') THEN
					CREATE TYPE plan_name AS ENUM ('basic', 'premium', 'free');
				END IF;
			END $$;
		`

	// Executar a query
	db.Exec(query)

}

func CreateUserRoleEnum(db *gorm.DB) {

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

func CreateTransactionInfoPurposeEnum(db *gorm.DB) {

	query := `
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_info_purpose') THEN
					CREATE TYPE transaction_info_purpose AS ENUM ('upgrade plan', 'quota increase');
				END IF;
			END $$;
		`

	// Executar a query
	db.Exec(query)

}
