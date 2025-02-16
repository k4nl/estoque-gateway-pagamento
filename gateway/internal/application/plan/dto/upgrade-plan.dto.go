package plandto

import (
	"fmt"
	"regexp"
	"strconv"

	"github.com/google/uuid"
)

type PaymentType string
type KeyType string

const (
	Credit PaymentType = "credit"
	PIX    PaymentType = "pix"
)

type CreditPaymentDTO struct {
	HolderName string `json:"holder_name"`
	CardNumber string `json:"card_number"`
	Expiration string `json:"expiration"`
	CVV        string `json:"cvv"`
}

type UpgradePlanDTO struct {
	PlanID      uuid.UUID         `json:"plan_id"`
	PaymentType PaymentType       `json:"payment_type"`
	CreditCard  *CreditPaymentDTO `json:"credit_card"`
}

func ValidatePayment(paymentType PaymentType, creditCard *CreditPaymentDTO) error {

	if paymentType == "" {
		return fmt.Errorf("payment type is required")
	}

	if paymentType == Credit {
		return ValidateCreditCardPayment(creditCard)
	}

	return nil
}

func ValidateCreditCardPayment(creditCard *CreditPaymentDTO) error {

	if creditCard == nil {
		return fmt.Errorf("credit card data is required")
	}

	err := ValidateHolderName(creditCard.HolderName)

	if err != nil {
		return err
	}

	err = ValidateCardNumber(creditCard.CardNumber)

	if err != nil {
		return err
	}

	err = ValidateCardExpiration(creditCard.Expiration)

	if err != nil {
		return err
	}

	err = ValidateCVV(creditCard.CVV)

	if err != nil {
		return err
	}

	return nil

}

func ValidateHolderName(holderName string) error {

	if holderName == "" {
		return fmt.Errorf("holder name is required")
	}

	return nil
}

func ValidateCardNumber(cardNumber string) error {

	if cardNumber == "" {
		return fmt.Errorf("card number is required")
	}

	// remove all non-numeric characters
	cardNumber = regexp.MustCompile("[^0-9]").ReplaceAllString(cardNumber, "")

	if len(cardNumber) != 16 {
		return fmt.Errorf("card number invalid")
	}

	return nil
}

func ValidateCardExpiration(expiration string) error {

	// format MM/YY or MM/YYYY

	if expiration == "" {
		return fmt.Errorf("expiration is required")
	}

	if len(expiration) != 5 && len(expiration) != 7 {
		return fmt.Errorf("expiration invalid")
	}

	month, err := strconv.ParseInt(expiration[:2], 2, 32)

	if err != nil {
		return fmt.Errorf("month invalid")
	}

	if month < 1 || month > 12 {
		return fmt.Errorf("month should be between 1 and 12")
	}

	year, err := strconv.ParseInt(expiration[3:], 2, 32)

	if err != nil {
		return fmt.Errorf("year invalid")
	}

	// if year is 2 digits, add 2000

	if len(expiration) == 5 {
		year += 2000
	}

	if year < 2021 {
		return fmt.Errorf("year should be greater than 2021")
	}

	return nil

}

func ValidateCVV(cvv string) error {

	if cvv == "" {
		return fmt.Errorf("cvv is required")
	}

	if len(cvv) != 3 {
		return fmt.Errorf("cvv invalid")
	}

	if _, err := strconv.Atoi(cvv); err != nil {
		return fmt.Errorf("cvv invalid")
	}

	return nil
}
