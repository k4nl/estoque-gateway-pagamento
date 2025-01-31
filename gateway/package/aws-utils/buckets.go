package awsutils

type Bucket struct {
	Name BucketName
}

type BucketName string

const (
	AuthBucket BucketName = "gateway-bucket-app"
)
