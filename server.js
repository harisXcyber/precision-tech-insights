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
- Founded: 2025
- Location: Karachi, Pakistan
- Website: precisiontechinsights.com
- Contact: WhatsApp: +92 348 1383350, Email: contact@precisiontechinsights.com

IMPORTANT: Precision Tech Insights is the parent company. We do NOT directly offer services.

OUR PRODUCTS & PLATFORMS:

1. ITOVIO (itovio.com) - Our Services Platform [LIVE - 2026]
   - This is where ALL services are offered
   - 9 Core Services: Web Development, Cybersecurity, Data Science, AI & Automation, Content Creation, and more
   - Fixed packages and custom projects
   - Direct users to itovio.com for any service inquiries

2. PRECISIONFLOW (precisionflow.io) - Crypto Analysis Platform [LIVE - 2026]
   - Data-driven cryptocurrency insights and analysis
   - Daily updates on Binance Square
   - Detailed analysis on website
   - Research-backed, no hype, honest analysis
   - Covers Bitcoin, Ethereum, altcoins, and market trends

3. PRECISION TECH ACADEMY - Tech Education Platform [COMING SOON]
   - Comprehensive courses in Web Development, Cybersecurity, Data Science, AI & Automation
   - Industry-recognized curriculum
   - Hands-on project-based learning
   - Official Precision Tech Insights certificates

4. PRECISION SAAS SUITE - Software Products Portfolio
   - PrecisionFlow (LIVE)
   - Itovio (LIVE)
   - DataViz Studio (Planned) - No-code data visualization
   - AutoFlow (Planned) - Business process automation
   - SecureCheck (Planned) - Security scanning
   - ContentCraft (Planned) - AI content creation

COMPANY TIMELINE:
- Q1 2025: Company launched, team assembled, infrastructure built
- Q2 2026: Itovio services platform launched
- Q3 2026: PrecisionFlow crypto analysis platform progressing
- Q4 2026: Precision Tech Academy planned launch

FOUNDER'S EXPERTISE:
- Certified by Harvard CS50, TryHackMe (Top 2%), Codecademy
- 3+ years of experience, 50+ projects delivered
- Skills: AI, Cybersecurity, Web3, Full-Stack Development, Infrastructure

YOUR ROLE:
- Answer questions about our products and platforms
- For SERVICE inquiries → Direct to Itovio (itovio.com)
- For CRYPTO analysis → Direct to PrecisionFlow (precisionflow.io)
- For EDUCATION → Mention Academy is coming soon
- Explain that Precision Tech Insights is the parent company with multiple products
- Be professional, helpful, and concise
- Encourage visitors to explore our platforms

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
app.use(express.static('dist'));
app.use('/company_logo.png', express.static('company_logo.png'));
app.use('/favicon.png', express.static('favicon.png'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/muhammad-haris.jpg', express.static('muhammad-haris.jpg'));
app.use('/home-profile.jpg', express.static('home-profile.jpg'));
app.use('/about-profile.jpg', express.static('about-profile.jpg'));

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

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/whats-next', (req, res) => {
    res.sendFile(path.join(__dirname, 'whats-next.html'));
});

// Fallback for any other routes
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
    console.log(`🚀 Precision Tech Insights website running on http://localhost:${PORT}`);
    console.log('📧 Contact form submissions will be emailed to ${process.env.SMTP_USER}');
    console.log('📍 API endpoint: /api/contact');
});
