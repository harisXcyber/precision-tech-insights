import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use('/company_logo.png', express.static('company_logo.png'));
app.use('/favicon.png', express.static('favicon.png'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/muhammad-haris.jpg', express.static('muhammad-haris.jpg'));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body;
    
    console.log('New contact form submission:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Service: ${service}`);
    console.log(`Message: ${message}`);
    console.log('---');
    
    res.json({ success: true, message: 'Contact form submitted successfully' });
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

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`🚀 Precision Tech Insights website running on http://localhost:${PORT}`);
    console.log('📧 Contact form submissions will be logged to console');
});
