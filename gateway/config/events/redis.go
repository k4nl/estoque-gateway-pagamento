package events

import (
	"context"
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var client *redis.Client

var (
	redisHost = os.Getenv("REDIS_HOST")
	redisPort = os.Getenv("REDIS_PORT")
)

var ctx = context.Background()

func init() {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		panic("Error getting REDIS_HOST")
	}

	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		panic("Error getting REDIS_PORT")
	}

	redisPassword := os.Getenv("REDIS_PASSWORD")
	if redisPassword == "" {
		panic("Error getting REDIS_PASSWORD")
	}

}

// NewProducer cria um novo produtor Kafka
func StartClient() error {

	redisAddr := fmt.Sprintf("%s:%s", redisHost, redisPort)

	client := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	defer client.Close()

	_, err := client.Ping(ctx).Result()

	if err != nil {
		return fmt.Errorf("error connecting to Redis: %w", err)
	}

	SubscribeChannels()

	return nil
}

func SubscribeChannels() {
	SubscribeUserChannel()
}

func GetRedisClient() *redis.Client {
	return client
}
