package awsutils

import (
	"bytes"
	"fmt"
	"io"
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var (
	awsRegion = "us-east-1"
)


// getS3Client creates an S3 client session
func getS3Client() *s3.S3 {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(awsRegion),
	})
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
	}
	return s3.New(sess)
}

// UploadToS3 uploads data to a specific S3 bucket
func UploadStreamToS3(bucketName string, fileName string, objectBuffer bytes.Buffer) error {
	client := getS3Client()
	_, err := client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(objectBuffer.Bytes()),
	})
	if err != nil {
		return err
	}

	return nil
}

// DownloadFromS3 downloads data from a specific S3 bucket
func DownloadFromS3(fileName, bucket string) ([]byte, error) {
	client := getS3Client()
	input := &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
	}

	result, err := client.GetObject(input)
	if err != nil {
		return nil, fmt.Errorf("failed to download from S3: %w", err)
	}
	defer result.Body.Close()

	data, err := io.ReadAll(result.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read S3 object data: %w", err)
	}
	fmt.Printf("Successfully downloaded %s from S3\n", fileName)
	return data, nil
}
