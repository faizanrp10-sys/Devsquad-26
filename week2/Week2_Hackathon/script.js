document.addEventListener('DOMContentLoaded', () => {
    // Select tab buttons
    const tabActivity = document.getElementById('tab-activity');
    const tabProfile = document.getElementById('tab-profile');

    // Select content areas
    const contentActivity = document.getElementById('content-activity');
    const contentProfile = document.getElementById('content-profile');

    /**
     * Switch currently active tab and toggle content visibility with animations
     * @param {string} tabName - 'activity' or 'profile'
     */
    function setActiveTab(tabName) {
        if (tabName === 'activity') {
            // Style Activity tab as Active
            tabActivity.classList.add('font-bold', 'text-slate-900', 'border-b-2', 'border-amber-500');
            tabActivity.classList.remove('font-medium', 'text-slate-500');

            // Style Profile tab as Inactive
            tabProfile.classList.remove('font-bold', 'text-slate-900', 'border-b-2', 'border-amber-500');
            tabProfile.classList.add('font-medium', 'text-slate-500');

            // Hide Profile Activity, Show Activity Content with smooth transition
            contentProfile.classList.remove('opacity-100', 'translate-y-0');
            contentProfile.classList.add('opacity-0', 'translate-y-2');

            setTimeout(() => {
                contentProfile.classList.add('hidden');
                contentActivity.classList.remove('hidden');

                // Allow display: block to apply before animating opacity
                setTimeout(() => {
                    contentActivity.classList.remove('opacity-0', 'translate-y-2');
                    contentActivity.classList.add('opacity-100', 'translate-y-0');
                }, 10);
            }, 300);

        } else if (tabName === 'profile') {
            // Style Profile tab as Active
            tabProfile.classList.add('font-bold', 'text-slate-900', 'border-b-2', 'border-amber-500');
            tabProfile.classList.remove('font-medium', 'text-slate-500');

            // Style Activity tab as Inactive
            tabActivity.classList.remove('font-bold', 'text-slate-900', 'border-b-2', 'border-amber-500');
            tabActivity.classList.add('font-medium', 'text-slate-500');

            // Hide Activity Content, Show Profile Activity
            contentActivity.classList.remove('opacity-100', 'translate-y-0');
            contentActivity.classList.add('opacity-0', 'translate-y-2');

            setTimeout(() => {
                contentActivity.classList.add('hidden');
                contentProfile.classList.remove('hidden');

                setTimeout(() => {
                    contentProfile.classList.remove('opacity-0', 'translate-y-2');
                    contentProfile.classList.add('opacity-100', 'translate-y-0');
                }, 10);
            }, 300);
        }
    }

    // Attach Event Listeners
    if (tabActivity) tabActivity.addEventListener('click', () => setActiveTab('activity'));
    if (tabProfile) tabProfile.addEventListener('click', () => setActiveTab('profile'));

    // --- Page Navigation and Auth Logic ---
    const pageHome = document.getElementById('page-home');
    const pageProfile = document.getElementById('page-profile');
    const pageLogin = document.getElementById('page-login');
    const pageSignup = document.getElementById('page-signup');

    const linkHome = document.getElementById('link-home');
    const linkProfileNav = document.getElementById('link-profile-nav');
    const btnGetStarted = document.getElementById('btn-get-started');

    // Auth UI Elements
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const linkLoginNav = document.getElementById('link-login-nav');
    const linkSignupNav = document.getElementById('link-signup-nav');
    const btnLogout = document.getElementById('btn-logout');
    const linkToSignup = document.getElementById('link-to-signup');
    const linkToLogin = document.getElementById('link-to-login');

    // Forms
    const formSignup = document.getElementById('form-signup');
    const formLogin = document.getElementById('form-login');

    // State
    let currentUser = JSON.parse(localStorage.getItem('quiz_current_user')) || null;

    /**
     * Switch between completely different pages
     * @param {string} page - 'home', 'profile', 'login', 'signup'
     */
    function navigateTo(page) {
        // Hide all pages first
        if (pageHome) pageHome.classList.add('hidden');
        if (pageProfile) pageProfile.classList.add('hidden');
        if (pageLogin) pageLogin.classList.add('hidden');
        if (pageSignup) pageSignup.classList.add('hidden');

        // Reset home link style
        if (linkHome) {
            linkHome.classList.remove('font-bold', 'text-amber-500');
            linkHome.classList.add('text-slate-500');
        }

        if (page === 'home') {
            if (pageHome) pageHome.classList.remove('hidden');
            if (linkHome) {
                linkHome.classList.add('font-bold', 'text-amber-500');
                linkHome.classList.remove('text-slate-500');
            }
        } else if (page === 'profile') {
            if (pageProfile) pageProfile.classList.remove('hidden');
            setActiveTab('profile');
        } else if (page === 'login') {
            if (pageLogin) pageLogin.classList.remove('hidden');
        } else if (page === 'signup') {
            if (pageSignup) pageSignup.classList.remove('hidden');
        }
    }

    /**
     * Update Navigation UI based on auth state
     */
    function updateAuthUI() {
        if (currentUser) {
            if (navGuest) navGuest.classList.add('hidden');
            if (navUser) navUser.classList.remove('hidden');
            if (navUser) navUser.classList.add('flex');
            // update profile text or handle
        } else {
            if (navGuest) navGuest.classList.remove('hidden');
            if (navGuest) navGuest.classList.add('flex');
            if (navUser) navUser.classList.add('hidden');
            if (navUser) navUser.classList.remove('flex');
        }
    }

    // Attach Event Listeners for Page Navigation
    if (linkHome) {
        linkHome.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('home');
        });
    }

    if (linkProfileNav) linkProfileNav.addEventListener('click', () => {
        if (currentUser) {
            navigateTo('profile');
        } else {
            navigateTo('login');
        }
    });

    if (btnGetStarted) btnGetStarted.addEventListener('click', () => {
        if (currentUser) {
            navigateTo('profile');
        } else {
            navigateTo('signup');
        }
    });

    if (linkLoginNav) linkLoginNav.addEventListener('click', () => navigateTo('login'));
    if (linkSignupNav) linkSignupNav.addEventListener('click', () => navigateTo('signup'));
    if (linkToSignup) {
        linkToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('signup');
        });
    }
    if (linkToLogin) {
        linkToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('login');
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('quiz_current_user');
            updateAuthUI();
            navigateTo('home');
        });
    }

    // --- FORM LOGIC ---

    // Signup Form
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const pass = document.getElementById('signup-password').value;
            const confirmPass = document.getElementById('signup-confirm-password').value;
            const errorEl = document.getElementById('signup-error');
            const successEl = document.getElementById('signup-success');

            errorEl.classList.add('hidden');
            successEl.classList.add('hidden');

            if (pass !== confirmPass) {
                errorEl.textContent = 'Passwords do not match.';
                errorEl.classList.remove('hidden');
                return;
            }

            let users = JSON.parse(localStorage.getItem('quiz_users')) || [];
            if (users.find(u => u.email === email)) {
                errorEl.textContent = 'Email already exists.';
                errorEl.classList.remove('hidden');
                return;
            }

            users.push({ name, email, password: pass });
            localStorage.setItem('quiz_users', JSON.stringify(users));

            successEl.classList.remove('hidden');
            setTimeout(() => {
                successEl.classList.add('hidden');
                formSignup.reset();
                navigateTo('login');
            }, 1500);
        });
    }

    // Login Form
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');

            errorEl.classList.add('hidden');

            let users = JSON.parse(localStorage.getItem('quiz_users')) || [];
            const user = users.find(u => u.email === email && u.password === pass);

            if (user) {
                // Success
                currentUser = user;
                localStorage.setItem('quiz_current_user', JSON.stringify(user));
                updateAuthUI();
                formLogin.reset();
                navigateTo('profile');
            } else {
                errorEl.textContent = 'Invalid email or password.';
                errorEl.classList.remove('hidden');
            }
        });
    }

    // Initialize UI on load
    updateAuthUI();
});
