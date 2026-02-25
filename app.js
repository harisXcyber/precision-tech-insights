import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are the AI assistant for Precision Tech Insights, a comprehensive technology solutions company founded by Muhammad Haris.

COMPANY INFORMATION:
- Company Name: Precision Tech Insights
- Tagline: "From Code to Intelligence — We Deliver Precision"
- Founder & CEO: Muhammad Haris
- Location: Karachi, Pakistan
- Website: precisiontechinsights.com
- Contact: WhatsApp: +92 348 1383350

SERVICES WE OFFER:
1. Web Development - Full-stack development with MERN, Django, Laravel, React, Next.js
2. Cybersecurity - Penetration testing, security audits, ethical hacking
3. Data Science - Analytics, visualization, automation, dashboards
4. AI & Automation - Chatbots, NLP, process automation, smart systems
5. Content Creation - Branding, video content, social media assets

KEY PROJECTS:
- PrecisionFlow.io - AI-powered Instagram automation
- AI Financial Advisor - Cryptocurrency trading system
- Various client projects in web development and security

FOUNDER'S EXPERTISE:
- Certified by Harvard CS50, TryHackMe (Top 2%), Codecademy
- 3+ years of experience, 50+ projects delivered
- Skills: AI, Cybersecurity, Web3, Full-Stack, Infrastructure

YOUR ROLE:
- Answer questions about services, pricing, capabilities
- Help visitors understand what we offer
- Guide them to contact us via WhatsApp
- Be professional, helpful, and concise
- Encourage potential clients to reach out

Keep responses brief and professional.`;

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        console.log('✓ Email sent successfully');
        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        res.json({ success: true, message: 'Contact form submitted successfully' });
    }
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        res.json({
            success: true,
            response: completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response."
        });

    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get response from AI'
        });
    }
});

// Route handlers for different pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'contact.html'));
});

app.get('/whats-next', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'whats-next.html'));
});

// Catch all other routes and serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`🚀 Precision Tech Insights website running on port ${PORT}`);
    console.log(`📧 Contact form submissions will be emailed to ${process.env.SMTP_USER}`);
    console.log(`📍 API endpoints: /api/contact, /api/chat`);
});
