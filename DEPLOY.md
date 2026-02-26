# Precision Tech Insights - Production Deployment

## Quick Deploy on CrocWeb

### 1. Clone Repository
```bash
cd ~/domains/precisiontechinsights.com/public_html
git pull origin main
```

### 2. Install Dependencies
```bash
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH
npm install
```

### 3. Create .env File
```bash
cat > .env << 'EOF'
GROQ_API_KEY=your_groq_api_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=9000
EOF
```

### 4. Create .htaccess
```bash
cat > .htaccess << 'EOF'
PassengerEnabled on
PassengerAppRoot /home/precisiontech/domains/precisiontechinsights.com/public_html
PassengerAppType node
PassengerStartupFile server.js
PassengerNodejs /opt/alt/alt-nodejs22/root/usr/bin/node
EOF
```

### 5. Start Application
```bash
nohup node server.js > app.log 2>&1 &
```

### 6. Configure DirectAdmin Node.js App
- Go to: Setup Node.js App
- Application startup file: `server.js`
- Application root: `/home/precisiontech/domains/precisiontechinsights.com/public_html`
- Click "Restart"

## Features
✅ AI Chatbot on all pages (Groq-powered)
✅ Contact form with email notifications
✅ All pages: Home, About, Services, Contact, What's Next
✅ Responsive design
✅ No "2025" references

## Tech Stack
- Node.js + Express
- Groq API (Llama 3.3 70B)
- Nodemailer (SMTP)
- Vite (build tool)
- TailwindCSS

## Environment Variables Required
- `GROQ_API_KEY` - Groq API key for chatbot
- `SMTP_USER` - Gmail address for contact form
- `SMTP_PASS` - Gmail app password
- `PORT` - Server port (default: 9000)
