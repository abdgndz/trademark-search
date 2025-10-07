// Simple proxy server to handle CORS issues with EUIPO API
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Proxy endpoint for OAuth token
app.post('/api/oauth/token', async (req, res) => {
    try {
        console.log('Proxying OAuth token request...');
        
        const response = await fetch('https://euipo.europa.eu/cas-server-webapp/oidc/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': req.body.client_id,
                'client_secret': req.body.client_secret,
                'scope': req.body.scope || 'uid'
            })
        });

        const data = await response.text();
        console.log('OAuth response status:', response.status);
        console.log('OAuth response data:', data);

        res.status(response.status).send(data);
    } catch (error) {
        console.error('OAuth proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for trademark search
app.get('/api/trademarks', async (req, res) => {
    try {
        console.log('Proxying trademark search request...');
        
        const { query, size, page, sort, access_token } = req.query;
        
        const searchUrl = `https://api.euipo.europa.eu/trademark-search/trademarks?${new URLSearchParams({
            query,
            size,
            page,
            sort
        })}`;

        console.log('Search URL:', searchUrl);

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-IBM-Client-Id': '5a6c9a660fc2c2aea412cb317e4aeb6c' // Production Client ID
        };

        if (access_token) {
            headers['Authorization'] = `Bearer ${access_token}`;
        }

        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: headers
        });

        const data = await response.text();
        console.log('Search response status:', response.status);
        console.log('Search response data:', data);

        res.status(response.status).send(data);
    } catch (error) {
        console.error('Search proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for trademark image
app.get('/api/trademarks/:applicationNumber/image', async (req, res) => {
    try {
        console.log('Proxying trademark image request...');
        
        const { applicationNumber } = req.params;
        const { access_token } = req.query;
        
        const imageUrl = `https://api.euipo.europa.eu/trademark-search/trademarks/${applicationNumber}/image`;

        console.log('Image URL:', imageUrl);

        const headers = {
            'Accept': 'image/*',
            'X-IBM-Client-Id': process.env.CLIENT_ID || '5a6c9a660fc2c2aea412cb317e4aeb6c'
        };

        if (access_token) {
            headers['Authorization'] = `Bearer ${access_token}`;
        }

        const response = await fetch(imageUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            console.log('Image response status:', response.status);
            return res.status(response.status).json({ error: 'Image not found' });
        }

        // Set appropriate content type
        const contentType = response.headers.get('content-type') || 'image/png';
        res.set('Content-Type', contentType);
        
        // Stream the image data
        response.body.pipe(res);
        
    } catch (error) {
        console.error('Image proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`  POST /api/oauth/token - OAuth token endpoint`);
    console.log(`  GET  /api/trademarks - Trademark search endpoint`);
    console.log(`  GET  /health - Health check`);
});
