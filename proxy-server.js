import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const CLIENTEXEC_BASE = 'https://hosting.precisiontechinsights.com';

// Serve static files
app.use(express.static(__dirname));

// Proxy route for services page (all product groups)
app.get('/services', async (req, res) => {
    try {
        const response = await fetch(`${CLIENTEXEC_BASE}/order.php`);
        let html = await response.text();
        
        // Inject your brand CSS and modify HTML
        html = injectBrandStyling(html);
        
        res.send(html);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Error loading services');
    }
});

// Proxy route for specific product group (e.g., web development)
app.get('/services/:category', async (req, res) => {
    try {
        // Map category names to product group IDs
        const categoryMap = {
            'web-development': 5,
            'shared-hosting': 1,
            'domain-services': 3
        };
        
        const groupId = categoryMap[req.params.category];
        
        if (!groupId) {
            return res.status(404).send('Category not found');
        }
        
        const response = await fetch(`${CLIENTEXEC_BASE}/order.php?step=1&productGroup=${groupId}`);
        let html = await response.text();
        
        // Inject your brand CSS and modify HTML
        html = injectBrandStyling(html);
        
        res.send(html);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).send('Error loading category');
    }
});

// Proxy route for specific product
app.get('/services/products/:product', async (req, res) => {
    try {
        // You'll need to map product names to IDs
        const response = await fetch(`${CLIENTEXEC_BASE}/order.php?step=1&productGroup=5`);
        let html = await response.text();
        
        html = injectBrandStyling(html);
        
        res.send(html);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error loading product');
    }
});

// Function to inject brand styling into ClientExec HTML
function injectBrandStyling(html) {
    // Remove ClientExec's default CSS
    html = html.replace(/<link[^>]*stylesheet[^>]*>/gi, '');
    
    // Inject your brand CSS
    const brandCSS = `
        <link rel="stylesheet" href="/brand.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            /* Override ClientExec styles */
            body {
                font-family: 'Inter', sans-serif !important;
                background: #f8fafc !important;
            }
            
            /* Hide ClientExec header if needed */
            .clientexec-header {
                display: none !important;
            }
            
            /* Style product cards */
            .product-item, .package {
                background: white !important;
                border-radius: 1rem !important;
                padding: 2rem !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                transition: all 0.3s !important;
            }
            
            .product-item:hover, .package:hover {
                transform: translateY(-8px) !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Style buttons */
            .btn, button, input[type="submit"] {
                background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%) !important;
                color: white !important;
                padding: 0.875rem 2rem !important;
                border-radius: 9999px !important;
                font-weight: 600 !important;
                border: none !important;
                cursor: pointer !important;
                transition: all 0.3s !important;
            }
            
            .btn:hover, button:hover, input[type="submit"]:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
            }
        </style>
    `;
    
    // Inject before </head>
    html = html.replace('</head>', `${brandCSS}</head>`);
    
    // Add your navigation
    const navigation = `
        <nav style="background: #0f172a; color: white; padding: 1rem 0; position: fixed; width: 100%; top: 0; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="max-width: 1280px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="/company_logo.png" alt="Precision Tech Insights" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div style="font-size: 1.25rem; font-weight: 700;">Precision Tech Insights</div>
                </div>
                <div style="display: flex; gap: 2rem;">
                    <a href="/" style="color: white; text-decoration: none;">Home</a>
                    <a href="/services" style="color: #3b82f6; text-decoration: none; font-weight: 600;">Services</a>
                    <a href="/about.html" style="color: white; text-decoration: none;">About</a>
                    <a href="/contact.html" style="color: white; text-decoration: none;">Contact</a>
                </div>
            </div>
        </nav>
        <div style="height: 72px;"></div>
    `;
    
    // Inject after <body>
    html = html.replace('<body>', `<body>${navigation}`);
    
    return html;
}

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📄 Services: http://localhost:${PORT}/services`);
    console.log(`📄 Web Dev: http://localhost:${PORT}/services/web-development`);
});
