package events

import "github.com/redis/go-redis/v9"

type UserProducer struct {
	Producer *redis.Client
}

type UserEvents string

const (
	UserCreated UserEvents = "user_created"
)

func SubscribeUserChannel() {
	// Certifique-se de que o cliente não é nil antes de tentar se inscrever
	if client == nil {
		panic("Redis client is not initialized")
	}

	// Use o cliente global para assinar o canal
	client.Subscribe(ctx, "user_events")
}

func NewUserProducer(client *redis.Client) *UserProducer {
	return &UserProducer{Producer: client}
}

func (u *UserProducer) PublishUserEvent(event UserEvents) error {
	// Publish the event to the user channel
	err := u.Producer.Publish(ctx, "user_events", string(event)).Err()
	if err != nil {
		return err
	}

	return nil
}

func (u *UserProducer) Close() {
	u.Producer.Close()
}

func (u *UserProducer) GetProducer() *redis.Client {
	return u.Producer
}
