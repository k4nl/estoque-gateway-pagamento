package document

import (
	"errors"
	"regexp"

	"github.com/brazilian-utils/brutils-go/cpf"
)

type Document struct {
	value string
}

func ValidadeDocument(value string) (*Document, error) {

	if cpf.IsValid(value) {
		return &Document{value: CleanDocument(value)}, nil
	}

	return nil, errors.New("invalid document")
}

func CleanDocument(value string) string {
	re := regexp.MustCompile(`\D`)
	return re.ReplaceAllString(value, "")
}

func (d *Document) Value() string {
	return d.value
}