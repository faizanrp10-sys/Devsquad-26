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

    // --- Page Navigation Logic ---
    const pageHome = document.getElementById('page-home');
    const pageProfile = document.getElementById('page-profile');
    const linkHome = document.getElementById('link-home');
    const linkProfileNav = document.getElementById('link-profile-nav');
    const btnGetStarted = document.getElementById('btn-get-started');

    /**
     * Switch between completely different pages
     * @param {string} page - 'home' or 'profile'
     */
    function navigateTo(page) {
        if (page === 'home') {
            if (pageProfile) pageProfile.classList.add('hidden');
            if (pageHome) pageHome.classList.remove('hidden');

            if (linkHome) {
                linkHome.classList.add('font-bold', 'text-amber-500');
                linkHome.classList.remove('text-slate-500');
            }
        } else if (page === 'profile') {
            if (pageHome) pageHome.classList.add('hidden');
            if (pageProfile) pageProfile.classList.remove('hidden');

            if (linkHome) {
                linkHome.classList.remove('font-bold', 'text-amber-500');
                linkHome.classList.add('text-slate-500');
            }

            // Set default tab when revisiting profile
            setActiveTab('profile');
        }
    }

    // Attach Event Listeners for Page Navigation
    if (linkHome) {
        linkHome.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('home');
        });
    }
    if (linkProfileNav) linkProfileNav.addEventListener('click', () => navigateTo('profile'));
    if (btnGetStarted) btnGetStarted.addEventListener('click', () => navigateTo('profile'));
});
