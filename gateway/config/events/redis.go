package events

import (
	"context"
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var client *redis.Client // Variável global

var (
	redisHost = os.Getenv("REDIS_HOST")
	redisPort = os.Getenv("REDIS_PORT")
)

var ctx = context.Background()

func init() {
	// Verifique as variáveis de ambiente para conectar ao Redis
	if redisHost == "" {
		panic("Error getting REDIS_HOST")
	}

	if redisPort == "" {
		panic("Error getting REDIS_PORT")
	}
}

// StartClient cria e inicializa o cliente Redis
func StartClient() error {
	redisAddr := fmt.Sprintf("%s:%s", redisHost, redisPort)

	// Inicialize o cliente Redis globalmente
	client = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	// Testa a conexão com o Redis
	_, err := client.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("error connecting to Redis: %w", err)
	}

	// Após a conexão, chama SubscribeChannels para se inscrever
	SubscribeChannels()

	return nil
}

func SubscribeChannels() {
	// Assine o canal de eventos do usuário
	SubscribeUserChannel()
}

// Função para acessar o cliente Redis globalmente
func GetRedisClient() *redis.Client {
	return client
}
