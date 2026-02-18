import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

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
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'contact@precisiontechinsights.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, company, service, budget, timeline, message } = req.body;
    
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
            to: 'muhammadharissahabb@gmail.com',
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
        
        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Email sending failed:', error);
        // Still return success to user, but log the error
        res.json({ success: true, message: 'Contact form submitted successfully' });
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

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`🚀 Precision Tech Insights website running on http://localhost:${PORT}`);
    console.log('📧 Contact form submissions will be emailed to muhammadharissahabb@gmail.com');
});
