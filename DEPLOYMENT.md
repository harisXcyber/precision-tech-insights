# Precision Tech Insights - Deployment Guide

## Server Deployment

### Prerequisites
- Node.js 18+ installed on server
- Git configured with SSH access
- Environment variables configured

### Initial Setup on Server

1. **Clone the repository:**
```bash
cd ~/domains/precisiontechinsights.com/public_html
git clone git@github.com:harisXcyber/precision-tech-insights.git .
```

2. **Create .env file:**
```bash
nano .env
```
Add your environment variables:
```
GROQ_API_KEY=your_groq_api_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=9000
```

3. **Install dependencies:**
```bash
npm install --production
```

4. **Run deployment script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Subsequent Deployments

Simply run:
```bash
./deploy.sh
```

### Manual Deployment

1. **Stop existing processes:**
```bash
pkill -f "node server.js"
```

2. **Pull latest code:**
```bash
git pull origin main
```

3. **Install dependencies:**
```bash
npm install --production
```

4. **Start server:**
```bash
nohup node server.js > server.log 2>&1 &
```

### Monitoring

**View logs:**
```bash
tail -f server.log
```

**Check if server is running:**
```bash
ps aux | grep "node server.js"
```

**Check port:**
```bash
netstat -tulpn | grep 9000
```

### Troubleshooting

**Server not starting:**
- Check logs: `cat server.log`
- Verify .env file exists and has correct values
- Check if port 9000 is available

**Port already in use:**
```bash
lsof -ti:9000 | xargs kill -9
```

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Create .env file:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Start development server:**
```bash
npm start
```

Server runs on http://localhost:9000

## Environment Variables

- `GROQ_API_KEY` - Groq API key for AI chatbot
- `SMTP_USER` - Gmail address for contact form
- `SMTP_PASS` - Gmail app password
- `PORT` - Server port (default: 9000)

## Project Structure

```
precision-tech-insights/
├── dist/               # Production files
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── our-solutions.html
│   └── navbar.html
├── server.js           # Express server
├── package.json        # Dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Environment template
└── deploy.sh          # Deployment script
```

## Features

- ✅ 9 Itovio services with proper links
- ✅ Consistent navigation across all pages
- ✅ Contact form with email integration
- ✅ AI chatbot powered by Groq
- ✅ Responsive design
- ✅ SEO optimized

## Support

For issues, contact: muhammadharissahabb@gmail.com
