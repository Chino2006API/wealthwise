window.WealthWise = window.WealthWise || {};

window.WealthWise.App = (function() {
    
    let currentSectionId = 'welcome-section';
    
    function init() {
        // Init modules
        if (window.WealthWise.Quiz) window.WealthWise.Quiz.init();
        if (window.WealthWise.Dashboard) window.WealthWise.Dashboard.init();
        if (window.WealthWise.Simulator) window.WealthWise.Simulator.init();
        if (window.WealthWise.Recommendations) window.WealthWise.Recommendations.init();
        if (window.WealthWise.Education) window.WealthWise.Education.init();
        if (window.WealthWise.Comparator) window.WealthWise.Comparator.init(); // Optional module if time permits
        
        // Event Listeners
        setupNavigation();
        setupMobileMenu();
        
        const startBtn = document.getElementById('btn-start-quiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                navigateTo('quiz-section');
            });
        }
        
        // Check profile
        const profile = window.WealthWise.Utils.getProfile();
        if (profile) {
            navigateTo('dashboard-section');
        } else {
            // Show welcome explicitly
            document.getElementById('welcome-section').style.display = 'block';
        }
    }
    
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-section');
                if (target) {
                    navigateTo(target);
                }
                
                // Close mobile menu if open
                const sidebar = document.getElementById('sidebar-nav');
                const overlay = document.getElementById('sidebar-overlay');
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('visible');
                }
            });
        });
    }
    
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar-nav');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (toggleBtn && sidebar && overlay) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('visible');
            });
            
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
            });
        }
    }
    
    function navigateTo(sectionId) {
        if (sectionId === currentSectionId && sectionId !== 'dashboard-section') return;
        
        const currentSection = document.getElementById(currentSectionId);
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) return;
        
        // Handle transitions
        if (currentSection && currentSection !== targetSection) {
            currentSection.classList.add('section-exit');
            setTimeout(() => {
                currentSection.style.display = 'none';
                currentSection.classList.remove('section-exit');
                
                showTargetSection(targetSection, sectionId);
            }, 300); // Wait for exit animation
        } else {
            showTargetSection(targetSection, sectionId);
        }
    }
    
    function showTargetSection(targetSection, sectionId) {
        // Ensure all other sections are hidden
        document.querySelectorAll('.content-section').forEach(sec => {
            if (sec.id !== sectionId) {
                sec.style.display = 'none';
            }
        });

        targetSection.style.display = 'block';
        targetSection.classList.add('section-enter');
        
        setTimeout(() => {
            targetSection.classList.remove('section-enter');
        }, 400);
        
        currentSectionId = sectionId;
        setActiveNavLink(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger module updates
        const profile = window.WealthWise.Utils.getProfile();
        
        if (sectionId === 'dashboard-section') {
            if (window.WealthWise.Dashboard) window.WealthWise.Dashboard.render(profile);
        } else if (sectionId === 'simulator-section') {
            if (window.WealthWise.Simulator) window.WealthWise.Simulator.init();
        } else if (sectionId === 'recommendations-section') {
            if (window.WealthWise.Recommendations) window.WealthWise.Recommendations.render(profile);
        } else if (sectionId === 'comparator-section') {
            if (window.WealthWise.Comparator) window.WealthWise.Comparator.init();
        } else if (sectionId === 'quiz-section') {
             // Let user retake quiz, maybe clear old answers?
        }
    }
    
    function setActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    return {
        init,
        navigateTo,
        showNotification
    };
})();

// Bootstrap the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.WealthWise.App.init());
} else {
    // DOM is already ready
    window.WealthWise.App.init();
}
