package events

import (
	"encoding/json"
	"fmt"
	webhookservice "gateway/internal/application/webhook/service"

	"github.com/redis/go-redis/v9"
)

type WebhookListener struct {
	Listener *redis.Client
}

type WebhookListenerEvents string

type WebhookChannels map[*redis.PubSub]WebhookListenerEvents

const (
	TransactionResponse WebhookListenerEvents = "transaction_response"
)

var webhookChannels = make(WebhookChannels)

func SubscribeWebhookListenerChannel() {

	if client == nil {
		panic("Redis client is not initialized")
	}

	allEvents := []WebhookListenerEvents{
		TransactionResponse,
	}

	for _, event := range allEvents {
		ch := client.Subscribe(ctx, string(event))

		webhookChannels[ch] = event
	}
}

func NewWebhookListener(client *redis.Client) *WebhookListener {
	return &WebhookListener{Listener: client}
}

func (u *WebhookListener) ReceiveWebhookEvent(event WebhookListenerEvents, ws *webhookservice.WebhookService) error {

	// find the channel for the event

	for ch, e := range webhookChannels {
		if e == event {
			msg, err := ch.ReceiveMessage(ctx)
			if err != nil {
				return err
			}

			var transactionPayload webhookservice.TransactionReceivedMessage
			err = json.Unmarshal([]byte(msg.Payload), &transactionPayload)
			if err != nil {
				return fmt.Errorf("erro ao deserializar payload: %v", err)
			}

			// call the service to handle the event

			err = ws.TransactionHandler(transactionPayload)

			if err != nil {
				return err
			}

			return nil
		}
	}

	return nil
}

func (u *WebhookListener) Close() {
	u.Listener.Close()
}

func (u *WebhookListener) GetListener() *redis.Client {
	return u.Listener
}

func (u *WebhookListener) GetWebhookChannels() WebhookChannels {
	return webhookChannels
}

func (u *WebhookListener) UnsubscribeWebhookListenerChannel(channel WebhookListenerEvents) {
	for ch, e := range webhookChannels {
		if e == channel {
			ch.Unsubscribe(ctx)
			delete(webhookChannels, ch)
		}
	}
}

func (u *WebhookListener) UnsubscribeAllWebhookListenerChannels() {
	for ch := range webhookChannels {
		ch.Unsubscribe(ctx)
		delete(webhookChannels, ch)
	}
}
