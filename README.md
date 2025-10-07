# SellerRunning Trademark Search

A modern, multi-country trademark search application that allows users to search for trademarks across different regions including UK, Australia, Mexico, and Germany.

## Features

- 🌍 **Multi-Country Search**: Search trademarks in UK, Australia, Mexico, and Germany
- 🎨 **Modern UI/UX**: Beautiful, responsive design with collapsible results
- 📊 **Status Grouping**: Results grouped by trademark status (Registered, Expired, etc.)
- 🔍 **Real-time Search**: Live search with EUIPO API integration
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Node.js, Express.js
- **API**: EUIPO Trademark Search API
- **Authentication**: OAuth2 Client Credentials Flow

## API Coverage

- **UK**: EU trademarks with UK applicants
- **Australia**: International trademarks (WIPO Madrid Protocol)
- **Mexico**: International trademarks
- **Germany**: EU trademarks with German companies

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- EUIPO API credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trademark-search
```

2. Install dependencies:
```bash
npm install
```

3. Configure API credentials in `config.js`

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3001`

## Configuration

Update the `config.js` file with your EUIPO API credentials:

```javascript
OAUTH: {
    CLIENT_ID: 'your-client-id',
    CLIENT_SECRET: 'your-client-secret'
}
```

## API Endpoints

- `POST /api/oauth/token` - OAuth token endpoint
- `GET /api/trademarks` - Trademark search endpoint
- `GET /health` - Health check

## Deployment

This application is designed to be deployed on platforms like:
- Render.com
- Heroku
- Vercel
- Railway

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, email support@sellerrunning.com or create an issue in the repository.