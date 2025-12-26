// Network and coin configuration
const networks = {
    "ETH": ["BNB", "ETH", "POL", "USDT ETH"],
    "TRX": ["TRX", "USDT TRX"],
    "SOL": ["SOL", "USDT SOL"],
    "DOGE": ["DOGE"]
};
// Network fees (example values)
const networkFees = {
    "ETH": 2.50,
    "TRX": 1.00,
    "SOL": 0.50,
    "DOGE": 0.25
};
// State
let selectedNetwork = null;
let selectedCoin = null;
let amount = 0;
let address = '';
let availableBalance = 0;
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
                onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';">
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
            onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';">
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
    // Update fee display
    updateFeeDisplay();
    // Check if form is complete
    checkFormCompletion();
}
// Populate coin dropdown
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
                onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';">
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
            onerror="if (!this.src.includes('generic.png')) this.src='/static/images/coins/small/generic.png';">
        <span>${coin}</span>
    `;
    // Close dropdown
    closeDropdown('coin');
    // Enable address input
    const addressInput = document.getElementById('addressInput');
    addressInput.classList.remove('disabled');
    addressInput.disabled = false;
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
// Update fee display
function updateFeeDisplay() {
    const withdrawAmount = document.getElementById('withdrawAmount');
    const networkFeeEl = document.getElementById('networkFee');
    const totalDeduction = document.getElementById('totalDeduction');
    const fee = selectedNetwork ? networkFees[selectedNetwork] : 0;
    const total = amount + fee;
    withdrawAmount.textContent = `$${amount.toFixed(2)}`;
    networkFeeEl.textContent = `~$${fee.toFixed(2)}`;
    totalDeduction.textContent = `$${total.toFixed(2)}`;
}
// Validate address
function validateAddress(addr) {
    // Basic validation - check if not empty and reasonable length
    return addr && addr.length >= 20 && addr.length <= 100;
}
// Check form completion
function checkFormCompletion() {
    const submitBtn = document.getElementById('submitBtn');
    const amountInput = document.getElementById('amountInput');
    const addressInput = document.getElementById('addressInput');
    amount = parseFloat(amountInput.value) || 0;
    address = addressInput.value.trim();
    const fee = selectedNetwork ? networkFees[selectedNetwork] : 0;
    const totalRequired = amount + fee;
    if (selectedNetwork && selectedCoin && validateAddress(address) &&
        amount >= 10 && totalRequired <= availableBalance) {
        submitBtn.classList.add('active');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;
    }
    updateFeeDisplay();
}
// Handle amount input
document.getElementById('amountInput').addEventListener('input', (e) => {
    amount = parseFloat(e.target.value) || 0;
    const errorMsg = document.getElementById('amountError');
    const fee = selectedNetwork ? networkFees[selectedNetwork] : 0;
    const totalRequired = amount + fee;
    if (amount > 0 && totalRequired > availableBalance) {
        errorMsg.textContent = `Insufficient balance (need $${totalRequired.toFixed(2)} including fees)`;
        errorMsg.classList.add('show');
    } else if (amount > 0 && amount < 10) {
        errorMsg.textContent = 'Minimum withdrawal is $10';
        errorMsg.classList.add('show');
    } else {
        errorMsg.classList.remove('show');
    }
    checkFormCompletion();
});
// Handle address input
document.getElementById('addressInput').addEventListener('input', (e) => {
    address = e.target.value.trim();
    const errorMsg = document.getElementById('addressError');
    if (address && !validateAddress(address)) {
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
document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedNetwork || !selectedCoin || !validateAddress(address) || amount < 10) {
        return;
    }
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Creating Request...';
    submitBtn.disabled = true;
    try {
        const response = await fetch('/api/withdraw/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                network: selectedNetwork,
                coin: selectedCoin,
                amount: amount,
                address: address
            })
        });
        if (response.ok) {
            const result = await response.json();
            // Redirect to withdraw request page
            window.location.href = `/withdraw/request/${result.withdraw_data.transaction_id}`;
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Failed to create withdrawal request'}`);
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Create Withdrawal Request';
            checkFormCompletion();
        }
    } catch (error) {
        alert('Connection error. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Create Withdrawal Request';
        checkFormCompletion();
    }
});
// Load wallet info
async function loadWalletInfo() {
    try {
        const response = await fetch('/api/wallet', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            availableBalance = data.available_balance;
            document.getElementById('availableBalance').textContent = availableBalance.toFixed(2);
            document.getElementById('referralBalance').textContent = data.available_referral_balance.toFixed(2);
            document.getElementById('withdrawableBalance').textContent = `$${availableBalance.toFixed(2)}`;
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
// Initialize
window.addEventListener('load', () => {
    initializeDropdowns();
    // loadWalletInfo();
});