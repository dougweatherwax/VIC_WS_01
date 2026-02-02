# VIC Website - AWS Deployment Guide

## Overview
This guide will help you deploy the VIC website to AWS using S3 for static hosting and optionally CloudFront for CDN and HTTPS support.

## Architecture

### Current (Static Website)
- **S3**: Static website hosting for HTML, CSS, JavaScript
- **CloudFront** (optional): CDN for faster delivery and HTTPS
- **Route 53** (optional): Custom domain management

### Future Expansion
The website is designed to be easily extended with:
- **AWS Lambda + API Gateway**: For contact form submissions, file uploads
- **Amazon Cognito**: User authentication and login
- **DynamoDB**: Database for user data and submissions
- **S3**: File storage for user uploads

## Prerequisites

1. **AWS Account**: Create one at https://aws.amazon.com
2. **AWS CLI**: Install from https://aws.amazon.com/cli/
3. **AWS Credentials**: Configure with `aws configure`

## Deployment Steps

### Option 1: Quick Deployment (Automated Script)

1. **Edit the deployment script**:
   ```bash
   nano deploy.sh
   ```
   Update `BUCKET_NAME` with your desired bucket name (must be globally unique)

2. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

3. **Access your website**:
   The script will output the website URL when complete.

### Option 2: Manual Deployment

#### Step 1: Create S3 Bucket

```bash
# Create bucket (replace YOUR-BUCKET-NAME)
aws s3 mb s3://YOUR-BUCKET-NAME --region us-east-1

# Enable static website hosting
aws s3 website s3://YOUR-BUCKET-NAME \
    --index-document index.html \
    --error-document error.html
```

#### Step 2: Configure Bucket Policy

```bash
# Apply the bucket policy for public access
aws s3api put-bucket-policy \
    --bucket YOUR-BUCKET-NAME \
    --policy file://aws-s3-bucket-policy.json
```

#### Step 3: Upload Website Files

```bash
# Sync all files to S3
aws s3 sync . s3://YOUR-BUCKET-NAME \
    --exclude ".git/*" \
    --exclude "*.sh" \
    --exclude "*.md" \
    --exclude "aws-*.json" \
    --cache-control "public, max-age=3600"
```

#### Step 4: Access Your Website

Your website will be available at:
```
http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com
```

### Option 3: CloudFront Distribution (Recommended for Production)

CloudFront provides HTTPS, better performance, and custom domain support.

#### Create CloudFront Distribution

1. **Via AWS Console**:
   - Go to CloudFront console
   - Click "Create Distribution"
   - Origin Domain: Select your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: `index.html`
   - Create distribution

2. **Via AWS CLI**:
   ```bash
   # Edit aws-cloudfront-config.json first
   aws cloudfront create-distribution --distribution-config file://aws-cloudfront-config.json
   ```

3. **Configure Custom Error Pages**:
   - In CloudFront console, go to Error Pages
   - Add custom error response for 404 -> error.html

## Testing Your Website

1. **Local Testing**:
   ```bash
   # Use Python's built-in server
   python3 -m http.server 8000
   ```
   Then visit http://localhost:8000

2. **S3 Testing**:
   Visit your S3 website URL

3. **CloudFront Testing**:
   Visit your CloudFront distribution URL (e.g., https://d123456789.cloudfront.net)

## Custom Domain Setup (Optional)

### Using Route 53

1. **Register or transfer domain** to Route 53
2. **Create hosted zone** if not already created
3. **Add A record** (alias) pointing to CloudFront distribution
4. **Add certificate** in AWS Certificate Manager for HTTPS

## Updating Your Website

### Quick Update
```bash
# Sync changes
aws s3 sync . s3://YOUR-BUCKET-NAME \
    --exclude ".git/*" \
    --exclude "*.sh" \
    --exclude "*.md" \
    --exclude "aws-*.json"

# Invalidate CloudFront cache (if using CloudFront)
aws cloudfront create-invalidation \
    --distribution-id YOUR-DISTRIBUTION-ID \
    --paths "/*"
```

### Using the Deploy Script
```bash
./deploy.sh
```

## Cost Estimates

### S3 Only (Static Website)
- **Storage**: ~$0.023 per GB/month
- **Requests**: $0.0004 per 1,000 GET requests
- **Data Transfer**: $0.09 per GB out
- **Estimated Monthly Cost**: $1-5 for low traffic

### S3 + CloudFront
- **CloudFront**: $0.085 per GB out (first 10TB)
- **CloudFront Requests**: $0.0075 per 10,000 requests
- **S3**: Same as above
- **Estimated Monthly Cost**: $5-20 for moderate traffic

## Future Backend Integration

When you're ready to add login and file upload capabilities:

### 1. Contact Form Backend

Create a Lambda function to handle form submissions:
```javascript
// lambda/contact-handler.js
exports.handler = async (event) => {
    // Parse form data
    // Send email via SES
    // Store in DynamoDB
    // Return response
};
```

### 2. User Authentication

Integrate Amazon Cognito:
```javascript
// Add to js/main.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'YOUR_USER_POOL_ID',
    ClientId: 'YOUR_CLIENT_ID'
};

const userPool = new CognitoUserPool(poolData);
```

### 3. File Upload

Use presigned URLs for direct S3 uploads:
```javascript
// Lambda function to generate presigned URL
const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: 'uploads-bucket',
    Key: fileName,
    Expires: 300
});
```

### 4. API Gateway Setup

Create REST API:
- **POST /contact**: Contact form submission
- **POST /auth/login**: User login
- **POST /auth/register**: User registration
- **GET /upload-url**: Get presigned URL for file upload
- **POST /submit**: Submit data

## Security Best Practices

1. **HTTPS Only**: Use CloudFront with SSL/TLS certificate
2. **CORS Configuration**: Restrict origins in S3 CORS settings
3. **IAM Roles**: Use least-privilege principle
4. **CloudFront Geo Restrictions**: If needed
5. **WAF**: Add AWS WAF for additional protection
6. **Secrets**: Never commit AWS credentials to git

## Monitoring

### CloudWatch Metrics
- S3 bucket metrics
- CloudFront distribution metrics
- Lambda function logs (when added)

### Cost Monitoring
- Set up billing alerts in AWS Console
- Use AWS Cost Explorer

## Troubleshooting

### Website not loading
1. Check bucket policy allows public read
2. Verify static website hosting is enabled
3. Check index.html exists in bucket
4. Verify CloudFront distribution is deployed (if using)

### 403 Forbidden
- Check bucket policy
- Verify file permissions in S3

### 404 Not Found
- Verify error.html exists
- Check CloudFront error page configuration

### CSS/JS not loading
- Check browser console for errors
- Verify file paths are correct
- Check CORS configuration

## Support Resources

- **AWS Documentation**: https://docs.aws.amazon.com
- **AWS Support**: https://console.aws.amazon.com/support
- **CloudFront Guide**: https://docs.aws.amazon.com/cloudfront
- **S3 Static Website**: https://docs.aws.amazon.com/s3/static-website

## Next Steps

1. ✅ Deploy static website to S3
2. ✅ Test website functionality
3. ⬜ Set up CloudFront distribution
4. ⬜ Configure custom domain
5. ⬜ Add SSL certificate
6. ⬜ Implement backend APIs (Lambda + API Gateway)
7. ⬜ Add user authentication (Cognito)
8. ⬜ Implement file upload functionality

## Questions?

For support with this website, contact your development team or refer to the AWS documentation links above.
