package events

import (
	"github.com/redis/go-redis/v9"
)

type TransactionProducer struct {
	Producer *redis.Client
}

type TransactionEvents string

const (
	Deposit  TransactionEvents = "deposit"
	Withdraw TransactionEvents = "withdraw"
)

func SubscribeTransactionChannel() {
	// Certifique-se de que o cliente não é nil antes de tentar se inscrever
	if client == nil {
		panic("Redis client is not initialized")
	}

	// Use o cliente global para assinar o canal

	allEvents := []TransactionEvents{
		Deposit,
		Withdraw,
	}

	for _, event := range allEvents {
		client.Subscribe(ctx, string(event))
	}

}

func NewTransactionProducer(client *redis.Client) *TransactionProducer {
	return &TransactionProducer{Producer: client}
}

func (u *TransactionProducer) PublishTransactionEvent(event TransactionEvents) error {
	// Publish the event to the user channel
	err := u.Producer.Publish(ctx, string(event), string(event)).Err()
	if err != nil {
		return err
	}

	return nil
}

func (u *TransactionProducer) Close() {
	u.Producer.Close()
}

func (u *TransactionProducer) GetProducer() *redis.Client {
	return u.Producer
}
