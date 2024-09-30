// script.js

// Array of instruments
const instruments = [
    { type: 'forex', from_symbol: 'EUR', to_symbol: 'USD', name: 'EUR/USD' },
    { type: 'forex', from_symbol: 'GBP', to_symbol: 'USD', name: 'GBP/USD' },
    { type: 'commodity', symbol: 'XAU', name: 'Gold' }, // XAU represents gold
    // You can add more instruments here
];

// Get references to DOM elements
const slider = document.getElementById('instrument-slider');
const instrumentLabel = document.getElementById('instrument-label');
const buyOrdersList = document.getElementById('buy-orders');
const sellOrdersList = document.getElementById('sell-orders');

// Set slider attributes based on instruments array
slider.max = instruments.length - 1;

// Function to update the instrument label and fetch data
function updateInstrument() {
    const index = slider.value;
    const instrument = instruments[index];
    instrumentLabel.textContent = instrument.name;
    fetchData(instrument);
}

// Function to fetch data from Alpha Vantage API
function fetchData(instrument) {
    let apiUrl = '';
    if (instrument.type === 'forex') {
        apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${instrument.from_symbol}&to_currency=${instrument.to_symbol}&apikey=C3O2F0805SFNOQG0`;
    } else if (instrument.type === 'commodity') {
        apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${instrument.symbol}&to_currency=USD&apikey=C3O2F0805SFNOQG0`;
    }

    // Display loading message
    buyOrdersList.innerHTML = '<li>Loading...</li>';
    sellOrdersList.innerHTML = '<li>Loading...</li>';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayData(data, instrument);
        })
        .catch(error => {
            console.error(`Error fetching data for ${instrument.name}:`, error);
            buyOrdersList.innerHTML = '<li>Error loading data</li>';
            sellOrdersList.innerHTML = '<li>Error loading data</li>';
        });
}

// Function to display data
function displayData(data, instrument) {
    // Clear existing data
    buyOrdersList.innerHTML = '';
    sellOrdersList.innerHTML = '';

    // Access the 'Realtime Currency Exchange Rate' object
    const exchangeData = data['Realtime Currency Exchange Rate'];

    // Check if data is available
    if (!exchangeData || Object.keys(exchangeData).length === 0) {
        buyOrdersList.innerHTML = '<li>No data available</li>';
        sellOrdersList.innerHTML = '<li>No data available</li>';
        return;
    }

    // Extract bid and ask prices
    const bidPrice = exchangeData['8. Bid Price'];
    const askPrice = exchangeData['9. Ask Price'];
    const exchangeRate = exchangeData['5. Exchange Rate'];

    if (bidPrice && askPrice) {
        const bidItem = document.createElement('li');
        bidItem.textContent = `Bid Price: ${bidPrice}`;
        buyOrdersList.appendChild(bidItem);

        const askItem = document.createElement('li');
        askItem.textContent = `Ask Price: ${askPrice}`;
        sellOrdersList.appendChild(askItem);
    } else if (exchangeRate) {
        const rateItem = document.createElement('li');
        rateItem.textContent = `Exchange Rate: ${exchangeRate}`;
        buyOrdersList.appendChild(rateItem);

        sellOrdersList.innerHTML = '<li>Data not available</li>';
    } else {
        buyOrdersList.innerHTML = '<li>No data available</li>';
        sellOrdersList.innerHTML = '<li>No data available</li>';
    }
}

// Event listener for slider change
slider.addEventListener('input', updateInstrument);

// Initialize on page load
updateInstrument();
