package token

import (
	"errors"
	"fmt"
	"gateway/internal/domain/application/user"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Token struct {
	UserID    string `json:"user_id"`
	IsBlocked bool   `json:"is_blocked"`
	ExpiresAt int64  `json:"expires_at"`
	CreatedAt string `json:"created_at"`
}

var JWT_SECRET []byte

func init() {
	// Carrega as variáveis do .env
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Erro ao carregar o arquivo .env")
		os.Exit(1)
	}

	// Carrega a chave secreta

	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		fmt.Println("JWT_SECRET não configurado")
		os.Exit(1)
	}

	JWT_SECRET = []byte(secret)

}

func CreateToken(user user.User) (*string, error) {

	if user.IsBlocked {
		return nil, errors.New("user is blocked")
	}

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["UserId"] = user.ID
	claims["IsBlocked"] = user.IsBlocked
	claims["ExpiresAt"] = time.Now().Add(time.Hour).Unix()
	claims["CreatedAt"] = time.Now().Format(time.RFC3339)

	tokenString, err := token.SignedString(JWT_SECRET)

	if err != nil {
		return nil, err
	}

	return &tokenString, nil
}

func ParseToken(payload string) (*Token, error) {

	token, err := jwt.Parse(payload, func(token *jwt.Token) (interface{}, error) {
		return JWT_SECRET, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	if IsExpired(int64(claims["ExpiresAt"].(float64))) {
		return nil, errors.New("token expired")
	}

	tokenStruct := Token{
		UserID:    claims["UserId"].(string),
		IsBlocked: claims["IsBlocked"].(bool),
		ExpiresAt: int64(claims["ExpiresAt"].(float64)),
		CreatedAt: claims["CreatedAt"].(string),
	}

	return &tokenStruct, nil

}

func IsExpired(expires_at int64) bool {
	return time.Now().Unix() > expires_at
}
