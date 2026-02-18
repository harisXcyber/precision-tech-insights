# Email Configuration for Contact Form

The contact form is configured to send emails to: **muhammadharissahabb@gmail.com**

## Setup Required on Render

To enable actual email sending, you need to set these environment variables in Render:

1. Go to your Render dashboard
2. Select the precision-tech-insights service
3. Go to Environment tab
4. Add these variables:

```
EMAIL_USER=muhammadharissahabb@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## How to Get Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security > 2-Step Verification > App passwords
4. Generate a new app password for "Mail"
5. Copy that 16-character password
6. Use it as EMAIL_PASS in Render

## Current Behavior

- Form submissions are logged to console
- Form always shows "success" to user
- Emails will only actually send once environment variables are set
- Without credentials, form still works but emails aren't sent

## Testing Locally

To test locally with email sending:

```bash
export EMAIL_USER=muhammadharissahabb@gmail.com
export EMAIL_PASS=your-app-password
npm start
```
