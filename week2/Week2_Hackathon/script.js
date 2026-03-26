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
    const pageSelectQuiz = document.getElementById('page-select-quiz');
    const pageQuizMcqs = document.getElementById('page-quiz-mcqs');
    const pageQuizResult = document.getElementById('page-quiz-result');
    const pageReviewAnswers = document.getElementById('page-review-answers');

    const linkHome = document.getElementById('link-home');
    const linkQuizzesNav = document.getElementById('link-quizzes-nav');
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
        if (pageSelectQuiz) pageSelectQuiz.classList.add('hidden');
        if (pageQuizMcqs) pageQuizMcqs.classList.add('hidden');
        if (pageQuizResult) pageQuizResult.classList.add('hidden');
        if (pageReviewAnswers) pageReviewAnswers.classList.add('hidden');

        // Reset home link style
        if (linkHome) {
            linkHome.classList.remove('font-bold', 'text-amber-500');
            linkHome.classList.add('text-slate-500');
        }

        const logoIcon = document.getElementById('nav-logo-icon');
        const logoText = document.getElementById('nav-logo-text');
        const searchBar = document.getElementById('nav-search-bar');

        if (logoIcon && logoText) {
            if (page === 'home' || page === 'profile' || page === 'select-quiz') {
                logoIcon.classList.remove('hidden');
                logoText.textContent = 'QuizMaster';
            } else {
                logoIcon.classList.add('hidden');
                logoText.textContent = 'Quiz App';
            }
        }

        if (searchBar) {
            if (page === 'select-quiz') {
                searchBar.classList.remove('hidden');
                searchBar.classList.add('flex');
            } else {
                searchBar.classList.add('hidden');
                searchBar.classList.remove('flex');
            }
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
        } else if (page === 'select-quiz') {
            if (pageSelectQuiz) pageSelectQuiz.classList.remove('hidden');
            if (typeof renderSelectQuiz === 'function') renderSelectQuiz(); // Initialize the quiz list
        } else if (page === 'quiz-mcqs') {
            if (pageQuizMcqs) pageQuizMcqs.classList.remove('hidden');
        } else if (page === 'quiz-result') {
            if (pageQuizResult) pageQuizResult.classList.remove('hidden');
        } else if (page === 'review-answers') {
            if (pageReviewAnswers) pageReviewAnswers.classList.remove('hidden');
        }
    }

    /**
     * Update Navigation UI based on auth state
     */
    function updateAuthUI() {
        if (currentUser) {
            if (navGuest) {
                navGuest.classList.add('hidden');
                navGuest.classList.remove('flex');
            }
            if (navUser) {
                navUser.classList.remove('hidden');
                navUser.classList.add('flex');
            }

            // Update profile page details
            const nameHeader = document.getElementById('profile-display-name-header');
            const nameVal = document.getElementById('profile-display-name');
            const emailVal = document.getElementById('profile-display-email');

            if (nameHeader) nameHeader.textContent = currentUser.name;
            if (nameVal) nameVal.textContent = currentUser.name;
            if (emailVal) emailVal.textContent = currentUser.email;
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

    if (linkQuizzesNav) {
        linkQuizzesNav.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                navigateTo('select-quiz');
            } else {
                navigateTo('login');
            }
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

    // --- QUIZ DATA ---
    let quizData = JSON.parse(localStorage.getItem('quiz_data'));
    if (!quizData) {
        quizData = [
        {
            id: 'quiz-science',
            title: 'Science',
            category: 'Science',
            description: 'Explore the wonders of science from biology to physics.',
            questions: [
                { q: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Saturn', 'Mars'], answer: 3 },
                { q: 'What is the chemical symbol for water?', options: ['CO2', 'H2O', 'O2', 'NaCl'], answer: 1 },
                { q: 'Which organ pumps blood?', options: ['Lung', 'Brain', 'Heart', 'Liver'], answer: 2 },
                { q: 'At what temperature does water freeze?', options: ['100°C', '32°C', '0°C', '-10°C'], answer: 2 },
                { q: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2 },
                { q: 'Which is the nearest star to Earth?', options: ['Sirius', 'Alpha Centauri', 'Proxima Centauri', 'The Sun'], answer: 3 },
                { q: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 2 },
                { q: 'Who proposed the theory of relativity?', options: ['Isaac Newton', 'Galileo', 'Albert Einstein', 'Stephen Hawking'], answer: 2 },
                { q: 'What is the largest living primate?', options: ['Chimpanzee', 'Orangutan', 'Gorilla', 'Baboon'], answer: 2 },
                { q: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Dioxin natural acid', 'Data Node Array', 'Deoxyribose Neutral Acid'], answer: 0 }
            ]
        },
        {
            id: 'quiz-history',
            title: 'History',
            category: 'History',
            description: 'Journey through time and learn about historical events.',
            questions: [
                { q: 'Who discovered America in 1492?', options: ['Magellan', 'Columbus', 'Vespucci', 'Cook'], answer: 1 },
                { q: 'Which empire built the Colosseum?', options: ['Greek', 'Ottoman', 'Roman', 'Persian'], answer: 2 },
                { q: 'In which year did World War II end?', options: ['1942', '1945', '1950', '1939'], answer: 1 },
                { q: 'Who was the first President of the USA?', options: ['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams'], answer: 2 },
                { q: 'What ancient civilization built the Pyramids?', options: ['Romans', 'Aztecs', 'Mayans', 'Egyptians'], answer: 3 },
                { q: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'], answer: 2 },
                { q: 'Which country gifted the Statue of Liberty to the USA?', options: ['England', 'Spain', 'France', 'Italy'], answer: 2 },
                { q: 'What was the name of the ship that sank in 1912?', options: ['Lusitania', 'Titanic', 'Britannic', 'Olympic'], answer: 1 },
                { q: 'Who was the famous Queen of Ancient Egypt?', options: ['Nefertiti', 'Hatshepsut', 'Cleopatra', 'Boudicca'], answer: 2 },
                { q: 'Where was the first atomic bomb dropped?', options: ['Tokyo', 'Nagasaki', 'Hiroshima', 'Kyoto'], answer: 2 }
            ]
        },
        {
            id: 'quiz-lit',
            title: 'Literature',
            category: 'Literature',
            description: 'Discover the world of books and authors.',
            questions: [
                { q: 'Who wrote Romeo and Juliet?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], answer: 1 },
                { q: 'What is the name of the boy wizard in J.K. Rowling\'s series?', options: ['Ron Weasley', 'Neville Longbottom', 'Harry Potter', 'Draco Malfoy'], answer: 2 },
                { q: 'Who wrote 1984?', options: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], answer: 1 },
                { q: 'In Moby-Dick, what type of animal is Moby Dick?', options: ['Shark', 'Octopus', 'Whale', 'Dolphin'], answer: 2 },
                { q: 'What pen name did Samuel Langhorne Clemens use?', options: ['Dr. Seuss', 'George Orwell', 'Mark Twain', 'Lewis Carroll'], answer: 2 },
                { q: 'Who wrote Pride and Prejudice?', options: ['Emily Brontë', 'Charlotte Brontë', 'Jane Austen', 'Mary Shelley'], answer: 2 },
                { q: 'What is the first book of the Lord of the Rings series?', options: ['The Two Towers', 'The Return of the King', 'The Hobbit', 'The Fellowship of the Ring'], answer: 3 },
                { q: 'Who is the author of The Great Gatsby?', options: ['F. Scott Fitzgerald', 'Ernest Hemingway', 'John Steinbeck', 'J.D. Salinger'], answer: 0 },
                { q: 'In Alice’s Adventures in Wonderland, who is always late?', options: ['Mad Hatter', 'White Rabbit', 'Cheshire Cat', 'March Hare'], answer: 1 },
                { q: 'Which detective resides at 221B Baker Street?', options: ['Hercule Poirot', 'Miss Marple', 'Sherlock Holmes', 'Philip Marlowe'], answer: 2 }
            ]
        },
        {
            id: 'quiz-math',
            title: 'Mathematics',
            category: 'Mathematics',
            description: 'Challenge your math skills with various problems.',
            questions: [
                { q: 'What is 15% of 200?', options: ['20', '30', '40', '50'], answer: 1 },
                { q: 'What is the square root of 144?', options: ['10', '12', '14', '16'], answer: 1 },
                { q: 'If x = 5, what is 3x + 2?', options: ['15', '17', '20', '25'], answer: 1 },
                { q: 'What is the value of Pi to two decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], answer: 1 },
                { q: 'How many degrees are in a circle?', options: ['180', '270', '360', '400'], answer: 2 },
                { q: 'What is 8 times 7?', options: ['54', '56', '62', '64'], answer: 1 },
                { q: 'What is the area of a rectangle with length 5 and width 4?', options: ['9', '18', '20', '40'], answer: 2 },
                { q: 'If a triangle has an angle of 90 degrees, what type is it?', options: ['Acute', 'Obtuse', 'Right', 'Equilateral'], answer: 2 },
                { q: 'What is 100 divided by 4?', options: ['20', '22', '24', '25'], answer: 3 },
                { q: 'What comes next in the sequence: 2, 4, 8, 16, ?', options: ['24', '32', '64', '128'], answer: 1 }
            ]
        },
        {
            id: 'quiz-general',
            title: 'General Knowledge',
            category: 'General',
            description: 'Test your overall knowledge with a mix of questions.',
            questions: [
                { q: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Rome'], answer: 1 },
                { q: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
                { q: 'Which is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
                { q: 'What language has the most native speakers?', options: ['English', 'Spanish', 'Mandarin', 'Hindi'], answer: 2 },
                { q: 'Which planet is closest to the sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], answer: 1 },
                { q: 'How many bones are in the adult human body?', options: ['206', '208', '210', '212'], answer: 0 },
                { q: 'What is the tallest mammal?', options: ['Elephant', 'Giraffe', 'Camel', 'Horse'], answer: 1 },
                { q: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Ringgit'], answer: 2 },
                { q: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1 },
                { q: 'Who is known as the father of computers?', options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'], answer: 1 }
            ]
        }
    ];
        localStorage.setItem('quiz_data', JSON.stringify(quizData));
    }

    // --- QUIZ STATE ---
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = []; // Array of selected option indices
    let quizInterval = null;
    let timeRemaining = 0; // In seconds (e.g. 10 mins = 600)

    // --- QUIZ LOGIC AND RENDERING ---

    window.renderSelectQuiz = function () {
        const categoriesContainer = document.getElementById('quiz-categories');
        const listContainer = document.getElementById('quiz-list');

        if (!categoriesContainer || !listContainer) return;

        // Ensure we display exactly: 'All', 'Science', 'History', 'Literature', 'Mathematics'
        const categories = ['All', 'Science', 'History', 'Literature', 'Mathematics'];

        // Render category tabs (Minimalist)
        categoriesContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn px-4 py-1.5 rounded text-[13px] font-medium transition-colors ${cat === 'All' ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        // Function to render quizzes based on category
        const renderQuizzes = (filterCat) => {
            const filteredQuizzes = filterCat === 'All' ? quizData : quizData.filter(q => q.category === filterCat);

            // Featured block matching exactly the screenshot
            const featuredHtml = filterCat === 'All' ? `
                <div class="mb-14">
                    <h2 class="text-[18px] font-semibold text-slate-900 mb-6">Featured Quizzes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Card 1 -->
                        <div class="quiz-card cursor-pointer group" data-id="quiz-science">
                            <div class="w-full h-36 rounded-xl mb-4 bg-orange-100/50 overflow-hidden relative">
                                <!-- Simulated abstract shape -->
                                <div class="absolute inset-0 m-auto w-24 h-24 bg-[#E0BA9B] rounded-full blur-[2px] right-0 translate-x-1/4 scale-150"></div>
                            </div>
                            <h3 class="text-[15px] font-medium text-slate-900 mb-1">The Universe</h3>
                            <p class="text-slate-500 text-[13px] leading-relaxed">Test your knowledge about the cosmos.</p>
                        </div>
                        <!-- Card 2 -->
                        <div class="quiz-card cursor-pointer group" data-id="quiz-history">
                            <div class="w-full h-36 rounded-xl mb-4 bg-stone-50 border border-slate-100 overflow-hidden relative">
                                <div class="absolute h-full w-20 bg-[#DFD1BD] left-12 rotate-12 blur-[1px]"></div>
                            </div>
                            <h3 class="text-[15px] font-medium text-slate-900 mb-1">Ancient Civilizations</h3>
                            <p class="text-slate-500 text-[13px] leading-relaxed">Explore the mysteries of ancient cultures.</p>
                        </div>
                        <!-- Card 3 -->
                        <div class="quiz-card cursor-pointer group" data-id="quiz-lit">
                            <div class="w-full h-36 rounded-xl mb-4 bg-amber-50 overflow-hidden relative border border-slate-100">
                                <div class="absolute inset-0 m-auto w-20 h-28 bg-[#DBB88D] rounded-t-full rotate-45 blur-[2px]"></div>
                            </div>
                            <h3 class="text-[15px] font-medium text-slate-900 mb-1">Shakespearean Plays</h3>
                            <p class="text-slate-500 text-[13px] leading-relaxed">Dive into the world of the Bard.</p>
                        </div>
                    </div>
                </div>
            ` : '';

            // All Quizzes format matches screenshot precisely
            const colors = ['bg-[#DEBA9F]', 'bg-[#EBDDC1]', 'bg-[#E6DAC5]', 'bg-[#E3E0D8]', 'bg-[#F1DECF]'];

            listContainer.innerHTML = featuredHtml + `
                <div>
                    <h2 class="text-[18px] font-semibold text-slate-900 mb-6">${filterCat === 'All' ? 'All Quizzes' : filterCat + ' Quizzes'}</h2>
                    <div class="space-y-12">
                        ${filteredQuizzes.map((quiz, i) => `
                            <div class="quiz-card cursor-pointer group flex gap-8 items-center justify-between" data-id="${quiz.id}">
                                <div class="flex-1 max-w-[350px]">
                                    <h3 class="text-[15px] font-bold text-slate-900 mb-2">${quiz.title}</h3>
                                    <p class="text-slate-500 text-[13px] leading-relaxed">${quiz.description}</p>
                                </div>
                                <div class="w-[260px] h-[140px] rounded-xl flex items-center justify-center bg-stone-50/50 flex-shrink-0 relative overflow-hidden">
                                     <!-- Decorative abstract shapes based on index to vary them -->
                                     <div class="absolute w-28 h-28 rounded-full ${colors[i % colors.length]} ${i % 2 === 0 ? 'right-4' : 'left-8 scale-150'} blur-[1px]"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Attach start events
            document.querySelectorAll('.quiz-card').forEach(card => {
                card.addEventListener('click', () => {
                    const quizId = card.getAttribute('data-id');
                    startQuiz(quizId);
                });
            });
        };

        // Render All initially
        renderQuizzes('All');

        // Attach category filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active tab styling
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('bg-slate-200', 'text-slate-900');
                    b.classList.add('bg-slate-100', 'text-slate-600');
                });
                e.target.classList.remove('bg-slate-100', 'text-slate-600');
                e.target.classList.add('bg-slate-200', 'text-slate-900');

                // Re-render
                renderQuizzes(e.target.getAttribute('data-category'));
            });
        });
    };

    function startQuiz(quizId) {
        currentQuiz = quizData.find(q => q.id === quizId);
        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuiz.questions.length).fill(null);
        timeRemaining = 600; // 10 minutes (600 seconds)

        navigateTo('quiz-mcqs');
        renderQuestion();
        startTimer();
    }

    function renderQuestion() {
        if (!currentQuiz) return;

        const question = currentQuiz.questions[currentQuestionIndex];
        const progressText = document.getElementById('quiz-progress-text');
        const progressBar = document.getElementById('quiz-progress-bar');
        const questionText = document.getElementById('quiz-question-text');
        const optionsContainer = document.getElementById('quiz-options-container');
        const btnPrev = document.getElementById('btn-quiz-prev');
        const btnNext = document.getElementById('btn-quiz-next');
        const btnSubmit = document.getElementById('btn-quiz-submit');

        // Update progress
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
        const progressPercent = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update Text
        questionText.textContent = question.q;

        // Update Options
        optionsContainer.innerHTML = question.options.map((opt, idx) => {
            const isSelected = userAnswers[currentQuestionIndex] === idx;
            return `
                <div class="option-btn p-4 rounded-lg border transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'border-slate-800 text-slate-900' : 'border-slate-100 text-slate-600 hover:border-slate-300'}" data-index="${idx}">
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-slate-800' : 'border-slate-300'}">
                        ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-slate-900"></div>' : ''}
                    </div>
                    <span class="text-[15px] font-normal">${opt}</span>
                </div>
            `;
        }).join('');

        // Attach option select events
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                userAnswers[currentQuestionIndex] = idx;
                renderQuestion(); // Re-render to show selection
            });
        });

        // Navigation visibility
        if (currentQuestionIndex === 0) {
            btnPrev.classList.add('hidden');
        } else {
            btnPrev.classList.remove('hidden');
        }

        if (currentQuestionIndex === currentQuiz.questions.length - 1) {
            btnNext.classList.add('hidden');
            btnSubmit.classList.remove('hidden');
        } else {
            btnNext.classList.remove('hidden');
            btnSubmit.classList.add('hidden');
        }
    }

    // Timer Logic
    function startTimer() {
        clearInterval(quizInterval);
        const timerEl = document.getElementById('quiz-timer');

        const updateTimerDisplay = () => {
            const h = Math.floor(timeRemaining / 3600).toString().padStart(2, '0');
            const m = Math.floor((timeRemaining % 3600) / 60).toString().padStart(2, '0');
            const s = (timeRemaining % 60).toString().padStart(2, '0');

            // Re-render blocks
            const hoursEl = document.getElementById('quiz-timer-hours');
            const minutesEl = document.getElementById('quiz-timer-minutes');
            const secondsEl = document.getElementById('quiz-timer-seconds');

            if (hoursEl) hoursEl.textContent = h;
            if (minutesEl) minutesEl.textContent = m;
            if (secondsEl) secondsEl.textContent = s;
        };

        updateTimerDisplay();

        quizInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                clearInterval(quizInterval);
                finishQuiz();
            }
        }, 1000);
    }

    // Navigation Buttons actions
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    const btnSubmit = document.getElementById('btn-quiz-submit');

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentQuestionIndex < currentQuiz.questions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            }
        });
    }

    if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
            const unanswered = userAnswers.filter(a => a === null).length;
            if (unanswered > 0) {
                if (!confirm(`You have ${unanswered} unanswered questions. Set to submit?`)) return;
            }
            finishQuiz();
        });
    }

    function finishQuiz() {
        clearInterval(quizInterval);

        // Calculate Score
        let correctAnswers = 0;
        const incorrectIndices = [];

        currentQuiz.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.answer) {
                correctAnswers++;
            } else {
                incorrectIndices.push(idx);
            }
        });

        const scorePercent = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

        // Save Result
        if (currentUser) {
            const results = JSON.parse(localStorage.getItem('quiz_results')) || [];
            results.push({
                email: currentUser.email,
                quizId: currentQuiz.id,
                quizTitle: currentQuiz.title,
                score: scorePercent,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
            localStorage.setItem('quiz_results', JSON.stringify(results));
        }

        renderResult(correctAnswers, currentQuiz.questions.length, scorePercent, incorrectIndices);
        navigateTo('quiz-result');
    }

    function renderResult(correct, total, percent, incorrectIndices) {
        const resultContainer = document.getElementById('page-quiz-result');
        const userName = currentUser ? currentUser.name : 'Guest';

        resultContainer.innerHTML = `
            <div class="w-full max-w-4xl bg-white">
                <h1 class="text-[28px] font-bold text-slate-900 tracking-tight text-center mb-10">Quiz Results</h1>
                
                <div class="mb-8">
                    <div class="flex justify-between items-center text-[13px] font-medium text-slate-900 mb-2">
                        <span>Quiz Completed</span>
                        <span>100%</span>
                    </div>
                    <div class="w-full bg-slate-900 h-1.5 rounded-full mb-3"></div>
                </div>

                <div class="bg-slate-50 rounded-lg p-6 mb-8 mt-4">
                    <p class="text-[13px] font-medium text-slate-600 mb-1">Score</p>
                    <p class="text-3xl font-bold text-slate-900">${correct}/${total}</p>
                </div>

                <div class="text-center max-w-2xl mx-auto mb-10">
                    <p class="text-[15px] font-medium text-slate-600 leading-relaxed">
                        ${percent >= 70 ?
                `Congratulations, ${userName}! You've completed the quiz with a score of ${correct} out of ${total}. Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!` :
                `Good effort, ${userName}! You've completed the quiz with a score of ${correct} out of ${total}. Keep practicing to improve your understanding of the subject matter.`
            }
                    </p>
                </div>

                <div class="flex flex-col items-center gap-4">
                    ${incorrectIndices.length > 0 ? `
                    <button id="btn-review-answers" class="px-8 py-2.5 rounded shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors w-48">
                        Review Answers
                    </button>
                    ` : ''}
                    <button id="btn-home-from-result" class="px-8 py-2.5 rounded shadow-sm text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-48">
                        Take Another Quiz
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-home-from-result').addEventListener('click', () => navigateTo('select-quiz'));

        const reviewBtn = document.getElementById('btn-review-answers');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                renderReviewIncorrect(incorrectIndices);
                navigateTo('review-answers');
            });
        }
    }

    function renderReviewIncorrect(incorrectIndices) {
        const reviewContainer = document.getElementById('review-answers-container');
        const btnBackToResults = document.getElementById('btn-back-to-results');

        if (btnBackToResults) {
            const newBtn = btnBackToResults.cloneNode(true);
            btnBackToResults.parentNode.replaceChild(newBtn, btnBackToResults);
            newBtn.addEventListener('click', () => navigateTo('select-quiz'));
        }

        reviewContainer.innerHTML = incorrectIndices.map((idx, i) => {
            const q = currentQuiz.questions[idx];
            const userAnswerText = userAnswers[idx] !== null ? q.options[userAnswers[idx]] : "None";
            const correctAnsText = q.options[q.answer];

            return `
                <div class="mb-8">
                    <h3 class="text-[15px] font-bold text-slate-900 mb-2">Question ${i + 1}</h3>
                    <p class="text-[14px] text-slate-700 mb-4">${q.q}</p>
                    
                    <p class="text-[14px] text-slate-600 mb-2">Your answer: ${userAnswerText}</p>
                    <p class="text-[14px] text-slate-900 font-medium">Correct answer: ${correctAnsText}</p>
                </div>
            `;
        }).join('');
    }

    // Initialize UI on load
    updateAuthUI();
});
