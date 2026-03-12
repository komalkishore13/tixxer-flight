/* ============================================
   TIXXER FLIGHT — Payment Page JS
   MetaMask Integration (Sepolia Testnet)
   ============================================ */

// Constants
const SEPOLIA_CHAIN_ID = '0xaa36a7';
const RECEIVER_ADDRESS = '0x000000000000000000000000000000000000dEaD';

// State
let booking = null;
let walletAddress = null;
let paymentState = 'idle';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('bookingData');

  if (!stored) {
    window.location.href = '../index/index.html';
    return;
  }

  booking = JSON.parse(stored);
  renderSidebar();
});

// Render Sidebar Summary
function renderSidebar() {
  renderPaymentSidebar(booking, 'summaryFlight');
  renderPriceRows(booking.pricing, 'summaryRows');

  document.getElementById('summaryTotal').textContent = `₹${booking.pricing.total.toLocaleString('en-IN')}`;
  document.getElementById('summaryEth').textContent = `≈ ${booking.pricing.totalETH} ETH`;
}

// Step 1: Connect Wallet
async function handleConnectWallet() {
  const btn = document.getElementById('btnConnect');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-fox">🦊</span> Connecting...';

  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed!\n\nPlease install MetaMask browser extension to continue.\nhttps://metamask.io');
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-fox">🦊</span> Connect MetaMask';
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    walletAddress = accounts[0];
    await switchToSepolia();

    const balanceHex = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest'],
    });
    const balanceWei = parseInt(balanceHex, 16);
    const balanceEth = (balanceWei / 1e18).toFixed(4);

    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const networkName = chainIdHex === SEPOLIA_CHAIN_ID ? 'Sepolia Testnet' : `Chain ${parseInt(chainIdHex, 16)}`;

    document.getElementById('walletPrompt').style.display = 'none';
    document.getElementById('walletConnected').style.display = 'block';
    document.getElementById('walletAddress').textContent = walletAddress;
    document.getElementById('walletNetwork').textContent = networkName;
    document.getElementById('walletBalance').textContent = `${balanceEth} ETH`;

    document.querySelector('#stepConnect .pay-step-num').classList.remove('active');
    document.querySelector('#stepConnect .pay-step-num').classList.add('done');
    document.querySelector('#stepConnect .pay-step-num').textContent = '✓';

    unlockPaymentStep();

  } catch (err) {
    console.error('Wallet connection failed:', err);
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-fox">🦊</span> Connect MetaMask';

    if (err.code === 4001) {
      alert('Connection rejected. Please approve the MetaMask connection to proceed.');
    } else {
      alert('Failed to connect wallet. Please try again.');
    }
  }
}

// Switch to Sepolia
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_CHAIN_ID,
          chainName: 'Sepolia Testnet',
          nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://rpc.sepolia.org'],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        }],
      });
    }
  }
}

// Unlock Step 2
function unlockPaymentStep() {
  const p = booking.pricing;

  document.getElementById('payStepNum').classList.add('active');
  document.getElementById('payLocked').style.display = 'none';
  document.getElementById('payReady').style.display = 'block';

  document.getElementById('payAmountEth').textContent = `${p.totalETH} ETH`;
  document.getElementById('payAmountFiat').textContent = `≈ ₹${p.total.toLocaleString('en-IN')}`;
}

// Step 2: Process Payment
async function handlePayment() {
  if (paymentState === 'processing') return;
  paymentState = 'processing';

  const btn = document.getElementById('btnPayNow');
  btn.disabled = true;

  document.getElementById('payReady').style.display = 'none';
  document.getElementById('payProcessing').style.display = 'block';

  animateProgress();

  try {
    const amountEth = booking.pricing.totalETH;
    const amountWei = '0x' + Math.floor(parseFloat(amountEth) * 1e18).toString(16);

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: walletAddress,
        to: RECEIVER_ADDRESS,
        value: amountWei,
        gas: '0x5208',
      }],
    });

    await delay(2000);

    const bookingId = 'TXF-' + Date.now().toString(36).toUpperCase();
    sessionStorage.setItem('paymentResult', JSON.stringify({
      txHash,
      bookingId,
      walletAddress,
      amountETH: amountEth,
      timestamp: new Date().toISOString(),
    }));

    showSuccess(txHash);

  } catch (err) {
    console.error('Payment failed:', err);
    showError(err);
  }
}

// Progress Animation
function animateProgress() {
  const bar = document.getElementById('processingBar');
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 90) {
      clearInterval(interval);
      return;
    }
    width += Math.random() * 15;
    if (width > 90) width = 90;
    bar.style.width = width + '%';
  }, 400);

  window._progressInterval = interval;
}

// Show Success
function showSuccess(txHash) {
  clearInterval(window._progressInterval);
  document.getElementById('processingBar').style.width = '100%';

  setTimeout(() => {
    paymentState = 'success';

    document.getElementById('payProcessing').style.display = 'none';
    document.getElementById('paySuccess').style.display = 'block';
    document.getElementById('txHashDisplay').textContent = txHash;

    document.getElementById('payStepNum').classList.remove('active');
    document.getElementById('payStepNum').classList.add('done');
    document.getElementById('payStepNum').textContent = '✓';

    let count = 5;
    const countdownEl = document.getElementById('countdown');
    const timer = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(timer);
        window.location.href = '../ticket-confirmation/ticket-confirmation.html';
      }
    }, 1000);
  }, 600);
}

// Show Error
function showError(err) {
  paymentState = 'error';
  clearInterval(window._progressInterval);

  document.getElementById('payProcessing').style.display = 'none';
  document.getElementById('payError').style.display = 'block';

  let msg = 'Transaction was rejected or failed.';
  if (err.code === 4001) {
    msg = 'You rejected the transaction in MetaMask.';
  } else if (err.code === -32603) {
    msg = 'Insufficient funds. Please get Sepolia test ETH from a faucet.';
  } else if (err.message) {
    msg = err.message;
  }
  document.getElementById('errorMsg').textContent = msg;
}

// Reset Payment (Retry)
function resetPayment() {
  paymentState = 'idle';

  document.getElementById('payError').style.display = 'none';
  document.getElementById('payReady').style.display = 'block';
  document.getElementById('processingBar').style.width = '0%';
  document.getElementById('btnPayNow').disabled = false;
}
