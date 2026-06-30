document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. Preloader Logic (Rapid multilingual hello greeting)
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    
    const greetings = [
        { text: "Hello", language: "English" },
        { text: "नमस्ते", language: "Hindi" },
        { text: "Olá", language: "Portuguese" },
        { text: "こんにちは", language: "Japanese" },
        { text: "Bonjour", language: "French" },
        { text: "Hola", language: "Spanish" },
        { text: "안녕하세요", language: "Korean" },
        { text: "Ciao", language: "Italian" },
        { text: "Hallo", language: "German" }
    ];

    if (preloader && preloaderText) {
        document.body.style.overflow = 'hidden'; // Disable scroll during load
        let index = 0;
        
        function showGreeting() {
            if (index >= greetings.length) {
                preloader.classList.add('fade-out');
                document.body.style.overflow = ''; // Enable scroll
                setTimeout(() => {
                    preloader.remove();
                }, 500);
                return;
            }
            
            preloaderText.textContent = greetings[index].text;
            preloaderText.classList.remove('animate-out');
            preloaderText.classList.add('animate-in');
            
            setTimeout(() => {
                preloaderText.classList.remove('animate-in');
                preloaderText.classList.add('animate-out');
                
                setTimeout(() => {
                    index++;
                    showGreeting();
                }, 180); // Exit animation delay
            }, 260); // Greeting display duration
        }
        
        // Start sequence
        showGreeting();
    }

    // ==========================================================================
    // 1. Theme Toggler Logic
    // ==========================================================================
    const themeToggler = document.getElementById('themeToggler');
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise use dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggler.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Output to terminal if user toggles theme
        logToTerminal(`System Theme set to: ${newTheme.toUpperCase()}`);
    });

    // ==========================================================================
    // 2. Typewriter Effect
    // ==========================================================================
    const words = ["Creative Design Engineer", "Interactive Prototyper", "Full-Stack Web Architect", "Agentic AI Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    if (typewriterEl) {
        type();
    }

    // ==========================================================================
    // 3. Live Timezone Clock
    // ==========================================================================
    const liveTimeEl = document.getElementById('liveTime');
    const workStatusEl = document.getElementById('workStatus');
    const timeDiffEl = document.getElementById('timeDiff');

    function updateClock() {
        // Mumbai timezone time (Asia/Kolkata)
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const mumbaiTimeStr = new Date().toLocaleTimeString('en-US', options);
        if (liveTimeEl) {
            liveTimeEl.textContent = mumbaiTimeStr;
        }

        // Calculate status based on Mumbai hour (working hours: 09:00 to 18:00)
        const mumbaiHour = parseInt(mumbaiTimeStr.split(':')[0], 10);
        const workStatusText = workStatusEl.querySelector('.status-text');
        const workStatusIndicator = workStatusEl.querySelector('span:first-child');

        if (mumbaiHour >= 9 && mumbaiHour < 18) {
            workStatusText.textContent = "Hacking on code";
            workStatusIndicator.className = "indicator-green";
        } else {
            workStatusText.textContent = "Sleeping / Off work";
            workStatusIndicator.className = "indicator-orange";
            // Custom styling for off-work orange dot
            if (!document.getElementById('orange-dot-style')) {
                const style = document.createElement('style');
                style.id = 'orange-dot-style';
                style.innerHTML = '.indicator-orange { width: 6px; height: 6px; border-radius: 50%; background-color: var(--accent-orange); box-shadow: 0 0 6px var(--accent-orange); }';
                document.head.appendChild(style);
            }
        }

        // Compare with user's system timezone offset
        const userOffsetMinutes = new Date().getTimezoneOffset();

        // Mumbai offset is UTC+5.5 (usually IST: +330 mins)
        // Let's get current Mumbai offset dynamically
        const mumbaiDate = new Date();
        const mumbaiLocaleStr = mumbaiDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const mumbaiOffsetMinutes = (new Date(mumbaiLocaleStr) - mumbaiDate) / 60000;

        const diffMinutes = Math.round(mumbaiOffsetMinutes - userOffsetMinutes);
        const diffHours = Math.round(diffMinutes / 60);

        if (timeDiffEl) {
            if (diffHours === 0) {
                timeDiffEl.textContent = "Matched with local time";
            } else {
                const hoursLabel = Math.abs(diffHours) === 1 ? 'hour' : 'hours';
                const direction = diffHours > 0 ? 'ahead' : 'behind';
                timeDiffEl.textContent = `${Math.abs(diffHours)} ${hoursLabel} ${direction} of you`;
            }
        }
    }

    setInterval(updateClock, 1000);
    updateClock();

    // ==========================================================================
    // 4. sliding tile puzzle game (Interactive Tile)
    // ==========================================================================
    const gameBoard = document.getElementById('gameBoard');
    const moveCountEl = document.getElementById('moveCount');
    const btnShuffle = document.getElementById('btnShuffle');
    const btnSolve = document.getElementById('btnSolve');
    const gameStatus = document.getElementById('gameStatus');

    // Solved state: 1, 2, 3, 4, 5, 6, 7, 8, null
    let boardState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    let moves = 0;
    let isGameActive = false;

    // Renders the boardState to DOM
    function renderBoard() {
        gameBoard.innerHTML = '';
        boardState.forEach((num, index) => {
            const piece = document.createElement('div');
            if (num === null) {
                piece.className = 'game-tile-piece game-tile-empty';
            } else {
                piece.className = 'game-tile-piece';
                piece.textContent = num;

                // Visual layout representing parts of a logo or just tactile keys
                if (num === index + 1) {
                    piece.classList.add('matched'); // glows cyan if in correct slot
                }

                piece.addEventListener('click', () => {
                    if (isGameActive) {
                        makeMove(index);
                    }
                });
            }
            gameBoard.appendChild(piece);
        });

        moveCountEl.textContent = moves;
    }

    // Checks if the tile at index can be moved to the empty slot
    function makeMove(index) {
        const emptyIndex = boardState.indexOf(null);
        const validMoves = getValidMoves(emptyIndex);

        if (validMoves.includes(index)) {
            // Swap values
            boardState[emptyIndex] = boardState[index];
            boardState[index] = null;
            moves++;

            renderBoard();
            checkWin();
        }
    }

    // Returns indices that can swap with empty slot index in a 3x3 grid
    function getValidMoves(emptyIndex) {
        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;
        const moves = [];

        if (row > 0) moves.push(emptyIndex - 3); // Up
        if (row < 2) moves.push(emptyIndex + 3); // Down
        if (col > 0) moves.push(emptyIndex - 1); // Left
        if (col < 2) moves.push(emptyIndex + 1); // Right

        return moves;
    }

    // Check if the board matches the solved state
    function checkWin() {
        const isWin = boardState.every((val, idx) => {
            if (idx === 8) return val === null;
            return val === idx + 1;
        });

        if (isWin) {
            isGameActive = false;
            gameStatus.textContent = "🏆 Solved! AC Logo Unlocked!";
            logToTerminal("Challenge Solved: Game board alignment matched.");

            // Trigger minor confetti effect in console
            gameBoard.querySelectorAll('.game-tile-piece').forEach(p => {
                p.style.animation = 'pulseGlow 0.5s infinite alternate';
            });
        }
    }

    // Shuffle logic: Perform random valid moves starting from solved state
    // This guarantees that the puzzle remains mathematically solvable
    function shuffleBoard() {
        boardState = [1, 2, 3, 4, 5, 6, 7, 8, null];
        moves = 0;
        isGameActive = true;
        gameStatus.textContent = "Solve the grid!";

        let emptyIndex = 8;
        // Perform 40 random valid swaps
        for (let i = 0; i < 40; i++) {
            const valid = getValidMoves(emptyIndex);
            const randomMove = valid[Math.floor(Math.random() * valid.length)];

            // Swap
            boardState[emptyIndex] = boardState[randomMove];
            boardState[randomMove] = null;
            emptyIndex = randomMove;
        }

        renderBoard();
        logToTerminal("System Status: Shuffling game board.");
    }

    // Auto-Solve Cheat (Smoothly returns tiles to position)
    function autoSolve() {
        if (!isGameActive) return;

        gameStatus.textContent = "Auto-aligning...";
        btnShuffle.disabled = true;
        btnSolve.disabled = true;

        // Solve step by step (simulate reverse shuffling)
        setTimeout(() => {
            boardState = [1, 2, 3, 4, 5, 6, 7, 8, null];
            moves += 15; // Penalty moves
            isGameActive = false;
            renderBoard();
            checkWin();

            btnShuffle.disabled = false;
            btnSolve.disabled = false;
        }, 1200);
    }

    btnShuffle.addEventListener('click', shuffleBoard);
    btnSolve.addEventListener('click', autoSolve);

    // Initial load rendering
    renderBoard();

    // ==========================================================================
    // 5. Experience Timeline Tabs
    // ==========================================================================
    const expTabBtns = document.querySelectorAll('.exp-tab-btn');
    const expPanels = document.querySelectorAll('.exp-panel');

    expTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPanelId = btn.getAttribute('data-exp');

            // Set active tab
            expTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set active panel
            expPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetPanelId) {
                    panel.classList.add('active');
                }
            });

            logToTerminal(`Tab loaded: ${btn.textContent}`);
        });
    });

    // ==========================================================================
    // 6. Command Terminal / Console Tile Logic
    // ==========================================================================
    const consoleInput = document.getElementById('consoleInput');
    const consoleOutput = document.getElementById('consoleOutput');
    const presetBtns = document.querySelectorAll('.preset-btn, .preset-cmd');

    function logToTerminal(text) {
        if (!consoleOutput) return;

        // Append new text line
        consoleOutput.innerHTML += `\n${text}`;

        // Auto scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function processCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();

        if (cleanCmd === '') return;

        logToTerminal(`<span class="console-prompt">></span> ${cmd}`);

        switch (cleanCmd) {
            case 'help':
                logToTerminal(`Available commands:\n  <span class="text-cyan">skills</span>   - List technical weapons\n  <span class="text-cyan">contact</span>  - Get coordinates\n  <span class="text-cyan">about</span>    - Layout specifications\n  <span class="text-cyan">clear</span>    - Clear terminal screen`);
                break;
            case 'skills':
                logToTerminal(`Engineering Weapons:\n  • TypeScript / JS\n  • React / Next.js\n  • CSS Grid / HSL Design\n  • Node.js / PostgreSQL\n  • WebGL / Three.js`);
                break;
            case 'contact':
                logToTerminal(`Coordinates for Vedant Shah:\n  • Email: vedantshah@gmail.com\n  • GitHub: github.com/vedantshah\n  • LinkedIn: linkedin.com/in/vedantshah`);
                break;
            case 'about':
                logToTerminal(`Bento Console v1.0.0\nDesigned with Outfit typography and tactile feedback modules. CSS variables enable custom theme profiles.`);
                break;
            case 'clear':
                consoleOutput.innerHTML = 'Terminal cleared. Type \'help\' for options.';
                break;
            default:
                logToTerminal(`Command not found: '${cleanCmd}'. Type 'help' for support.`);
        }

        consoleInput.value = '';
    }

    if (consoleInput) {
        consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(consoleInput.value);
            }
        });
    }

    // Preset buttons trigger commands
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            processCommand(cmd);
        });
    });

    // Custom CSS insertion for console colors
    const consoleColors = document.createElement('style');
    consoleColors.innerHTML = `
        .text-cyan { color: var(--accent-cyan) !important; }
        .text-orange { color: var(--accent-orange) !important; }
    `;
    document.head.appendChild(consoleColors);

    // Track page views in mock terminal
    setTimeout(() => {
        logToTerminal("System: Connection established from local IP.");
        logToTerminal("System: Type 'help' to audit resources.");
    }, 1000);

    // ==========================================================================
    // 7. Interactive Background Grid & Tile Color Randomizer (Optimized)
    // ==========================================================================
    const bgGrid = document.getElementById('bgGrid');

    // Helper to generate a random HSL color
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return {
            accent: `hsl(${hue}, 95%, 65%)`,
            glow: `hsla(${hue}, 95%, 65%, 0.18)`,
            brightGlow: `hsla(${hue}, 95%, 65%, 0.35)`
        };
    }

    // Generate cells for the background grid (using DocumentFragment and pre-assigned colors)
    function generateBgGrid() {
        if (!bgGrid) return;

        bgGrid.innerHTML = '';

        const cellSize = 80;
        const cols = Math.ceil(window.innerWidth / cellSize);
        const rows = Math.ceil(Math.max(window.innerHeight, document.documentElement.scrollHeight) / cellSize);
        const totalCells = cols * rows;

        bgGrid.style.gridTemplateColumns = `repeat(${cols}, 80px)`;
        bgGrid.style.gridTemplateRows = `repeat(${rows}, 80px)`;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'bg-grid-cell';
            cell.dataset.index = i;
            // Pre-assign a random color to each cell for pure CSS hover triggers
            const color = getRandomColor();
            cell.style.setProperty('--cell-hover-color', color.glow);
            fragment.appendChild(cell);
        }
        bgGrid.appendChild(fragment);
    }

    // Event Delegation: Only bind click listener for explosive reactions
    if (bgGrid) {
        bgGrid.addEventListener('click', (e) => {
            const cell = e.target;
            if (cell.classList.contains('bg-grid-cell')) {
                const i = parseInt(cell.dataset.index, 10);
                const color = getRandomColor();

                const cellSize = 80;
                const cols = Math.ceil(window.innerWidth / cellSize);
                const totalCells = bgGrid.children.length;

                // Bright flash on click
                cell.style.setProperty('--cell-hover-color', color.brightGlow);
                cell.style.backgroundColor = color.brightGlow;

                // Trigger neighbors explosion
                const neighbors = [
                    i - 1,       // Left
                    i + 1,       // Right
                    i - cols,    // Up
                    i + cols     // Down
                ];

                neighbors.forEach(nIndex => {
                    if (nIndex >= 0 && nIndex < totalCells) {
                        const neighborCell = bgGrid.children[nIndex];
                        if (neighborCell) {
                            neighborCell.style.transition = 'none';
                            neighborCell.style.backgroundColor = color.glow;

                            // Fade out neighbor
                            setTimeout(() => {
                                neighborCell.style.transition = 'background-color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                                neighborCell.style.backgroundColor = 'transparent';
                            }, 50);
                        }
                    }
                });

                // Fade out clicked cell and restore default HSL hover variables
                setTimeout(() => {
                    cell.style.backgroundColor = '';
                    cell.style.setProperty('--cell-hover-color', color.glow);
                }, 150);
            }
        });
    }

    // Initialize background grid and update on window resize
    generateBgGrid();
    window.addEventListener('resize', debounce(generateBgGrid, 150));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Bento Grid Tiles Color Randomizer (Pre-assign colors on load for 0ms delay)
    const bentoTiles = document.querySelectorAll('.tile');
    bentoTiles.forEach(tile => {
        // Pre-assign color variables on load so hover is 100% instant CSS-driven
        const color = getRandomColor();
        tile.style.setProperty('--tile-accent-hover', color.accent);
        tile.style.setProperty('--tile-glow-hover', color.brightGlow);

        // We only listen to click to change the color again
        tile.addEventListener('click', () => {
            const newColor = getRandomColor();
            tile.style.setProperty('--tile-accent-hover', newColor.accent);
            tile.style.setProperty('--tile-glow-hover', newColor.brightGlow);

            // Brief snappy click flash of background color
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const flashColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
            tile.style.backgroundColor = flashColor;
            setTimeout(() => {
                tile.style.backgroundColor = '';
            }, 120);

            logToTerminal(`System: Tile Accent randomized to ${newColor.accent.toUpperCase()}`);
        });
    });

    // ==========================================================================
    // 8. Morphic Navbar Logic
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNavbarShapes() {
        navLinks.forEach((link, index) => {
            const isActive = link.classList.contains('active');
            const isFirst = index === 0;
            const isLast = index === navLinks.length - 1;
            
            const prevLink = index > 0 ? navLinks[index - 1] : null;
            const nextLink = index < navLinks.length - 1 ? navLinks[index + 1] : null;
            
            const isPrevActive = prevLink && prevLink.classList.contains('active');
            const isNextActive = nextLink && nextLink.classList.contains('active');

            // Reset shape classes
            link.classList.remove('round-all', 'round-left', 'round-right', 'no-round');

            if (isActive) {
                link.classList.add('round-all');
            } else {
                const roundLeft = isPrevActive || isFirst;
                const roundRight = isNextActive || isLast;

                if (roundLeft && roundRight) {
                    link.classList.add('round-all');
                } else if (roundLeft) {
                    link.classList.add('round-left');
                } else if (roundRight) {
                    link.classList.add('round-right');
                } else {
                    link.classList.add('no-round');
                }
            }
        });
    }

    // Handle clicks to change active section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavbarShapes();
        });
    });

    // Scroll spy logic to dynamically change active link based on scroll position
    const sections = [
        document.getElementById('about'),
        document.getElementById('experience'),
        document.getElementById('projects'),
        document.getElementById('game-tile')
    ];

    function scrollSpy() {
        let currentSectionId = 'about';
        const scrollPosition = window.scrollY + 120; // offset for sticky header

        sections.forEach(section => {
            if (section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSectionId = section.getAttribute('id');
                }
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                if (!link.classList.contains('active')) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    updateNavbarShapes();
                }
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    // Initial call
    updateNavbarShapes();
    scrollSpy();
});
