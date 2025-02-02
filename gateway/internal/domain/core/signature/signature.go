package signature

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"gateway/internal/domain/application/user"
	"gateway/internal/domain/core/auth"
)

type Signature struct {
	Signature string `json:"signature"`
	payload   string
}

func ValidateRequest(signature Signature, user *user.User) error {

	// Get user public key from S3

	auth, err := auth.LoadRSAKeys(user)

	if err != nil {
		return err
	}

	// Decrypt signature with user public key

	decodedSignature, err := base64.StdEncoding.DecodeString(signature.Signature)

	if err != nil {
		return errors.New("invalid signature")
	}

	hashedPayload := sha256.Sum256([]byte(signature.payload))

	err = rsa.VerifyPKCS1v15(auth.GetPublicKey(), crypto.SHA256, hashedPayload[:], decodedSignature)

	if err != nil {
		return errors.New("signature validation failed")
	}

	// Se a assinatura for válida, retorna nil
	return nil

}
