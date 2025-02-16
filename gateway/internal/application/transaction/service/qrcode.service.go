package transactionservice

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gateway/internal/domain/application/transaction"
	"gateway/internal/domain/core/token"
	"net/http"
	"os"

	"github.com/google/uuid"
)

type RequestData struct {
	Amount        float32   `json:"amount"`
	TransactionId uuid.UUID `json:"transaction_id"`
	ClientID      uuid.UUID `json:"client_id"`
}

type PaymentResponse struct {
	PaymentLink string `json:"payment_link"`
	PaymentCode string `json:"payment_code"`
}

func GenerateQrCode(amount float32, transactionId, clientID uuid.UUID) (*transaction.PaymentTransaction, error) {

	url := os.Getenv("PAYMENT_API_URL")

	if url == "" {
		return nil, fmt.Errorf("payment api url is required")
	}

	requestData := RequestData{
		Amount:        amount,
		TransactionId: transactionId,
		ClientID:      clientID,
	}

	requestHeader := http.Header{}

	clientToken, err := token.CreateExternalToken(clientID, token.PAYMENT)

	if err != nil {
		return nil, fmt.Errorf("error creating client token")
	}

	requestHeader.Set("Content-Type", "application/json")
	requestHeader.Set("Authorization", *clientToken)

	requestBody, err := json.Marshal(requestData)

	if err != nil {
		return nil, fmt.Errorf("invalid request data")
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))

	if err != nil {
		return nil, fmt.Errorf("error creating request")
	}

	req.Header = requestHeader

	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		return nil, fmt.Errorf("error making request")
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error creating payment")
	}

	var paymentResponse PaymentResponse

	err = json.NewDecoder(resp.Body).Decode(&paymentResponse)

	if err != nil {
		return nil, fmt.Errorf("error decoding response")
	}

	return transaction.NewPaymentTransaction(transactionId, paymentResponse.PaymentLink, paymentResponse.PaymentCode), nil
}
