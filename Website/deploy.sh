#!/bin/bash

# VIC Website - AWS Deployment Script
# This script deploys the static website to AWS S3 and CloudFront

set -e

# Configuration
BUCKET_NAME="YOUR-BUCKET-NAME"
REGION="us-east-1"
WEBSITE_DIR="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}VIC Website Deployment Script${NC}"
echo "========================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed.${NC}"
    echo "Please install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if bucket name is configured
if [ "$BUCKET_NAME" == "YOUR-BUCKET-NAME" ]; then
    echo -e "${RED}Error: Please configure BUCKET_NAME in this script${NC}"
    exit 1
fi

# Create S3 bucket if it doesn't exist
echo -e "\n${YELLOW}Step 1: Checking S3 bucket...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "Creating bucket: $BUCKET_NAME"
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
else
    echo "Bucket already exists: $BUCKET_NAME"
fi

# Configure bucket for static website hosting
echo -e "\n${YELLOW}Step 2: Configuring static website hosting...${NC}"
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document error.html

# Set bucket policy for public read access
echo -e "\n${YELLOW}Step 3: Setting bucket policy...${NC}"
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json

# Sync website files to S3
echo -e "\n${YELLOW}Step 4: Uploading website files...${NC}"
aws s3 sync "$WEBSITE_DIR" "s3://$BUCKET_NAME" \
    --exclude ".git/*" \
    --exclude "*.sh" \
    --exclude "aws-*.json" \
    --exclude "*.md" \
    --exclude "README*" \
    --cache-control "public, max-age=3600" \
    --delete

# Set specific cache headers for different file types
echo -e "\n${YELLOW}Step 5: Setting cache headers...${NC}"

# HTML files - short cache
aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
    --recursive \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=300" \
    --metadata-directive REPLACE

# CSS and JS files - longer cache
aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --include "*.js" \
    --cache-control "public, max-age=31536000" \
    --metadata-directive REPLACE

# Images - long cache
aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
    --recursive \
    --exclude "*" \
    --include "*.jpg" \
    --include "*.jpeg" \
    --include "*.png" \
    --include "*.gif" \
    --include "*.svg" \
    --cache-control "public, max-age=31536000" \
    --metadata-directive REPLACE

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "Website URL: ${YELLOW}$WEBSITE_URL${NC}"
echo -e "\nNext steps:"
echo "1. Test your website at the URL above"
echo "2. (Optional) Set up CloudFront for HTTPS and better performance"
echo "3. (Optional) Configure a custom domain with Route 53"

exit 0
