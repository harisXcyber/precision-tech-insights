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

const SYSTEM_PROMPT = `You are the AI assistant for Precision Tech Insights. Be conversational, helpful, and concise. Use plain text — no ALL CAPS, no markdown headers, no bullet symbols. Use short paragraphs.

Company: Precision Tech Insights — "From Code to Intelligence"
Founder & CEO: Muhammad Haris (Karachi, Pakistan, 2025)
Website: precisiontechinsights.com
Contact: WhatsApp +92 348 1383350, contact@precisiontechinsights.com

Precision Tech Insights is the parent company. It does not sell services directly — it builds products and platforms.

Products & Platforms:

ITovio (itovio.com) — Live IT services platform. Offers web development, cybersecurity, data science, AI & automation, content creation, UI/UX, mobile apps, and more. Direct all service inquiries here.

PrecisePortfolio (precisiontechinsights.com/preciseportfolio) — Live AI-powered portfolio generator SaaS. Users have a conversation with an AI called "Ivo" and get a live professional portfolio website at their own subdomain (e.g. name.itovio.com) in minutes. No forms, no templates — just a conversation. Features: 7-phase AI interview, resume PDF upload, role-aware questions (CEO vs developer vs designer), custom styling, live subdomain deployment, edit anytime. Currently used by ITovio to generate portfolio sites for their clients. Free for ITovio Gold members with coupon code GOLD-FREE-2026.

PrecisionFlow (precisionflow.io) — Live crypto analysis platform. Data-driven cryptocurrency insights, daily updates on Binance Square, covers Bitcoin, Ethereum, altcoins.

Precision Tech Academy — Coming soon. Courses in web dev, cybersecurity, data science, AI.

Muhammad Haris: Founder & CEO. Certified by Harvard CS50, TryHackMe (Top 2%), Codecademy. 3+ years experience, 50+ projects. Skills: AI, cybersecurity, web3, full-stack development.

Rules: Keep responses short and friendly. No ALL CAPS. No markdown. Direct service questions to itovio.com. Direct portfolio questions to PrecisePortfolio.`;

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
app.use(express.static('dist'));
app.use('/company_logo.png', express.static('company_logo.png'));
app.use('/favicon.png', express.static('favicon.png'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/muhammad-haris.jpg', express.static('muhammad-haris.jpg'));
app.use('/home-profile.jpg', express.static('home-profile.jpg'));
app.use('/about-profile.jpg', express.static('about-profile.jpg'));
app.use('/components.js', express.static('components.js'));
app.use('/footer.html', express.static('footer.html'));
app.use('/chatbot.html', express.static('chatbot.html'));

// Email configuration
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
    console.log('=== Contact Form Submission Received ===');
    console.log('Request body:', req.body);
    
    const { name, email, phone, company, service, budget, timeline, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !service || !message) {
        console.error('Missing required fields');
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
        });
    }
    
    // Log the contact form submission
    console.log('New contact form submission:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Company: ${company || 'Not provided'}`);
    console.log(`Service: ${service}`);
    console.log(`Budget: ${budget || 'Not specified'}`);
    console.log(`Timeline: ${timeline || 'Not specified'}`);
    console.log(`Message: ${message}`);
    console.log('---');
    
    // Email content
    const emailContent = `
New Contact Form Submission - Precision Tech Insights

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Service Interested: ${service}
Budget Range: ${budget || 'Not specified'}
Timeline: ${timeline || 'Not specified'}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
    `;
    
    try {
        // Send email to your Gmail
        await transporter.sendMail({
            from: '"Precision Tech Insights" <contact@precisiontechinsights.com>',
            to: process.env.SMTP_USER,
            subject: `New Contact Form: ${name} - ${service}`,
            text: emailContent,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
                <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `
        });
        
        console.log('✓ Email sent successfully');
        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        console.error('Error details:', error);
        // Still return success to user, but log the error
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

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/navbar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'navbar.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'contact.html'));
});

app.get('/whats-next', (req, res) => {
    res.sendFile(path.join(__dirname, 'whats-next.html'));
});

app.get('/our-solutions', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'our-solutions.html'));
});

// Fallback for any other routes
app.get('/preciseportfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'preciseportfolio.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Precision Tech Insights website running on http://localhost:${PORT}`);
    console.log(`Contact form submissions will be emailed to ${process.env.SMTP_USER}`);
    console.log(`API endpoint: /api/contact`);
});
