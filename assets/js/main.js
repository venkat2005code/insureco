/**
 * Premium Insurance Website - Main JS
 * Functionality: RTL Toggle, Mobile Menu, Sticky Nav, Active State
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    initScrollEffects();
    setActiveLink();
    initAccordion();
    initSidebarToggles();
});

// --- Dark/Light Mode Toggle ---
function initThemeToggle() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Dispatch event for other potential listeners
            window.dispatchEvent(new Event('theme-change'));
        });
    });
}

// --- Accordion ---
function initAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item') || question.parentElement;
            const answer = item.querySelector('.faq-answer');

            // Toggle current
            const isActive = question.classList.contains('active');

            // Close others (optional but recommended for UX)
            // Optional: Close other open items
            // questions.forEach(q => {
            //     if (q !== question) {
            //         q.classList.remove('active');
            //         const otherItem = q.closest('.faq-item') || q.parentElement;
            //         const otherAnswer = otherItem.querySelector('.faq-answer');
            //         if (otherAnswer) otherAnswer.classList.remove('active');
            //     }
            // });

            question.classList.toggle('active');
            if (answer) answer.classList.toggle('active');
        });
    });
}

// --- RTL / LTR Toggle ---
function initTheme() {
    const savedDir = localStorage.getItem('dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateGlobeIcon(savedDir);

    const toggleBtns = document.querySelectorAll('.language-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';

            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateGlobeIcon(newDir);

            // Dispatch event for other potential listeners
            window.dispatchEvent(new Event('dir-change'));
        });
    });
}

function updateGlobeIcon(dir) {
    const toggleBtns = document.querySelectorAll('.language-toggle');
    toggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR');
        btn.title = dir === 'ltr' ? 'Switch to Arabic (RTL)' : 'Switch to English (LTR)';
        // Simply animate click
        btn.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ], { duration: 300 });
    });
}

// --- Mobile Menu ---
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Legacy mobile-menu-btn handler
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mobileMenu.classList.add('open');
                menuBtn.setAttribute('aria-expanded', 'true');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // New menu-toggle handler (RTL-safe hamburger)
    const toggle = document.querySelector('.menu-toggle');
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !toggle.contains(e.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// --- Scroll Effects ---
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// --- Active Link State ---
function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .sidebar-link');

    // remove all active classes first to ensure no stale states
    navLinks.forEach(link => {
        link.classList.remove('active');
        // also remove active from dropdown toggles
        if (link.classList.contains('dropdown-toggle')) {
            link.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Skip '#' links
        if (!linkPath || linkPath === '#') return;

        // Extract filename from paths for comparison (handles /index.html vs /)
        const currentFile = currentPath.split('/').pop() || 'index.html';
        const linkFile = linkPath.split('/').pop() || 'index.html';

        if (currentFile === linkFile) {
            link.classList.add('active');

            // If it's a dropdown item, activate the parent dropdown toggle
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    });
}

// --- Dashboard Sidebar Toggle ---
function initSidebarToggles() {
    const layouts = document.querySelectorAll('.dashboard-layout');
    if (!layouts.length) return;

    const isDesktop = () => window.innerWidth >= 1024;

    layouts.forEach(layout => {
        const sidebar = layout.querySelector('.sidebar');
        const toggle = layout.querySelector('.sidebar-toggle');
        if (!sidebar || !toggle) return;

        let overlay = layout.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            layout.appendChild(overlay);
        }

        const closeBtn = sidebar.querySelector('.sidebar-close');

        const setOpen = (open) => {
            if (isDesktop()) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                return;
            }
            sidebar.classList.toggle('active', open);
            overlay.classList.toggle('active', open);
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !sidebar.classList.contains('active');
            setOpen(willOpen);
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setOpen(false);
            });
        }

        overlay.addEventListener('click', () => setOpen(false));

        window.addEventListener('resize', () => {
            if (isDesktop()) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
}
