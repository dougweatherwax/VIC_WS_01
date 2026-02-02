# VIC Website

A modern, responsive website for Valiance Insurance Company (VIC), designed for AWS deployment with future extensibility for user authentication and file upload capabilities.

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with smooth animations
- ✅ Contact form with validation
- ✅ File upload interface (ready for backend integration)
- ✅ AWS deployment ready (S3 + CloudFront)
- ✅ Prepared for future login/authentication
- ✅ SEO-friendly HTML structure

## Project Structure

```
Website/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page with form
├── error.html              # 404 error page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── main.js             # Global utilities and navigation
│   └── contact.js          # Contact form handler
├── assets/                 # Static assets (images, etc.)
├── aws-s3-bucket-policy.json      # S3 bucket policy
├── aws-s3-website-config.json     # S3 website configuration
├── aws-cloudfront-config.json     # CloudFront distribution config
├── deploy.sh                      # Automated deployment script
├── DEPLOYMENT.md                  # Detailed deployment guide
└── README.md                      # This file
```

## Quick Start

### Local Development

1. **Clone or navigate to the project**:
   ```bash
   cd /home/dougw/projects/VIC/VIC_WS_01/Website
   ```

2. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

### AWS Deployment

1. **Prerequisites**:
   - AWS account
   - AWS CLI installed and configured
   - Globally unique S3 bucket name chosen

2. **Quick Deploy**:
   ```bash
   # Edit deploy.sh and update BUCKET_NAME
   nano deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

3. **Manual Deploy**:
   See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (Vanilla)**: No dependencies, pure JS

### AWS Services (Current)
- **Amazon S3**: Static website hosting
- **CloudFront**: CDN for global distribution (optional)
- **Route 53**: DNS management (optional)

### AWS Services (Future)
- **API Gateway**: RESTful API endpoints
- **Lambda**: Serverless backend functions
- **Cognito**: User authentication
- **DynamoDB**: Database for user data
- **SES**: Email delivery for contact form

## Features Overview

### Current Features

#### 1. Responsive Navigation
- Mobile-friendly hamburger menu
- Smooth transitions
- Active page highlighting

#### 2. Contact Form
- Client-side validation
- File upload interface (UI ready)
- Alert messaging system
- Loading states

#### 3. Modern Design
- Card-based layouts
- Gradient hero sections
- Smooth hover effects
- Professional color scheme

### Prepared for Future

#### 1. User Authentication
```javascript
// Code structure already in place for:
- Login/signup forms
- Session management
- Protected routes
- Auth tokens
```

#### 2. File Uploads
```javascript
// Ready for integration:
- Drag & drop interface
- File validation
- Progress indicators
- Presigned URL uploads
```

#### 3. API Integration
```javascript
// API wrapper included:
- Centralized API requests
- Error handling
- Token management
- Request/response formatting
```

## File Descriptions

### HTML Files
- **index.html**: Homepage with hero section and service cards
- **about.html**: Company information and mission
- **contact.html**: Contact form with file upload UI
- **error.html**: Custom 404 error page

### CSS Files
- **styles.css**: Complete styling including:
  - Responsive grid layouts
  - Form styling
  - Alert components
  - Loading spinners
  - Mobile navigation

### JavaScript Files
- **main.js**: Core utilities:
  - Navigation handling
  - Alert system
  - API request wrapper
  - Validation functions
  - File size formatter

- **contact.js**: Contact form features:
  - Form validation
  - File upload handling
  - Submission logic
  - Error handling

## Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* etc. */
}
```

### Content
- Update text in HTML files
- Replace placeholder contact information
- Add your own images to `assets/` or `images/`

### Branding
- Update logo text in navigation
- Modify hero section messaging
- Customize service offerings

## Testing

### Browser Testing
Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Testing
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

### Functionality Testing
- [ ] Navigation works on all pages
- [ ] Mobile menu toggles correctly
- [ ] Contact form validates input
- [ ] File upload shows selected files
- [ ] Error pages display correctly
- [ ] All links work properly

## Performance

### Optimizations
- Minified CSS (when deployed)
- Optimized images
- CDN delivery via CloudFront
- Browser caching headers
- Gzip compression

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Security

### Current
- CORS configuration ready
- Input validation
- XSS protection via proper escaping

### Future (Backend)
- HTTPS only (CloudFront)
- Cognito user pools
- API authentication
- Rate limiting
- WAF rules

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Mobile (last 2 versions)

## Contributing

When making changes:
1. Test locally first
2. Validate HTML/CSS
3. Test on multiple devices
4. Update documentation
5. Deploy to staging first (if available)

## Deployment Checklist

- [ ] Update BUCKET_NAME in deploy.sh
- [ ] Test website locally
- [ ] Configure AWS credentials
- [ ] Run deployment script
- [ ] Test deployed website
- [ ] Set up CloudFront (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring
- [ ] Configure billing alerts

## Future Enhancements

### Phase 1 (Backend Integration)
- [ ] Lambda functions for contact form
- [ ] API Gateway setup
- [ ] DynamoDB tables
- [ ] SES email configuration

### Phase 2 (User Authentication)
- [ ] Cognito user pool
- [ ] Login/signup pages
- [ ] Password reset flow
- [ ] User dashboard

### Phase 3 (File Upload)
- [ ] S3 bucket for uploads
- [ ] Presigned URL generation
- [ ] File management interface
- [ ] Download capabilities

### Phase 4 (Advanced Features)
- [ ] Real-time chat support
- [ ] Quote calculator
- [ ] User profiles
- [ ] Document vault

## Cost Estimate

### Static Website (S3 only)
- **Monthly**: $1-5 for low traffic
- **Annual**: $12-60

### With CloudFront
- **Monthly**: $5-20 for moderate traffic
- **Annual**: $60-240

### With Backend (Future)
- **Monthly**: $20-100 depending on usage
- **Annual**: $240-1200

## Support

For deployment help, see [DEPLOYMENT.md](DEPLOYMENT.md)

For AWS issues, visit https://docs.aws.amazon.com

## License

© 2026 Valiance Insurance Company (VIC). All rights reserved.

## Version History

- **1.0.0** (2026-02-01): Initial release
  - Static website with 3 pages
  - Contact form UI
  - AWS deployment ready
  - Mobile responsive
