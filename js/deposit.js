// Network and coin configuration
const networks = {
    "ETH": ["BNB", "ETH", "POL", "USDT ETH"],
    "TRX": ["TRX", "USDT TRX"],
    "SOL": ["SOL", "USDT SOL"],
    "DOGE": ["DOGE"]
};
// State
let selectedNetwork = null;
let selectedCoin = null;
let amount = 0;
// Get coin icon path
function getCoinIcon(coin) {
    const coinName = coin.split(' ')[0].toLowerCase();
    return `/static/images/coins/small/${coinName}.png`;
}
// Get network icon
function getNetworkIcon(network) {
    const iconMap = {
        'ETH': 'eth',
        'TRX': 'trx',
        'SOL': 'sol',
        'DOGE': 'doge'
    };
    return `/static/images/coins/small/${iconMap[network] || 'generic'}.png`;
}
// Initialize dropdowns
function initializeDropdowns() {
    const networkDropdown = document.getElementById('networkDropdown');
    // Populate network dropdown
    Object.keys(networks).forEach(network => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = network;
        option.innerHTML = `
            <img src="${getNetworkIcon(network)}"
                alt="${network}"
                class="network-icon"
                onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';"
            <span>${network}</span>
        `;
        option.addEventListener('click', () => selectNetwork(network));
        networkDropdown.appendChild(option);
    });
}
// Select network
function selectNetwork(network) {
    selectedNetwork = network;
    selectedCoin = null;
    // Update network display
    const networkSelect = document.getElementById('networkSelect');
    const display = networkSelect.querySelector('.select-display');
    display.innerHTML = `
        <img src="${getNetworkIcon(network)}"
            alt="${network}"
            class="network-icon"
            onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';"
        <span>${network}</span>
    `;
    // Close dropdown
    closeDropdown('network');
    // Enable coin selector
    const coinSelect = document.getElementById('coinSelect');
    coinSelect.classList.remove('disabled');
    // Update coin dropdown
    populateCoinDropdown(network);
    // Reset coin display
    const coinDisplay = coinSelect.querySelector('.select-display');
    coinDisplay.innerHTML = '<span class="select-placeholder">Select Coin</span>';
    // Check if form is complete
    checkFormCompletion();
}
// Populate coin dropdown based on selected network
function populateCoinDropdown(network) {
    const coinDropdown = document.getElementById('coinDropdown');
    coinDropdown.innerHTML = '';
    networks[network].forEach(coin => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = coin;
        option.innerHTML = `
            <img src="${getCoinIcon(coin)}"
                alt="${coin}"
                class="coin-icon"
                onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';"
            <span>${coin}</span>
        `;
        option.addEventListener('click', () => selectCoin(coin));
        coinDropdown.appendChild(option);
    });
}
// Select coin
function selectCoin(coin) {
    selectedCoin = coin;
    // Update coin display
    const coinSelect = document.getElementById('coinSelect');
    const display = coinSelect.querySelector('.select-display');
    display.innerHTML = `
        <img src="${getCoinIcon(coin)}"
            alt="${coin}"
            class="coin-icon"
            onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';"
        <span>${coin}</span>
    `;
    // Close dropdown
    closeDropdown('coin');
    // Check if form is complete
    checkFormCompletion();
}
// Toggle dropdown
function toggleDropdown(type) {
    const select = document.getElementById(`${type}Select`);
    const dropdown = document.getElementById(`${type}Dropdown`);
    const arrow = select.querySelector('.select-arrow');
    if (type === 'coin' && !selectedNetwork) return;
    const isOpen = dropdown.classList.contains('open');
    // Close all dropdowns
    closeAllDropdowns();
    if (!isOpen) {
        dropdown.classList.add('open');
        select.classList.add('active');
        arrow.classList.add('open');
    }
}
// Close specific dropdown
function closeDropdown(type) {
    const select = document.getElementById(`${type}Select`);
    const dropdown = document.getElementById(`${type}Dropdown`);
    const arrow = select.querySelector('.select-arrow');
    dropdown.classList.remove('open');
    select.classList.remove('active');
    arrow.classList.remove('open');
}
// Close all dropdowns
function closeAllDropdowns() {
    ['network', 'coin'].forEach(type => closeDropdown(type));
}
// Check form completion
function checkFormCompletion() {
    const submitBtn = document.getElementById('submitBtn');
    const amountInput = document.getElementById('amountInput');
    amount = parseFloat(amountInput.value) || 0;
    if (selectedNetwork && selectedCoin && amount >= 10) {
        submitBtn.classList.add('active');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;
    }
}
// Handle amount input
document.getElementById('amountInput').addEventListener('input', (e) => {
    amount = parseFloat(e.target.value) || 0;
    const errorMsg = document.getElementById('amountError');
    if (amount > 0 && amount < 10) {
        errorMsg.classList.add('show');
    } else {
        errorMsg.classList.remove('show');
    }
    checkFormCompletion();
});
// Setup dropdown click handlers
document.getElementById('networkSelect').addEventListener('click', () => toggleDropdown('network'));
document.getElementById('coinSelect').addEventListener('click', () => toggleDropdown('coin'));
// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.select-wrapper')) {
        closeAllDropdowns();
    }
});
// Handle form submission
document.getElementById('depositForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedNetwork || !selectedCoin || amount < 10) {
        return;
    }
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Creating Request...';
    submitBtn.disabled = true;
    try {
        const response = await fetch('/api/deposit/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                network: selectedNetwork,
                coin: selectedCoin,
                amount: amount
            })
        });
        if (response.ok) {
            const result = await response.json();
            // Redirect to deposit request page with transaction ID
            window.location.href = `/deposit/request/${result.transaction_id}`;
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Failed to create deposit request'}`);
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Create Deposit Request';
            checkFormCompletion();
        }
    } catch (error) {
        alert('Connection error. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Create Deposit Request';
        checkFormCompletion();
    }
});
// Load wallet info
async function loadWalletInfo() {
    try {
        const response = await fetch('/api/wallet', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('availableBalance').textContent = data.available_balance.toFixed(2);
            document.getElementById('referralBalance').textContent = data.available_referral_balance.toFixed(2);
        }
    } catch (error) {
        console.error('Error loading wallet info:', error);
    }
}
// Profile menu toggle
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}
// Handle navigation
document.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.dataset.target;
        if (target) {
            window.location.href = target;
        }
    });
});
// Handle deposit
function handleDeposit() {
    window.location.href = '/deposit';
}
// Handle withdraw
function handleWithdraw() {
    window.location.href = '/withdraw';
}
// Handle logout
async function handleLogout(event) {
    event.preventDefault();
    document.getElementById('profileDropdown').classList.remove('active');
    const logoutEndpoint = '/api/auth/logout';
    try {
        const response = await fetch(logoutEndpoint, {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed on the server side.');
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Network error during logout:', error);
        alert('A network error occurred. Check your connection.');
    }
}
// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.getElementById('profileDropdown');
    if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});
// Initialize
window.addEventListener('load', () => {
    initializeDropdowns();
    // loadWalletInfo();
});