// Configuration file for UK Trademark Search Application

const CONFIG = {
    // Multi-Country API Configuration
    API: {
        // United Kingdom (UK) - ACTIVE - EU trademarks with UK applicants
        UK: {
            BASE_URL: 'https://api.euipo.europa.eu/trademark-search',
            ENDPOINTS: {
                SEARCH: '/trademarks',
                DETAILS: '/trademarks/{applicationNumber}',
                IMAGE: '/trademarks/{applicationNumber}/image',
                THUMBNAIL: '/trademarks/{applicationNumber}/image/thumbnail',
                SOUND: '/trademarks/{applicationNumber}/sound',
                VIDEO: '/trademarks/{applicationNumber}/video',
                MODEL: '/trademarks/{applicationNumber}/model'
            },
            OAUTH: {
                TOKEN_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/accessToken',
                AUTHORIZATION_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/authorize',
                    CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.CLIENT_ID) || '5a6c9a660fc2c2aea412cb317e4aeb6c',
                    CLIENT_SECRET: (typeof process !== 'undefined' && process.env && process.env.CLIENT_SECRET) || '451e4f1cc80ae12075f9c5d47bd556d8',
                SCOPES: ['trademark-search.trademarks.read']
            },
            STATUS: 'ACTIVE',
            QUERY_FILTER: 'markBasis==EU_TRADEMARK' // EU trademarks (includes UK companies)
        },

        // Mexico (MX) - ACTIVE - International trademarks (WIPO Madrid Protocol)
        MX: {
            BASE_URL: 'https://api.euipo.europa.eu/trademark-search',
            ENDPOINTS: {
                SEARCH: '/trademarks',
                DETAILS: '/trademarks/{applicationNumber}',
                IMAGE: '/trademarks/{applicationNumber}/image',
                THUMBNAIL: '/trademarks/{applicationNumber}/image/thumbnail',
                SOUND: '/trademarks/{applicationNumber}/sound',
                VIDEO: '/trademarks/{applicationNumber}/video',
                MODEL: '/trademarks/{applicationNumber}/model'
            },
            OAUTH: {
                TOKEN_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/accessToken',
                AUTHORIZATION_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/authorize',
                    CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.CLIENT_ID) || '5a6c9a660fc2c2aea412cb317e4aeb6c',
                    CLIENT_SECRET: (typeof process !== 'undefined' && process.env && process.env.CLIENT_SECRET) || '451e4f1cc80ae12075f9c5d47bd556d8',
                SCOPES: ['trademark-search.trademarks.read']
            },
            STATUS: 'ACTIVE',
            QUERY_FILTER: 'markBasis==INTERNATIONAL_TRADEMARK' // International trademarks (includes Mexico)
        },

        // Germany (DE) - ACTIVE - EU trademarks with Germany companies
        DE: {
            BASE_URL: 'https://api.euipo.europa.eu/trademark-search',
            ENDPOINTS: {
                SEARCH: '/trademarks',
                DETAILS: '/trademarks/{applicationNumber}',
                IMAGE: '/trademarks/{applicationNumber}/image',
                THUMBNAIL: '/trademarks/{applicationNumber}/image/thumbnail',
                SOUND: '/trademarks/{applicationNumber}/sound',
                VIDEO: '/trademarks/{applicationNumber}/video',
                MODEL: '/trademarks/{applicationNumber}/model'
            },
            OAUTH: {
                TOKEN_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/accessToken',
                AUTHORIZATION_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/authorize',
                    CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.CLIENT_ID) || '5a6c9a660fc2c2aea412cb317e4aeb6c',
                    CLIENT_SECRET: (typeof process !== 'undefined' && process.env && process.env.CLIENT_SECRET) || '451e4f1cc80ae12075f9c5d47bd556d8',
                SCOPES: ['trademark-search.trademarks.read']
            },
            STATUS: 'ACTIVE',
            QUERY_FILTER: 'markBasis==EU_TRADEMARK and applicants.name==*Germany*' // Germany companies in EU
        },

        // Australia (AU) - ACTIVE - International trademarks with Australia companies
        AU: {
            BASE_URL: 'https://api.euipo.europa.eu/trademark-search',
            ENDPOINTS: {
                SEARCH: '/trademarks',
                DETAILS: '/trademarks/{applicationNumber}',
                IMAGE: '/trademarks/{applicationNumber}/image',
                THUMBNAIL: '/trademarks/{applicationNumber}/image/thumbnail',
                SOUND: '/trademarks/{applicationNumber}/sound',
                VIDEO: '/trademarks/{applicationNumber}/video',
                MODEL: '/trademarks/{applicationNumber}/model'
            },
            OAUTH: {
                TOKEN_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/accessToken',
                AUTHORIZATION_URL: 'https://euipo.europa.eu/cas-server-webapp/oidc/authorize',
                    CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.CLIENT_ID) || '5a6c9a660fc2c2aea412cb317e4aeb6c',
                    CLIENT_SECRET: (typeof process !== 'undefined' && process.env && process.env.CLIENT_SECRET) || '451e4f1cc80ae12075f9c5d47bd556d8',
                SCOPES: ['trademark-search.trademarks.read']
            },
            STATUS: 'ACTIVE',
            QUERY_FILTER: 'markBasis==INTERNATIONAL_TRADEMARK' // All international trademarks (includes WIPO)
        }
    },

    // Default search parameters
    DEFAULT_SEARCH_PARAMS: {
        size: 100, // Maximum 100 for comprehensive results
        page: 0,
        sort: 'applicationDate:desc'
    },

    // Rate limiting information
    RATE_LIMITS: {
        REQUESTS_PER_MINUTE: 60,
        REQUESTS_PER_HOUR: 1000
    },

    // Application Settings
    APP: {
        NAME: 'UK Trademark Search',
        VERSION: '1.0.0',
        DESCRIPTION: 'Search for UK trademarks using the UK IPO API',
        MAX_SEARCH_RESULTS: 100,
        SEARCH_TIMEOUT: 30000 // 30 seconds
    },

    // Mock Data Configuration (for testing)
    MOCK_DATA: {
        ENABLED: false, // Set to true to use mock data instead of real API
        SAMPLE_TRADEMARKS: [
            {
                applicationNumber: 'MOCK001',
                wordMarkSpecification: {
                    verbalElement: 'Sample Trademark'
                },
                applicants: [{
                    name: 'Sample Company Ltd'
                }],
                applicationDate: '2024-01-01',
                status: 'REGISTERED'
            }
        ]
    },

    // UI Configuration
    UI: {
        THEME: 'light',
        LANGUAGE: 'en',
        SHOW_IMAGES: true,
        RESULTS_PER_PAGE: 20
    },

    // Error Messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Network error occurred. Please check your internet connection.',
        API_ERROR: 'API error occurred. Please try again later.',
        INVALID_INPUT: 'Please enter a valid trademark name.',
        NO_RESULTS: 'No trademarks found for the given search term.',
        UNAUTHORIZED: 'Unauthorized access. Please check your API credentials.',
        RATE_LIMIT: 'Rate limit exceeded. Please wait before making another request.'
    },

    // Development Settings
    DEBUG: {
        ENABLED: true,
        LOG_LEVEL: 'info', // debug, info, warn, error
        SHOW_API_RESPONSES: true
    }
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}