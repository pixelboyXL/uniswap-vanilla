let currentPage = 1;
let transactionsPerPage = 10;
let allTransactions = [];
let filteredTransactions = [];
// Initialize page
async function initializePage() {
    await loadWalletInfo();
    await loadTransactions();
}
// Wallet Info
async function loadWalletInfo() {
    try {
        const response = await fetch('/api/wallet', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('availableBalance').textContent = data.available_balance.toFixed(2);
            document.getElementById('referralBalance').textContent = data.available_referral_balance.toFixed(2);
        } else {
            throw new Error('Failed to load wallet');
        }
    } catch (error) {
        console.error('Error loading wallet info:', error);
    }
}
// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch('/api/transaction_history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            allTransactions = data.transactions;
            filteredTransactions = [...allTransactions];
            renderTransactions();
        } else {
            console.error('Failed to load transactions');
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        showEmptyState();
    }
}
// Render transactions table
function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    const emptyState = document.getElementById('emptyState');
    const paginationWrapper = document.getElementById('paginationWrapper');
    if (filteredTransactions.length === 0) {
        showEmptyState();
        return;
    }
    emptyState.style.display = 'none';
    tbody.innerHTML = '';
    // Calculate pagination
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = Math.min(startIndex + transactionsPerPage, filteredTransactions.length);
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);
    // Render transactions
    pageTransactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tbody.appendChild(row);
    });
    // Update pagination
    updatePagination(startIndex, endIndex, filteredTransactions.length);
}
// Create transaction row
function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    row.onclick = () => navigateToTransaction(transaction);
    const typeClass = transaction.direction === 'deposit' ? 'type-deposit' : 'type-withdraw';
    const typeIcon = transaction.direction === 'deposit' ? '↓' : '↑';
    const statusClass = `status-${transaction.status.toLowerCase()}`;
    row.innerHTML = `
        <td>
            <span class="transaction-type ${typeClass}">
                <span>${typeIcon}</span>
                ${transaction.direction.charAt(0).toUpperCase() + transaction.direction.slice(1)}
            </span>
        </td>
        <td>
            <div class="amount-cell">
                ${transaction.amount.toFixed(4)} USDT
                <span class="amount-usd">≈ $${transaction.amount.toFixed(2)}</span>
            </div>
        </td>
        <td>
            <span class="network-badge">
                ${getNetworkIcon(transaction.network)}
                ${transaction.network}
            </span>
        </td>
        <td>
            <span class="address-cell">
                <span class="address-truncated" title="${transaction.address}">
                    ${truncateAddress(transaction.address)}
                </span>
            </span>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                ${getStatusIcon(transaction.status)}
                ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
        </td>
        <td>
            <div class="date-cell">
                ${formatDate(transaction.created_at)}
                <span class="date-time">${formatTime(transaction.created_at)}</span>
            </div>
        </td>
    `;
    return row;
}
// Navigate to transaction detail page
function navigateToTransaction(transaction) {
    const baseUrl = transaction.direction === 'deposit'
        ? '/deposit/request/'
        : '/withdraw/request/';
    window.location.href = baseUrl + transaction.transaction_id;
}
// Get network icon
function getNetworkIcon(network) {
    const icons = {
        'TRON': '🔷',
        'ETH': '⟠',
        'BSC': '🟡',
        'POLYGON': '🟣'
    };
    return icons[network] || '🔵';
}
// Get status icon
function getStatusIcon(status) {
    const icons = {
        'pending': '⏳',
        'approved': '✅',
        'completed': '✔️',
        'rejected': '❌',
        'expired': '⏱️'
    };
    return icons[status.toLowerCase()] || '📋';
}
// Truncate address
function truncateAddress(address) {
    if (!address) return '';
    if (address.length <= 15) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
// Format time
function formatTime(dateString) {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
}
// Filter transactions
function filterTransactions() {
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const networkFilter = document.getElementById('networkFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    filteredTransactions = allTransactions.filter(transaction => {
        // Type filter
        if (typeFilter !== 'all' && transaction.direction !== typeFilter) {
            return false;
        }
        // Status filter
        if (statusFilter !== 'all' && transaction.status.toLowerCase() !== statusFilter) {
            return false;
        }
        // Network filter
        if (networkFilter !== 'all' && transaction.network !== networkFilter) {
            return false;
        }
        // Date filter
        if (dateFilter !== 'all') {
            const transactionDate = new Date(transaction.created_at);
            const now = new Date();
            const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
            switch(dateFilter) {
                case 'today':
                    if (daysDiff > 0) return false;
                    break;
                case 'week':
                    if (daysDiff > 7) return false;
                    break;
                case 'month':
                    if (daysDiff > 30) return false;
                    break;
                case '3months':
                    if (daysDiff > 90) return false;
                    break;
            }
        }
        return true;
    });
    currentPage = 1;
    renderTransactions();
}
// Show empty state
function showEmptyState() {
    document.getElementById('transactionsTableBody').innerHTML = '';
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('paginationWrapper').style.display = 'none';
}
// Update pagination
function updatePagination(startIndex, endIndex, total) {
    const paginationWrapper = document.getElementById('paginationWrapper');
    if (total <= transactionsPerPage) {
        paginationWrapper.style.display = 'none';
        return;
    }
    paginationWrapper.style.display = 'flex';
    // Update range info
    document.getElementById('startRange').textContent = startIndex + 1;
    document.getElementById('endRange').textContent = endIndex;
    document.getElementById('totalCount').textContent = total;
    // Update buttons
    const totalPages = Math.ceil(total / transactionsPerPage);
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    // Update page numbers
    updatePageNumbers(totalPages);
}
// Update page numbers
function updatePageNumbers(totalPages) {
    // Simple pagination with 3 visible page numbers
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');
    // Remove active class from all
    [page1, page2, page3].forEach(btn => btn.classList.remove('active'));
    if (totalPages <= 3) {
        page1.style.display = 'inline-block';
        page2.style.display = totalPages >= 2 ? 'inline-block' : 'none';
        page3.style.display = totalPages >= 3 ? 'inline-block' : 'none';
        page1.textContent = '1';
        page2.textContent = '2';
        page3.textContent = '3';
        page1.onclick = () => goToPage(1);
        page2.onclick = () => goToPage(2);
        page3.onclick = () => goToPage(3);
        if (currentPage === 1) page1.classList.add('active');
        if (currentPage === 2) page2.classList.add('active');
        if (currentPage === 3) page3.classList.add('active');
    } else {
        // Show current page and adjacent pages
        let start, middle, end;
        if (currentPage === 1) {
            start = 1; middle = 2; end = 3;
        } else if (currentPage === totalPages) {
            start = totalPages - 2; middle = totalPages - 1; end = totalPages;
        } else {
            start = currentPage - 1; middle = currentPage; end = currentPage + 1;
        }
        page1.textContent = start;
        page2.textContent = middle;
        page3.textContent = end;
        page1.onclick = () => goToPage(start);
        page2.onclick = () => goToPage(middle);
        page3.onclick = () => goToPage(end);
        if (currentPage === start) page1.classList.add('active');
        if (currentPage === middle) page2.classList.add('active');
        if (currentPage === end) page3.classList.add('active');
    }
}
// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderTransactions();
}
// Previous page
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTransactions();
    }
}
// Next page
function nextPage() {
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTransactions();
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
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login';
}
// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.getElementById('profileDropdown');
    if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});
// Initialize page on load
// document.addEventListener('DOMContentLoaded', initializePage);