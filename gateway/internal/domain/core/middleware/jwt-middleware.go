package middleware

import (
	"errors"
	userService "gateway/internal/application/user/service"
	"gateway/internal/domain/application/user"
	"gateway/internal/domain/core/token"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ValidateUserJwt(c *gin.Context) (*token.Token, error) {

	// Extrai o token do cabeçalho Authorization
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return nil, errors.New("authorization header missing")
	}

	// Valida o token
	parsedToken, err := token.ParseToken(authHeader)
	if err != nil {
		return nil, errors.New("invalid token")
	}

	// Verifica se o usuário está bloqueado
	if parsedToken.IsBlocked {
		return nil, errors.New("user is blocked")
	}

	return parsedToken, nil

}

func JWTAuthClientMiddleware(userService *userService.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Valida o token JWT
		parsedToken, err := ValidateUserJwt(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": err.Error()})
			c.Abort()
			return
		}

		// Busca o cliente no banco pelo ID do token
		client := userService.FindClientById(uuid.MustParse(parsedToken.UserID))

		if client == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": "User not found"})
			c.Abort()
			return
		}

		// Verifica se o usuário está bloqueado
		if client.IsBlocked {
			c.JSON(http.StatusForbidden, gin.H{"Message": "User is blocked"})
			c.Abort()
			return
		}

		// Adiciona o cliente ao contexto
		c.Set("user", client)
		c.Next()
	}
}

func JWTAuthAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extrai o token do cabeçalho Authorization
		parsedToken, err := ValidateUserJwt(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": err.Error()})
			c.Abort()
			return
		}

		// Verifica se o usuário é admin

		if parsedToken.Role != user.AdminRole {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
			c.Abort()
			return
		}

		// Adiciona informações do token ao contexto
		c.Set("user", parsedToken)
		c.Next()
	}
}

func JWTAuthMiddleware(userService *userService.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extrai o token do cabeçalho Authorization
		parsedToken, err := ValidateUserJwt(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": err.Error()})
			c.Abort()
			return
		}

		user := userService.FindUser(parsedToken.UserID)

		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Message": "User not found"})
			c.Abort()
			return
		}

		// Adiciona informações do token ao contexto
		c.Set("user", user)
		c.Next()
	}
}
