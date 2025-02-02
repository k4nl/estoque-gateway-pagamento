package auth

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"gateway/internal/domain/application/user"
	awsutils "gateway/package/aws-utils"
)

type Auth struct {
	rsaPrivateKey *rsa.PrivateKey
	rsaPublicKey  *rsa.PublicKey
}

func CreateRSAKeys(user *user.User) (*Auth, error) {

	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)

	if err != nil {
		return nil, fmt.Errorf("error generating private key: %w", err)
	}

	// Encode private key to PEM format

	privateKeyBuffer := new(bytes.Buffer)
	err = pem.Encode(privateKeyBuffer, &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
	})

	if err != nil {
		return nil, fmt.Errorf("error encoding private key: %w", err)
	}

	// Encode public key to PEM format

	publicKey := &privateKey.PublicKey
	publicKeyBytes, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		return nil, fmt.Errorf("error marshaling public key: %w", err)
	}

	publicKeyBuffer := new(bytes.Buffer)
	err = pem.Encode(publicKeyBuffer, &pem.Block{
		Type:  "RSA PUBLIC KEY",
		Bytes: publicKeyBytes,
	})

	if err != nil {
		return nil, fmt.Errorf("error encoding public key: %w", err)
	}

	// Upload keys to S3

	privateKeyName := fmt.Sprintf("private_key_%s_%s.pem", user.Name, user.Document)

	err = awsutils.UploadStreamToS3(string(awsutils.AuthBucket), privateKeyName, *privateKeyBuffer)

	if err != nil {
		return nil, fmt.Errorf("error uploading private key to S3: %w", err)
	}

	publicKeyName := fmt.Sprintf("public_key_%s_%s.pem", user.Name, user.Document)

	err = awsutils.UploadStreamToS3(string(awsutils.AuthBucket), publicKeyName, *publicKeyBuffer)

	if err != nil {
		return nil, fmt.Errorf("error uploading public key to S3: %w", err)
	}

	return &Auth{
		rsaPrivateKey: privateKey,
		rsaPublicKey:  publicKey,
	}, nil
}

func LoadRSAKeys(user *user.User) (*Auth, error) {

	privateKeyName := fmt.Sprintf("private_key_%s_%s.pem", user.Name, user.Document)
	publicKeyName := fmt.Sprintf("public_key_%s_%s.pem", user.Name, user.Document)

	privateKeyBuffer, err := awsutils.DownloadFromS3(privateKeyName, string(awsutils.AuthBucket))

	if err != nil {
		return nil, fmt.Errorf("error downloading private key from S3: %w", err)
	}

	publicKeyBuffer, err := awsutils.DownloadFromS3(publicKeyName, string(awsutils.AuthBucket))

	if err != nil {
		return nil, fmt.Errorf("error downloading public key from S3: %w", err)
	}

	privateKeyBlock, _ := pem.Decode(privateKeyBuffer)

	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)

	if err != nil {
		return nil, fmt.Errorf("error parsing private key: %w", err)
	}

	publicKeyBlock, _ := pem.Decode(publicKeyBuffer)

	publicKey, err := x509.ParsePKIXPublicKey(publicKeyBlock.Bytes)

	if err != nil {
		return nil, fmt.Errorf("error parsing public key: %w", err)
	}

	return &Auth{
		rsaPrivateKey: privateKey,
		rsaPublicKey:  publicKey.(*rsa.PublicKey),
	}, nil

}

func (auth *Auth) GetPublicKey() *rsa.PublicKey {
	return auth.rsaPublicKey
}

func (auth *Auth) GetPrivateKey() *rsa.PrivateKey {
	return auth.rsaPrivateKey
}
