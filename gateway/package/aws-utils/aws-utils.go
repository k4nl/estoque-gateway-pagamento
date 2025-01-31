package awsutils

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func init() {

	sess, err := getS3Client()

	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
		panic(err)
	}

	buckets, err := sess.ListBuckets(nil)

	if err != nil {
		log.Fatalf("Failed to list buckets: %v", err)
		panic(err)
	}

	for _, bucket := range buckets.Buckets {
		if *bucket.Name == string(AuthBucket) {
			log.Printf("Bucket %s already exists\n", *bucket.Name)
			return
		}
	}

	log.Printf("Sess region %s\n", *sess.Config.Region)
	log.Printf("Sess region 2%s\n", *&sess.Config.Region)

	_, err = sess.CreateBucket(&s3.CreateBucketInput{
		Bucket: aws.String(string(AuthBucket)),
	})

	if err != nil {
		log.Fatalf("Failed to create bucket: %v", err)
		panic(err)
	}

}

// getS3Client creates an S3 client session
func getS3Client() (*s3.S3, error) {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
		Credentials: credentials.NewStaticCredentials(
			os.Getenv("AWS_ACCESS_KEY_ID"),
			os.Getenv("AWS_SECRET_ACCESS_KEY"),
			"",
		),
	})
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
		return nil, err
	}
	return s3.New(sess), nil
}

// UploadToS3 uploads data to a specific S3 bucket
func UploadStreamToS3(bucketName string, fileName string, objectBuffer bytes.Buffer) error {
	client, err := getS3Client()

	if err != nil {
		return err
	}

	_, err = client.PutObject(&s3.PutObjectInput{
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
	client, err := getS3Client()

	if err != nil {
		return nil, err
	}

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
