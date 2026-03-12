/* ============================================
   TIXXER FLIGHT — Shared Wallet Connection
   ============================================ */

async function connectWallet() {
  const btn = document.getElementById('walletBtn');
  if (!btn) return;

  if (btn.classList.contains('connected')) {
    btn.classList.remove('connected');
    btn.innerHTML = '<span class="wallet-icon">🦊</span><span>Connect Wallet</span>';
    return;
  }

  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install MetaMask to continue.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length > 0) {
      const short = accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
      btn.classList.add('connected');
      btn.innerHTML = `<span class="wallet-dot"></span><span>${short}</span>`;
      return accounts[0];
    }
  } catch (err) {
    console.error('Wallet connection failed:', err);
  }
  return null;
}
