class TrademarkSearch {
    constructor() {
        this.apiBaseUrl = CONFIG.API.UK.BASE_URL; // Use UK as default
        this.searchForm = document.getElementById('searchForm');
        this.resultsContainer = document.getElementById('results');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.accessToken = null;
        this.selectedCountries = ['UK']; // Default selection - only UK
        
        this.initializeEventListeners();
        this.initializeApiCredentials();
        this.initializeCountryButtons();
    }

    initializeEventListeners() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });
    }

    initializeCountryButtons() {
        const countryButtons = document.querySelectorAll('.country-card');
        console.log('Found country buttons:', countryButtons.length);
        
        countryButtons.forEach(button => {
            const country = button.dataset.country;
            console.log('Processing country:', country);
            
            // Set initial state
            if (country === 'UK') {
                button.classList.add('selected');
                // Find the icon element (it might be in a different structure)
                const iconElement = button.querySelector('i') || button.querySelector('.fas');
                if (iconElement) {
                    iconElement.className = 'fas fa-check-circle me-2';
                }
            } else {
                // Check if country is implemented
                if (CONFIG.API[country] && CONFIG.API[country].STATUS !== 'ACTIVE') {
                    button.classList.add('not-implemented');
                    const iconElement = button.querySelector('i') || button.querySelector('.fas');
                    if (iconElement) {
                        iconElement.className = 'fas fa-exclamation-triangle me-2';
                    }
                } else {
                    // Active but not selected by default
                    const iconElement = button.querySelector('i') || button.querySelector('.fas');
                    if (iconElement) {
                        iconElement.className = 'fas fa-plus-circle me-2';
                    }
                }
            }
            
            // Add click event
            button.addEventListener('click', () => {
                console.log('Country clicked:', country);
                if (button.classList.contains('not-implemented')) {
                    return; // Don't allow selection of unimplemented countries
                }
                
                this.toggleCountrySelection(country, button);
            });
        });
        
        this.updateSelectedCountriesDisplay();
    }

    toggleCountrySelection(country, button) {
        console.log('Toggling country:', country, 'Current selection:', this.selectedCountries);
        
        if (this.selectedCountries.includes(country)) {
            // Deselect
            this.selectedCountries = this.selectedCountries.filter(c => c !== country);
            button.classList.remove('selected');
            const iconElement = button.querySelector('i') || button.querySelector('.fas');
            if (iconElement) {
                iconElement.className = 'fas fa-plus-circle me-2';
            }
        } else {
            // Select
            this.selectedCountries.push(country);
            button.classList.add('selected');
            const iconElement = button.querySelector('i') || button.querySelector('.fas');
            if (iconElement) {
                iconElement.className = 'fas fa-check-circle me-2';
            }
        }
        
        console.log('New selection:', this.selectedCountries);
        this.updateSelectedCountriesDisplay();
    }

    updateSelectedCountriesDisplay() {
        const displayElement = document.getElementById('selectedCountries');
        if (displayElement) {
            if (this.selectedCountries.length === 0) {
                displayElement.textContent = 'No countries selected';
                displayElement.parentElement.className = 'mt-2 text-danger';
            } else {
                const countryNames = this.selectedCountries.map(c => this.getCountryName(c));
                displayElement.textContent = countryNames.join(', ');
                displayElement.parentElement.className = 'mt-2 text-success';
            }
        }
    }

    initializeApiCredentials() {
        // Check if mock data is enabled
        if (CONFIG.MOCK_DATA.ENABLED) {
            console.log('Demo mode enabled - using sample data');
            return;
        }
        
        // API credentials are now hardcoded in config.js
        // Try to authenticate immediately
        this.authenticateWithApi();
    }

    showApiCredentialsModal() {
        const modalHtml = `
            <div class="modal fade" id="apiCredentialsModal" tabindex="-1" aria-labelledby="apiCredentialsModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="apiCredentialsModalLabel">
                                <i class="fas fa-key me-2"></i>EUIPO API Credentials
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>API Access Required:</strong> To search real trademark data, you need EUIPO API credentials.
                                <br><br>
                                <strong>How to get credentials:</strong>
                                <ol>
                                    <li>Visit <a href="https://dev.euipo.europa.eu" target="_blank">EUIPO Developer Portal</a></li>
                                    <li>Create an account and register your application</li>
                                    <li>Get your Client ID and Client Secret</li>
                                </ol>
                            </div>
                            <form id="credentialsForm">
                                <div class="mb-3">
                                    <label for="clientId" class="form-label">Client ID</label>
                                    <input type="text" class="form-control" id="clientId" placeholder="Enter your Client ID">
                                </div>
                                <div class="mb-3">
                                    <label for="clientSecret" class="form-label">Client Secret</label>
                                    <input type="password" class="form-control" id="clientSecret" placeholder="Enter your Client Secret">
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="useDemoMode">
                                    <label class="form-check-label" for="useDemoMode">
                                        Use Demo Mode (with sample data)
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="useDemoBtn">Use Demo Mode</button>
                            <button type="button" class="btn btn-primary" id="saveCredentialsBtn">Save & Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('apiCredentialsModal'));
        modal.show();
        
        // Event listeners
        document.getElementById('saveCredentialsBtn').addEventListener('click', () => {
            const clientId = document.getElementById('clientId').value.trim();
            const clientSecret = document.getElementById('clientSecret').value.trim();
            
            if (clientId && clientSecret) {
                CONFIG.API.OAUTH.CLIENT_ID = clientId;
                CONFIG.API.OAUTH.CLIENT_SECRET = clientSecret;
                modal.hide();
                this.authenticateWithApi();
            } else {
                alert('Please enter both Client ID and Client Secret');
            }
        });
        
        document.getElementById('useDemoBtn').addEventListener('click', () => {
            CONFIG.MOCK_DATA.ENABLED = true;
            modal.hide();
        });
    }

    async authenticateWithApi() {
        try {
            this.showLoading(true);
            this.hideError();
            
            console.log('Attempting authentication with:', {
                tokenUrl: CONFIG.API.UK.OAUTH.TOKEN_URL,
                clientId: CONFIG.API.UK.OAUTH.CLIENT_ID,
                scope: CONFIG.API.UK.OAUTH.SCOPES.join(' ')
            });
            
            // Use proxy server to avoid CORS issues
            const baseUrl = window.location.origin;
            const tokenResponse = await fetch(`${baseUrl}/api/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'grant_type': 'client_credentials',
                    'client_id': CONFIG.API.UK.OAUTH.CLIENT_ID,
                    'client_secret': CONFIG.API.UK.OAUTH.CLIENT_SECRET,
                    'scope': CONFIG.API.UK.OAUTH.SCOPES.join(' ')
                })
            });

            console.log('Token response status:', tokenResponse.status);
            console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

            if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                console.error('Token response error:', errorText);
                throw new Error(`Authentication failed: ${tokenResponse.status} - ${errorText}`);
            }

            const tokenData = await tokenResponse.json();
            console.log('Token data received:', tokenData);
            
            if (!tokenData.access_token) {
                throw new Error('No access token received from API');
            }
            
            this.accessToken = tokenData.access_token;
            console.log('Successfully authenticated with EUIPO API');
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.showError(`Authentication failed: ${error.message}. Please check your credentials and try again.`);
            CONFIG.MOCK_DATA.ENABLED = true; // Fallback to demo mode
        } finally {
            this.showLoading(false);
        }
    }

    async performSearch() {
        const trademarkName = document.getElementById('trademarkName').value.trim();
        
        if (!trademarkName) {
            this.showError('Please enter a trademark name to search.');
            return;
        }

        if (this.selectedCountries.length === 0) {
            this.showError('Please select at least one country to search.');
            return;
        }

        this.showLoading(true);
        this.clearResults();
        this.hideError();

        try {
            // Search for trademarks in selected countries
            const allResults = await this.searchTrademarksMultiCountry(trademarkName, this.selectedCountries);
            
            if (allResults && allResults.length > 0) {
                this.displayMultiCountryResults(allResults, trademarkName, this.selectedCountries);
            } else {
                this.showNoResults(trademarkName);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError(`Search failed: ${error.message}`);
            
            // If API fails and we're not in demo mode, offer to switch to demo mode
            if (!CONFIG.MOCK_DATA.ENABLED) {
                this.showApiErrorFallback();
            }
        } finally {
            this.showLoading(false);
        }
    }

    async searchTrademarksMultiCountry(trademarkName, countries) {
        const results = [];
        
        for (const country of countries) {
            try {
                console.log(`Searching in ${country}...`);
                
                    if (country === 'UK' && CONFIG.API.UK.STATUS === 'ACTIVE') {
                        const ukResults = await this.searchTrademarksUK(trademarkName);
                        if (ukResults && ukResults.trademarks) {
                            results.push({
                                country: 'UK',
                                countryName: 'United Kingdom',
                                flag: '🇬🇧',
                                results: ukResults.trademarks,
                                total: ukResults.totalElements
                            });
                        }
                    } else if (country === 'DE' && CONFIG.API.DE.STATUS === 'ACTIVE') {
                        const deResults = await this.searchTrademarksDE(trademarkName);
                        if (deResults && deResults.trademarks) {
                            results.push({
                                country: 'DE',
                                countryName: 'Germany',
                                flag: '🇩🇪',
                                results: deResults.trademarks,
                                total: deResults.totalElements
                            });
                        }
                    } else if (country === 'AU' && CONFIG.API.AU.STATUS === 'ACTIVE') {
                        const auResults = await this.searchTrademarksAU(trademarkName);
                        if (auResults && auResults.trademarks) {
                            results.push({
                                country: 'AU',
                                countryName: 'Australia',
                                flag: '🇦🇺',
                                results: auResults.trademarks,
                                total: auResults.totalElements
                            });
                        }
                    } else if (country === 'MX' && CONFIG.API.MX.STATUS === 'ACTIVE') {
                        const mxResults = await this.searchTrademarksMX(trademarkName);
                        if (mxResults && mxResults.trademarks) {
                            results.push({
                                country: 'MX',
                                countryName: 'Mexico',
                                flag: '🇲🇽',
                                results: mxResults.trademarks,
                                total: mxResults.totalElements
                            });
                        }
                    } else {
                        // Country not implemented yet
                        results.push({
                            country: country,
                            countryName: this.getCountryName(country),
                            flag: this.getCountryFlag(country),
                            results: [],
                            total: 0,
                            status: 'NOT_IMPLEMENTED'
                        });
                    }
            } catch (error) {
                console.error(`Error searching in ${country}:`, error);
                results.push({
                    country: country,
                    countryName: this.getCountryName(country),
                    flag: this.getCountryFlag(country),
                    results: [],
                    total: 0,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    async searchTrademarksDE(trademarkName) {
        // Check if we should use mock data
        if (CONFIG.MOCK_DATA.ENABLED) {
            return this.getMockData(trademarkName);
        }

        // Create RSQL query with Germany filter
        const baseQuery = `wordMarkSpecification.verbalElement==*${trademarkName}*`;
        const deFilter = CONFIG.API.DE.QUERY_FILTER;
        const query = `${baseQuery} and ${deFilter}`;
        
        console.log('DE Search Query:', query);
        console.log('DE Filter from config:', deFilter);

        // Use proxy server to avoid CORS issues
        const baseUrl = window.location.origin;
        const searchUrl = `${baseUrl}/api/trademarks?query=${encodeURIComponent(query)}&size=100&page=0&sort=applicationDate:desc&access_token=${this.accessToken}`;

        try {
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please check your API credentials');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded: Please wait before making another request');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('DE API Response:', data);
            return data;

        } catch (error) {
            console.error('DE API call failed:', error);
            throw error;
        }
    }

    async searchTrademarksUK(trademarkName) {
        // Check if we should use mock data
        if (CONFIG.MOCK_DATA.ENABLED) {
            return this.getMockData(trademarkName);
        }

        // Create RSQL query with UK filter
        const baseQuery = `wordMarkSpecification.verbalElement==*${trademarkName}*`;
        const ukFilter = CONFIG.API.UK.QUERY_FILTER;
        const query = `${baseQuery} and ${ukFilter}`;
        
        console.log('UK Search Query:', query);
        console.log('UK Filter from config:', ukFilter);

        // Use proxy server to avoid CORS issues
        const baseUrl = window.location.origin;
        const searchUrl = `${baseUrl}/api/trademarks?query=${encodeURIComponent(query)}&size=100&page=0&sort=applicationDate:desc&access_token=${this.accessToken}`;

        try {
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please check your API credentials');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded: Please wait before making another request');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('UK API Response:', data);
            return data;

        } catch (error) {
            console.error('UK API call failed:', error);
            throw error;
        }
    }

    async searchTrademarksAU(trademarkName) {
        // Check if we should use mock data
        if (CONFIG.MOCK_DATA.ENABLED) {
            return this.getMockData(trademarkName);
        }

        // Create RSQL query with Australia filter
        const baseQuery = `wordMarkSpecification.verbalElement==*${trademarkName}*`;
        const auFilter = CONFIG.API.AU.QUERY_FILTER;
        const query = `${baseQuery} and ${auFilter}`;
        
        console.log('AU Search Query:', query);
        console.log('AU Filter from config:', auFilter);
        
        // Special search for 749484 application number
        if (trademarkName.toLowerCase() === 'nike') {
            console.log('Searching for Nike with application number 749484...');
        }

        // Use proxy server to avoid CORS issues
        const baseUrl = window.location.origin;
        const searchUrl = `${baseUrl}/api/trademarks?query=${encodeURIComponent(query)}&size=100&page=0&sort=applicationDate:desc&access_token=${this.accessToken}`;

        try {
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please check your API credentials');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded: Please wait before making another request');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('AU API Response:', data);
            return data;

        } catch (error) {
            console.error('AU API call failed:', error);
            throw error;
        }
    }

    async searchTrademarksMX(trademarkName) {
        // Check if we should use mock data
        if (CONFIG.MOCK_DATA.ENABLED) {
            return this.getMockData(trademarkName);
        }

        // Create RSQL query with Mexico filter (International trademarks)
        const baseQuery = `wordMarkSpecification.verbalElement==*${trademarkName}*`;
        const mxFilter = CONFIG.API.MX.QUERY_FILTER;
        const query = `${baseQuery} and ${mxFilter}`;

        // Use proxy server to avoid CORS issues
        const baseUrl = window.location.origin;
        const searchUrl = `${baseUrl}/api/trademarks?query=${encodeURIComponent(query)}&size=100&page=0&sort=applicationDate:desc&access_token=${this.accessToken}`;

        try {
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please check your API credentials');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded: Please wait before making another request');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('MX API Response:', data);
            return data;

        } catch (error) {
            console.error('MX API call failed:', error);
            throw error;
        }
    }

    getCountryName(countryCode) {
        const names = {
            'DE': 'Germany',
            'UK': 'United Kingdom',
            'AU': 'Australia',
            'MX': 'Mexico'
        };
        return names[countryCode] || countryCode;
    }

    getCountryFlag(countryCode) {
        const flags = {
            'DE': '🇩🇪',
            'UK': '🇬🇧',
            'AU': '🇦🇺',
            'MX': '🇲🇽'
        };
        return flags[countryCode] || '🏳️';
    }

    getMockData(trademarkName) {
        // Mock data for demonstration purposes
        const mockTrademarks = [
            {
                applicationNumber: "018692868",
                applicationDate: "2020-03-15",
                registrationDate: "2021-06-20",
                expiryDate: "2031-06-20",
                status: "REGISTERED",
                statusDate: "2021-06-20",
                markFeature: "WORD",
                wordMarkSpecification: {
                    verbalElement: trademarkName.toUpperCase()
                },
                applicants: [
                    {
                        name: "Example Company Ltd",
                        identifier: "12345678"
                    }
                ],
                goodsAndServices: [
                    {
                        classNumber: 25,
                        description: "Clothing, footwear, headgear"
                    }
                ]
            },
            {
                applicationNumber: "019123456",
                applicationDate: "2019-08-10",
                registrationDate: null,
                expiryDate: null,
                status: "UNDER_EXAMINATION",
                statusDate: "2023-01-15",
                markFeature: "WORD",
                wordMarkSpecification: {
                    verbalElement: trademarkName.toUpperCase() + " PRO"
                },
                applicants: [
                    {
                        name: "Another Company Inc",
                        identifier: "87654321"
                    }
                ],
                goodsAndServices: [
                    {
                        classNumber: 9,
                        description: "Computer software and hardware"
                    }
                ]
            }
        ];

        return {
            trademarks: mockTrademarks,
            totalElements: mockTrademarks.length,
            totalPages: 1,
            page: 0,
            size: 20
        };
    }

    displayMultiCountryResults(allResults, searchTerm, selectedCountries) {
        const resultsContainer = document.getElementById('results');
        const resultsTitle = document.getElementById('resultsTitle');
        const totalResults = document.getElementById('totalResults');
        const resultsContent = document.getElementById('resultsContent');
        
        // Check if elements exist
        if (!resultsContainer || !resultsTitle || !totalResults || !resultsContent) {
            console.error('Required DOM elements not found');
            this.showError('Error displaying results: Required elements not found');
            return;
        }
        
        // Calculate total results
        const total = allResults.reduce((sum, result) => sum + (result.total || 0), 0);
        
        // Update title and total
        resultsTitle.textContent = `Search Results for "${searchTerm}"`;
        totalResults.textContent = `${total} total found`;
        
        // Clear previous results
        resultsContent.innerHTML = '';
        
        // Display results for each country
        allResults.forEach(result => {
            const countrySection = document.createElement('div');
            countrySection.className = 'country-results';
            
            let countryContent = `
                <div class="country-header" onclick="this.parentElement.querySelector('.country-details').classList.toggle('collapsed')">
                    <span class="country-flag-large">${result.flag}</span>
                    <span class="country-name-large">${result.countryName}</span>
                    <span class="country-count">${result.total || 0} found</span>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="country-details">
            `;
            
            if (result.error) {
                countryContent += `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Error: ${result.error}
                    </div>
                `;
            } else if (result.status === 'NOT_IMPLEMENTED') {
                countryContent += `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${result.countryName} search is not implemented yet.
                    </div>
                `;
            } else if (!result.results || result.results.length === 0) {
                countryContent += `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h4>No trademarks found</h4>
                        <p>No trademarks found in ${result.countryName} for "${searchTerm}"</p>
                    </div>
                `;
            } else {
                // Group results by status
                const groupedResults = this.groupResultsByStatus(result.results);
                
                // Create status summary
                const statusSummary = this.createStatusSummary(groupedResults);
                countryContent += `
                    <div class="status-summary">
                        ${statusSummary}
                    </div>
                `;
                
                countryContent += '<div class="status-groups">';
                
                Object.entries(groupedResults).forEach(([status, trademarks]) => {
                    const statusInfo = this.getStatusInfo(status);
                    countryContent += `
                        <div class="status-group">
                            <div class="status-header ${statusInfo.class}">
                                <i class="${statusInfo.icon}"></i>
                                <span>${statusInfo.name}</span>
                                <span class="ms-auto">${trademarks.length}</span>
                            </div>
                            <div class="status-content">
                    `;
                    
                    trademarks.forEach(trademark => {
                        countryContent += `
                            <div class="trademark-item">
                                <div class="trademark-name">${trademark.wordMarkSpecification?.verbalElement || 'N/A'}</div>
                                <div class="trademark-details">
                                    <div class="trademark-detail">
                                        <i class="fas fa-hashtag"></i>
                                        <span>${trademark.applicationNumber}</span>
                                    </div>
                                    <div class="trademark-detail">
                                        <i class="fas fa-calendar"></i>
                                        <span>${trademark.applicationDate || 'N/A'}</span>
                                    </div>
                                    ${trademark.registrationDate ? `
                                        <div class="trademark-detail">
                                            <i class="fas fa-check-circle"></i>
                                            <span>${trademark.registrationDate}</span>
                                        </div>
                                    ` : ''}
                                    ${trademark.expiryDate ? `
                                        <div class="trademark-detail">
                                            <i class="fas fa-clock"></i>
                                            <span>${trademark.expiryDate}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    });
                    
                    countryContent += `
                            </div>
                        </div>
                    `;
                });
                
                countryContent += '</div>';
            }
            
            countryContent += '</div>'; // Close country-details div
            
            countrySection.innerHTML = countryContent;
            resultsContent.appendChild(countrySection);
        });
        
        // Show results section
        resultsContainer.style.display = 'block';
    }

    createCountrySection(countryResult, searchTerm) {
        const { country, countryName, flag, results, total, status, error } = countryResult;
        
        if (status === 'NOT_IMPLEMENTED') {
            return `
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <h5 class="mb-2">
                                ${flag} ${countryName}
                                <span class="badge bg-warning ms-2">Not Implemented</span>
                            </h5>
                            <p class="mb-0">${countryName} API is not implemented yet. Please contact support to add this country.</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (error) {
            return `
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <h5 class="mb-2">
                                ${flag} ${countryName}
                                <span class="badge bg-danger ms-2">Error</span>
                            </h5>
                            <p class="mb-0">Error searching in ${countryName}: ${error}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (total === 0) {
            return `
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="alert alert-info">
                            <h5 class="mb-2">
                                ${flag} ${countryName}
                                <span class="badge bg-info ms-2">0 found</span>
                            </h5>
                            <p class="mb-0">No trademarks found in ${countryName} for "${searchTerm}"</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h5 class="mb-0">
                                ${flag} ${countryName}
                                <span class="badge bg-success ms-2">${total} found</span>
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                ${results.map(trademark => this.createTrademarkCard(trademark, country)).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayResults(trademarks, searchTerm) {
        const resultsHtml = `
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4">
                        <i class="fas fa-search me-2"></i>
                        Search Results for "${searchTerm}"
                        <span class="badge bg-primary ms-2">${trademarks.length} found</span>
                    </h3>
                </div>
            </div>
            <div class="row">
                ${trademarks.map(trademark => this.createTrademarkCard(trademark)).join('')}
            </div>
        `;
        
        this.resultsContainer.innerHTML = resultsHtml;
    }

    createTrademarkCard(trademark) {
        const statusInfo = this.getStatusInfo(trademark.status);
        const isActive = this.isTrademarkActive(trademark);
        const registrationDate = trademark.registrationDate || 'Not registered yet';
        const expiryDate = trademark.expiryDate || 'N/A';
        
        return `
            <div class="col-12 mb-4">
                <div class="result-card p-4">
                    <div class="row">
                        <div class="col-md-8">
                            <h4 class="fw-bold text-primary mb-2">
                                <i class="fas fa-trademark me-2"></i>
                                ${trademark.wordMarkSpecification?.verbalElement || 'N/A'}
                            </h4>
                            <p class="text-muted mb-3">
                                <strong>Application Number:</strong> ${trademark.applicationNumber}<br>
                                <strong>Type:</strong> ${trademark.markFeature || 'N/A'}
                            </p>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="date-info">
                                        <h6 class="fw-bold text-success">
                                            <i class="fas fa-calendar-check me-2"></i>Registration Date
                                        </h6>
                                        <p class="mb-0">${registrationDate}</p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="date-info">
                                        <h6 class="fw-bold text-warning">
                                            <i class="fas fa-calendar-times me-2"></i>Expiry Date
                                        </h6>
                                        <p class="mb-0">${expiryDate}</p>
                                    </div>
                                </div>
                            </div>
                            
                            ${trademark.applicants && trademark.applicants.length > 0 ? `
                                <div class="mt-3">
                                    <h6 class="fw-bold">
                                        <i class="fas fa-building me-2"></i>Applicant(s)
                                    </h6>
                                    <ul class="list-unstyled">
                                        ${trademark.applicants.map(applicant => 
                                            `<li><i class="fas fa-user me-2"></i>${applicant.name}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${trademark.goodsAndServices && trademark.goodsAndServices.length > 0 ? `
                                <div class="mt-3">
                                    <h6 class="fw-bold">
                                        <i class="fas fa-tags me-2"></i>Goods & Services
                                    </h6>
                                    <div class="d-flex flex-wrap gap-2">
                                        ${trademark.goodsAndServices.map(gas => 
                                            `<span class="badge bg-light text-dark">Class ${gas.classNumber}: ${gas.description}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="col-md-4 text-end">
                            <div class="mb-3">
                                <span class="status-badge ${statusInfo.class}">
                                    <i class="${statusInfo.icon} me-1"></i>
                                    ${statusInfo.text}
                                </span>
                            </div>
                            
                            <div class="mb-3">
                                <div class="alert ${isActive ? 'alert-success' : 'alert-warning'} p-3">
                                    <h6 class="fw-bold mb-1">
                                        <i class="fas ${isActive ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
                                        Status
                                    </h6>
                                    <p class="mb-0">
                                        ${isActive ? 'Active Trademark' : 'Inactive/Expired Trademark'}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="text-muted small">
                                <p class="mb-1">
                                    <strong>Application Date:</strong><br>
                                    ${trademark.applicationDate || 'N/A'}
                                </p>
                                <p class="mb-0">
                                    <strong>Status Date:</strong><br>
                                    ${trademark.statusDate || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusInfo(status) {
        const statusMap = {
            'REGISTERED': { text: 'Registered', class: 'status-registered', icon: 'fas fa-check-circle' },
            'UNDER_EXAMINATION': { text: 'Under Examination', class: 'status-pending', icon: 'fas fa-clock' },
            'APPLICATION_PUBLISHED': { text: 'Published', class: 'status-pending', icon: 'fas fa-eye' },
            'REGISTRATION_PENDING': { text: 'Registration Pending', class: 'status-pending', icon: 'fas fa-hourglass-half' },
            'WITHDRAWN': { text: 'Withdrawn', class: 'status-expired', icon: 'fas fa-times-circle' },
            'REFUSED': { text: 'Refused', class: 'status-expired', icon: 'fas fa-ban' },
            'CANCELLED': { text: 'Cancelled', class: 'status-expired', icon: 'fas fa-trash' },
            'EXPIRED': { text: 'Expired', class: 'status-expired', icon: 'fas fa-calendar-times' },
            'OPPOSITION_PENDING': { text: 'Opposition Pending', class: 'status-pending', icon: 'fas fa-gavel' }
        };
        
        return statusMap[status] || { text: status, class: 'status-pending', icon: 'fas fa-question-circle' };
    }

    isTrademarkActive(trademark) {
        const activeStatuses = ['REGISTERED', 'UNDER_EXAMINATION', 'APPLICATION_PUBLISHED', 'REGISTRATION_PENDING'];
        const isStatusActive = activeStatuses.includes(trademark.status);
        
        // Check if expiry date is in the future
        let isNotExpired = true;
        if (trademark.expiryDate) {
            const expiryDate = new Date(trademark.expiryDate);
            const today = new Date();
            isNotExpired = expiryDate > today;
        }
        
        return isStatusActive && isNotExpired;
    }

    showNoResults(searchTerm) {
        this.resultsContainer.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h3 class="text-muted">No trademarks found</h3>
                        <p class="text-muted">No trademarks were found matching "${searchTerm}"</p>
                        <p class="text-muted small">Try searching with a different term or check the spelling.</p>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(show) {
        const loadingElement = document.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            console.error('Error message element not found:', message);
        }
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearResults() {
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        const resultsContent = document.getElementById('resultsContent');
        if (resultsContent) {
            resultsContent.innerHTML = '';
        }
    }

    showApiErrorFallback() {
        const fallbackHtml = `
            <div class="alert alert-warning mt-4">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>API Connection Failed</h5>
                <p>The EUIPO API is currently unavailable or your credentials are invalid.</p>
                <p>You can:</p>
                <ul>
                    <li>Check your internet connection</li>
                    <li>Verify your API credentials</li>
                    <li>Try again later</li>
                    <li>Use demo mode to see sample data</li>
                </ul>
                <button class="btn btn-outline-primary" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>Reload Page
                </button>
                <button class="btn btn-primary ms-2" onclick="CONFIG.MOCK_DATA.ENABLED = true; location.reload()">
                    <i class="fas fa-play me-2"></i>Use Demo Mode
                </button>
            </div>
        `;
        
        this.resultsContainer.innerHTML = fallbackHtml;
    }

    groupResultsByStatus(trademarks) {
        const groups = {};
        
        trademarks.forEach(trademark => {
            const status = trademark.status || 'UNKNOWN';
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(trademark);
        });
        
        // Sort groups by priority (Active first, then others)
        const sortedGroups = {};
        const priority = ['REGISTERED', 'ACCEPTED', 'ACTIVE', 'EXPIRED', 'WITHDRAWN', 'REFUSED', 'CANCELLED', 'REMOVED_FROM_REGISTER'];
        
        priority.forEach(status => {
            if (groups[status]) {
                sortedGroups[status] = groups[status];
            }
        });
        
        // Add any remaining statuses
        Object.keys(groups).forEach(status => {
            if (!sortedGroups[status]) {
                sortedGroups[status] = groups[status];
            }
        });
        
        return sortedGroups;
    }

    getStatusInfo(status) {
        const statusMap = {
            'REGISTERED': { name: 'Registered', class: 'registered', icon: 'fas fa-check-circle' },
            'ACCEPTED': { name: 'Accepted', class: 'active', icon: 'fas fa-check-circle' },
            'ACTIVE': { name: 'Active', class: 'active', icon: 'fas fa-check-circle' },
            'EXPIRED': { name: 'Expired', class: 'expired', icon: 'fas fa-clock' },
            'WITHDRAWN': { name: 'Withdrawn', class: 'withdrawn', icon: 'fas fa-times-circle' },
            'REFUSED': { name: 'Refused', class: 'withdrawn', icon: 'fas fa-times-circle' },
            'CANCELLED': { name: 'Cancelled', class: 'withdrawn', icon: 'fas fa-times-circle' },
            'REMOVED_FROM_REGISTER': { name: 'Removed', class: 'withdrawn', icon: 'fas fa-times-circle' }
        };
        
        return statusMap[status] || { name: status, class: 'secondary', icon: 'fas fa-question-circle' };
    }

    createStatusSummary(groupedResults) {
        const summary = [];
        
        Object.entries(groupedResults).forEach(([status, trademarks]) => {
            const statusInfo = this.getStatusInfo(status);
            const count = trademarks.length;
            
            if (count > 0) {
                summary.push(`<span class="status-summary-item ${statusInfo.class}">${count} ${statusInfo.name.toLowerCase()}</span>`);
            }
        });
        
        return summary.join(' • ');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrademarkSearch();
});
