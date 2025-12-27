// Get transaction ID from URL
const pathParts = window.location.pathname.split('/');
const transactionId = pathParts[pathParts.length - 1];
let withdrawData = null;
let currentAction = null; // Track which action modal is confirming
async function loadWithdrawData() {
    try {
        const response = await fetch(`/api/withdraw/request/${transactionId}`, { credentials: 'include' });
        if (response.ok) {
            withdrawData = await response.json();
            updateDisplay();
        } else {
            alert('Failed to load withdrawal request');
        }
    } catch (error) {
        console.error('Error loading withdrawal data:', error);
        alert('Failed to load withdrawal request');
    }
}
/** ---------------- MODAL SYSTEM ---------------- **/
function openModal(action) {
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
    document.getElementById('modalActions').style.display = 'flex';
    document.getElementById('modalOkOnly').style.display = 'none';
    currentAction = action;
    if (action === 'confirm') {
        title.textContent = 'Confirm Withdraw Request';
        text.textContent = 'Please confirm this withdrawal. Once approved, this action cannot be reversed.';
    } else if (action === 'cancel') {
        title.textContent = 'Cancel Withdraw Request';
        text.textContent = 'Are you sure you want to cancel this withdrawal? Your funds will be returned to your available balance.';
    }
    overlay.style.display = 'flex';
}
function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    currentAction = null;
}
function showModalMessage(title, text, callback = null) {
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    document.getElementById('modalActions').style.display = 'none';
    document.getElementById('modalOkOnly').style.display = 'flex';
    overlay.style.display = 'flex';
    const okBtn = document.getElementById('modalOkBtn');
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    newOkBtn.addEventListener('click', () => {
        closeModal();
        if (callback) callback();
    });
}
document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
});
document.getElementById('modalConfirmBtn').addEventListener('click', async () => {
    if (currentAction === 'confirm') {
        await approveWithdraw();
    } else if (currentAction === 'cancel') {
        await cancelWithdraw();
    }
});
/** ---------------- DISPLAY UPDATE ---------------- **/
function updateDisplay() {
    if (!withdrawData) return;
    document.getElementById('withdrawAmount').textContent = `${withdrawData.withdraw_data.amount.toFixed(2)}`;
    document.getElementById('networkName').textContent = withdrawData.withdraw_data.network || 'N/A';
    document.getElementById('destinationAddress').textContent = withdrawData.withdraw_data.address;
    document.getElementById('transactionId').textContent = transactionId;
    if (withdrawData.withdraw_data.created_at) {
        const createdDate = new Date(withdrawData.withdraw_data.created_at);
        document.getElementById('createdTime').textContent = createdDate.toLocaleString();
    }
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    const approveBtn = document.getElementById('approveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const messageBox = document.getElementById('messageBox');
    statusDot.className = 'status-dot';
    statusText.className = 'status-text';
    const steps = ['step1', 'step2', 'step3', 'step4'];
    steps.forEach(step => document.getElementById(step).className = 'timeline-item');
    switch (withdrawData.withdraw_data.status) {
        case 'withdraw_request_created':
            statusText.textContent = 'Pending Approval';
            statusText.classList.add('pending');
            statusDot.classList.add('pending');
            document.getElementById('step1').classList.add('completed');
            document.getElementById('step2').classList.add('active');
            document.getElementById('step1Time').textContent = 'Completed';
            document.getElementById('step2Time').textContent = 'Current';
            break;
        case 'withdraw_approved_by_user':
            statusText.textContent = 'Waiting for system';
            statusText.classList.add('pending');
            statusDot.classList.add('pending');
            document.getElementById('step1').classList.add('completed');
            document.getElementById('step2').classList.add('active');
            document.getElementById('step1Time').textContent = 'Completed';
            document.getElementById('step2Time').textContent = 'Current';
            approveBtn.disabled = true;
            break;
        case 'withdraw_request_processing':
            statusText.textContent = 'Processing';
            statusText.classList.add('processing');
            statusDot.classList.add('processing');
            document.getElementById('step1').classList.add('completed');
            document.getElementById('step2').classList.add('completed');
            document.getElementById('step3').classList.add('active');
            document.getElementById('step1Time').textContent = 'Completed';
            document.getElementById('step2Time').textContent = 'Completed';
            document.getElementById('step3Time').textContent = 'Current';
            approveBtn.disabled = true;
            cancelBtn.disabled = true;
            approveBtn.textContent = 'Processing...';
            messageBox.innerHTML = `
                <div class="warning-box">
                    <div class="warning-title">⏳ Processing Withdrawal</div>
                    <div class="warning-content">
                        Your withdrawal is being processed. This typically takes 15-60 minutes depending on network congestion.
                    </div>
                </div>`;
            break;
        case 'withdraw_completed':
            statusText.textContent = 'Completed';
            statusText.classList.add('completed');
            statusDot.classList.add('completed');
            steps.forEach(step => {
                document.getElementById(step).classList.add('completed');
                document.getElementById(step + 'Time').textContent = 'Completed';
            });
            approveBtn.disabled = true;
            cancelBtn.disabled = true;
            approveBtn.textContent = 'Completed';
            messageBox.innerHTML = `
                <div class="success-box">
                    <div class="success-title">✅ Withdrawal Complete</div>
                    <div class="success-content">
                        Your withdrawal has been successfully processed and sent to the specified address.
                    </div>
                </div>`;
            break;
        case 'withdraw_request_declined_by_user':
            statusText.textContent = 'Cancelled';
            statusText.classList.add('cancelled');
            statusDot.classList.add('cancelled');
            approveBtn.disabled = true;
            cancelBtn.disabled = true;
            messageBox.innerHTML = `
                <div class="warning-box">
                    <div class="warning-title">Request Cancelled</div>
                    <div class="warning-content">
                        This withdrawal request has been cancelled. Your funds have been returned to your available balance.
                    </div>
                </div>`;
            break;
    }
}
/** ---------------- ACTIONS ---------------- **/
async function approveWithdraw() {
    const btn = document.getElementById('approveBtn');
    btn.disabled = true;
    btn.textContent = 'Approving...';
    try {
        const response = await fetch(`/api/withdraw/approve_by_user/${transactionId}`, {
            method: 'POST',
            credentials: 'include'
        });
        closeModal();
        if (response.ok) {
            showModalMessage('Success', 'Withdrawal approved! Waiting till system gonna process it.');
            loadWithdrawData();
        } else {
            const error = await response.json();
            showModalMessage('Error', `Error: ${error.detail}`);
            btn.disabled = false;
            btn.textContent = 'Confirm Withdrawal';
        }
    } catch (error) {
        closeModal();
        showModalMessage('Error', 'Failed to approve withdrawal. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Confirm Withdrawal';
    }
}
async function cancelWithdraw() {
    const btn = document.getElementById('cancelBtn');
    btn.disabled = true;
    btn.textContent = 'Cancelling...';
    try {
        const response = await fetch(`/api/withdraw/decline_by_user/${transactionId}`, {
            method: 'POST',
            credentials: 'include'
        });
        closeModal();
        if (response.ok) {
            showModalMessage('Success', 'Withdrawal cancelled. Funds returned to your balance.', () => {
                window.location.href = '/dashboard';
            });
        } else {
            const error = await response.json();
            showModalMessage('Error', `Error: ${error.detail}`);
            btn.disabled = false;
            btn.textContent = 'Cancel Request';
        }
    } catch (error) {
        closeModal();
        showModalMessage('Error', 'Failed to cancel withdrawal. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Cancel Request';
    }
}
/** ---------------- AUTO REFRESH ---------------- **/
function checkStatus() {
    if (withdrawData &&
        withdrawData.status !== 'withdraw_completed' &&
        withdrawData.status !== 'withdraw_request_declined_by_user') {
        loadWithdrawData();
    }
}
// window.addEventListener('load', () => {
//     loadWithdrawData();
//     setInterval(checkStatus, 30000);
// });