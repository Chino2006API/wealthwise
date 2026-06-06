window.WealthWise = window.WealthWise || {};

window.WealthWise.Simulator = (function() {
    
    let currentScenario = 'expected';
    let expectedRate = 7.0;
    
    // Elements
    let inputs = {};
    let displays = {};
    let listenersSetup = false;
    
    function init() {
        // Always populate DOM elements first
        inputs = {
            initial: document.getElementById('sim-initial-investment'),
            monthly: document.getElementById('sim-monthly-contribution'),
            years: document.getElementById('sim-years')
        };
        
        displays = {
            initial: document.getElementById('sim-initial-value'),
            monthly: document.getElementById('sim-monthly-value'),
            years: document.getElementById('sim-years-value')
        };

        const profile = window.WealthWise.Utils.getProfile();
        if (profile) {
            expectedRate = window.WealthWise.Utils.getExpectedReturn(profile.riskProfile);
            const rateDisplay = document.getElementById('sim-rate-display');
            if (rateDisplay) {
                rateDisplay.textContent = expectedRate.toFixed(1) + '%';
            }
            
            // Set defaults based on profile
            const available = Math.max(0, profile.monthlyIncome - profile.monthlyExpenses);
            
            if (inputs.initial && profile.currentSavings) {
                // assume 20% of savings can be invested
                inputs.initial.value = Math.min(100000, profile.currentSavings * 0.2); 
            }
            if (inputs.monthly && available > 0) {
                // assume 50% of available for investment
                inputs.monthly.value = Math.min(5000, available * 0.5);
            }
            if (inputs.years && profile.investmentHorizon) {
                inputs.years.value = profile.investmentHorizon;
            }
        }
        
        if (!listenersSetup) {
            setupListeners();
            listenersSetup = true;
        }
        runSimulation();
    }
    
    function setupListeners() {
        // Range sliders
        const updateValueDisplay = (input, displayEl, isCurrency) => {
            if (!input || !displayEl) return;
            const val = parseFloat(input.value);
            displayEl.textContent = isCurrency ? window.WealthWise.Utils.formatCurrency(val) : val;
        };
        
        if (inputs.initial) {
            inputs.initial.addEventListener('input', () => {
                updateValueDisplay(inputs.initial, displays.initial, true);
                requestAnimationFrame(runSimulation);
            });
            updateValueDisplay(inputs.initial, displays.initial, true);
        }
        
        if (inputs.monthly) {
            inputs.monthly.addEventListener('input', () => {
                updateValueDisplay(inputs.monthly, displays.monthly, true);
                requestAnimationFrame(runSimulation);
            });
            updateValueDisplay(inputs.monthly, displays.monthly, true);
        }
        
        if (inputs.years) {
            inputs.years.addEventListener('input', () => {
                updateValueDisplay(inputs.years, displays.years, false);
                requestAnimationFrame(runSimulation);
            });
            updateValueDisplay(inputs.years, displays.years, false);
        }
        
        // Scenario buttons
        const btns = document.querySelectorAll('.scenario-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentScenario = btn.getAttribute('data-scenario');
                runSimulation(); // just update UI
            });
        });
    }
    
    function runSimulation() {
        if (!inputs.initial) return; // Prevent error if DOM not loaded

        const Utils = window.WealthWise.Utils;
        
        const p = parseFloat(inputs.initial.value) || 0;
        const m = parseFloat(inputs.monthly.value) || 0;
        const y = parseInt(inputs.years.value) || 10;
        
        const scenarios = Utils.projectScenarios(p, m, y, expectedRate);
        const data = scenarios[currentScenario];
        
        updateChart(scenarios, y);
        updateResults(data, p, m, y);
    }
    
    function updateChart(scenarios, years) {
        const labels = Array.from({length: years + 1}, (_, i) => `Año ${i}`);
        
        const datasets = [
            {
                label: 'Invertido',
                data: scenarios.expected.yearlyData.map(d => d.invested),
                borderColor: 'rgba(148, 163, 184, 0.5)', // text-secondary
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                tension: 0
            }
        ];
        
        if (currentScenario === 'pessimistic') {
            datasets.push({
                label: 'Pesimista',
                data: scenarios.pessimistic.yearlyData.map(d => d.value),
                borderColor: '#ef4444',
                gradientColors: ['rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0.0)']
            });
        } else if (currentScenario === 'expected') {
            datasets.push({
                label: 'Esperado',
                data: scenarios.expected.yearlyData.map(d => d.value),
                borderColor: '#f59e0b',
                gradientColors: ['rgba(245, 158, 11, 0.4)', 'rgba(245, 158, 11, 0.0)']
            });
        } else {
            datasets.push({
                label: 'Optimista',
                data: scenarios.optimistic.yearlyData.map(d => d.value),
                borderColor: '#10b981',
                gradientColors: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.0)']
            });
        }
        
        window.WealthWise.Charts.createLineChart('sim-chart', { labels, datasets });
    }
    
    function updateResults(data, p, m, y) {
        const Utils = window.WealthWise.Utils;
        
        document.getElementById('sim-total-invested').textContent = Utils.formatCurrency(data.totalInvested);
        document.getElementById('sim-projected-value').textContent = Utils.formatCurrency(data.finalValue);
        
        const returnsEl = document.getElementById('sim-total-returns');
        const returnPct = data.totalInvested > 0 ? (data.totalReturns / data.totalInvested) * 100 : 0;
        returnsEl.textContent = `+${Utils.formatCurrency(data.totalReturns)} (${returnPct.toFixed(0)}%)`;
        
        // Bank vs Invested
        const bankData = Utils.compoundInterest(p, m, 0.5, y);
        document.getElementById('sim-bank-value').textContent = Utils.formatCurrency(bankData.finalValue);
        
        // Inflation
        const realValue = Utils.inflationAdjust(data.finalValue, y, 3);
        document.getElementById('sim-inflation-value').textContent = Utils.formatCurrency(realValue);
    }
    
    return {
        init,
        simulate: runSimulation
    };
})();
