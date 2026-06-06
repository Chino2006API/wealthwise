window.WealthWise = window.WealthWise || {};

window.WealthWise.Dashboard = (function() {
    
    function init() {
        // Event listeners for emergency fund calc
        const expenseInput = document.getElementById('emergency-months-expenses');
        const savingsInput = document.getElementById('emergency-current-savings');
        
        if (expenseInput && savingsInput) {
            [expenseInput, savingsInput].forEach(input => {
                input.addEventListener('input', () => {
                    const profile = window.WealthWise.Utils.getProfile() || {};
                    const exp = parseFloat(expenseInput.value) || 0;
                    const sav = parseFloat(savingsInput.value) || 0;
                    
                    // Update profile
                    profile.monthlyExpenses = exp;
                    profile.currentSavings = sav;
                    window.WealthWise.Utils.saveProfile(profile);
                    
                    updateEmergencyUI(exp, sav);
                });
            });
        }
    }
    
    function render(profile) {
        if (!profile) {
            profile = window.WealthWise.Utils.getProfile();
        }
        
        if (!profile) {
            // Need to take quiz
            window.WealthWise.App.navigateTo('quiz-section');
            return;
        }
        
        const Utils = window.WealthWise.Utils;
        
        // Welcome
        document.getElementById('dashboard-welcome').textContent = `Hola, tu perfil es: ${Utils.getRiskProfileLabel(profile.riskProfile)}`;
        
        // Metrics
        renderRiskGauge(profile.riskScore, profile.riskProfile);
        renderHealthScore(Utils.calculateHealthScore(profile));
        
        // Monthly Summary
        const inc = parseFloat(profile.monthlyIncome) || 0;
        const exp = parseFloat(profile.monthlyExpenses) || 0;
        const avail = Math.max(0, inc - exp);
        
        document.getElementById('dash-income').textContent = Utils.formatCurrency(inc);
        document.getElementById('dash-expenses').textContent = Utils.formatCurrency(exp);
        document.getElementById('dash-available').textContent = Utils.formatCurrency(avail);
        
        // Allocation
        renderAllocationChart(profile);
        
        // Emergency Fund
        const curSav = parseFloat(profile.currentSavings) || 0;
        document.getElementById('emergency-months-expenses').value = exp;
        document.getElementById('emergency-current-savings').value = curSav;
        updateEmergencyUI(exp, curSav);
    }
    
    function renderRiskGauge(score, profileStr) {
        const needle = document.getElementById('risk-gauge-needle');
        const label = document.getElementById('risk-profile-label');
        const Utils = window.WealthWise.Utils;
        
        if (!needle || !label) return;
        
        // Map 0-100 to angle: -90deg (left) to +90deg (right)
        // Adjust formula based on CSS rotation origin
        const degrees = -90 + (score / 100) * 180;
        
        setTimeout(() => {
            needle.style.transform = `rotate(${degrees}deg)`;
        }, 100);
        
        label.textContent = Utils.getRiskProfileLabel(profileStr);
        label.style.color = Utils.getRiskProfileColor(profileStr);
    }
    
    function renderHealthScore(score) {
        const circle = document.getElementById('health-score-circle');
        const valueEl = document.getElementById('health-score-value');
        
        if (!circle || !valueEl) return;
        
        const circumference = 2 * Math.PI * 61;
        const offset = circumference - (score / 100) * circumference;
        
        // Color
        let color = 'var(--accent-green)';
        if (score < 40) color = 'var(--accent-red)';
        else if (score < 70) color = 'var(--accent-gold)';
        
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = color;
        
        // Animate number
        let current = 0;
        const target = score;
        const duration = 1000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const inc = target / steps;
        
        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            valueEl.textContent = Math.round(current);
            valueEl.style.color = color;
        }, stepTime);
    }
    
    function renderAllocationChart(profile) {
        const Utils = window.WealthWise.Utils;
        const allocation = profile.allocation;
        const labels = ['Bonos', 'Acciones', 'Bienes Raíces', 'Efectivo'];
        const data = [allocation.bonds, allocation.stocks, allocation.reits, allocation.cash];
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']; // blue, green, purple, gold
        
        window.WealthWise.Charts.createDoughnutChart('allocation-chart', {
            labels,
            data,
            colors,
            centerText: Utils.getRiskProfileLabel(profile.riskProfile),
            centerColor: Utils.getRiskProfileColor(profile.riskProfile)
        });
        
        // Render Table
        const table = document.getElementById('allocation-table');
        if (!table) return;
        
        let html = '';
        labels.forEach((label, i) => {
            if (data[i] > 0) {
                html += `
                    <div class="allocation-row">
                        <div class="flex-row">
                            <div class="allocation-dot" style="background-color: ${colors[i]}"></div>
                            <div class="allocation-name text-secondary">${label}</div>
                        </div>
                        <div class="allocation-percent" style="color: ${colors[i]}">${data[i]}%</div>
                    </div>
                `;
            }
        });
        table.innerHTML = html;
        
        // Setup recs button
        const btn = document.getElementById('btn-view-recs');
        if (btn) {
            btn.onclick = () => window.WealthWise.App.navigateTo('recommendations-section');
        }
    }
    
    function updateEmergencyUI(exp, sav) {
        const Utils = window.WealthWise.Utils;
        const progress = Utils.calculateEmergencyProgress(exp, sav, 6);
        
        document.getElementById('emergency-percent').textContent = progress.percentage;
        document.getElementById('emergency-target').textContent = Utils.formatCurrency(progress.target);
        
        const curEl = document.getElementById('emergency-current');
        curEl.textContent = Utils.formatCurrency(progress.current);
        
        const bar = document.getElementById('emergency-progress-bar');
        bar.style.width = `${progress.percentage}%`;
        
        let color = 'var(--accent-red)';
        if (progress.percentage >= 100) color = 'var(--accent-green)';
        else if (progress.percentage >= 33) color = 'var(--accent-gold)';
        
        bar.style.background = color;
        curEl.style.color = color;
        
        const recText = document.getElementById('emergency-recommendation-text');
        const remEl = document.getElementById('emergency-remaining');
        
        if (remEl) remEl.textContent = Utils.formatCurrency(progress.remaining);
        
        if (progress.percentage === 0) {
            recText.innerHTML = `Prioridad #1: Construye tu fondo de emergencia. Meta: <strong class="text-primary">${Utils.formatCurrency(progress.target)}</strong>.`;
        } else if (progress.percentage < 100) {
            recText.innerHTML = `Vas por buen camino. Faltan <strong class="text-primary">${Utils.formatCurrency(progress.remaining)}</strong> para completar tu fondo de seguridad.`;
        } else {
            recText.innerHTML = `¡Excelente! Tu fondo de emergencia está completo. Estás listo para invertir con confianza.`;
        }
    }
    
    return {
        init,
        render
    };
})();
