window.WealthWise = window.WealthWise || {};

window.WealthWise.Utils = (function() {
    
    // --- Formatters ---
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    function formatCurrencyShort(amount) {
        if (amount >= 1000000) {
            return '$' + (amount / 1000000).toFixed(1) + 'M';
        }
        if (amount >= 1000) {
            return '$' + (amount / 1000).toFixed(1) + 'k';
        }
        return formatCurrency(amount);
    }
    
    function formatPercent(value) {
        return value.toFixed(1) + '%';
    }

    // --- Financial Calculations ---
    
    function compoundInterest(principal, monthlyContribution, annualRate, years) {
        const r = annualRate / 100;
        const n = 12; // Monthly compounding
        const t = years;
        const PMT = monthlyContribution;
        
        let yearlyData = [];
        let currentPrincipal = principal;
        let totalInvested = principal;
        
        if (r === 0) {
            const finalValue = principal + (PMT * 12 * years);
            return {
                finalValue,
                totalInvested: finalValue,
                totalReturns: 0,
                yearlyData: Array.from({length: years + 1}, (_, i) => ({
                    year: i,
                    value: principal + (PMT * 12 * i),
                    invested: principal + (PMT * 12 * i),
                    returns: 0
                }))
            };
        }

        yearlyData.push({
            year: 0,
            value: principal,
            invested: principal,
            returns: 0
        });

        for (let y = 1; y <= years; y++) {
            // Calculate value at year y
            // FV = P(1+r/n)^(nt) + PMT[((1+r/n)^(nt)-1)/(r/n)]
            const months = y * 12;
            const ratePerPeriod = r / n;
            
            const compoundPrincipal = principal * Math.pow(1 + ratePerPeriod, months);
            const compoundContributions = PMT * ((Math.pow(1 + ratePerPeriod, months) - 1) / ratePerPeriod);
            
            const totalValue = compoundPrincipal + compoundContributions;
            const investedSoFar = principal + (PMT * 12 * y);
            
            yearlyData.push({
                year: y,
                value: totalValue,
                invested: investedSoFar,
                returns: totalValue - investedSoFar
            });
        }
        
        const finalData = yearlyData[years];
        
        return {
            finalValue: finalData.value,
            totalInvested: finalData.invested,
            totalReturns: finalData.returns,
            yearlyData
        };
    }
    
    function projectScenarios(principal, monthly, years, baseRate) {
        const pessimisticRate = Math.max(0.5, baseRate - 3);
        const optimisticRate = baseRate + 3;
        
        return {
            pessimistic: compoundInterest(principal, monthly, pessimisticRate, years),
            expected: compoundInterest(principal, monthly, baseRate, years),
            optimistic: compoundInterest(principal, monthly, optimisticRate, years)
        };
    }
    
    function calculateEmergencyFund(monthlyExpenses, months = 6) {
        return monthlyExpenses * months;
    }
    
    function calculateEmergencyProgress(monthlyExpenses, currentSavings, months = 6) {
        const target = calculateEmergencyFund(monthlyExpenses, months);
        const current = Math.min(currentSavings, target);
        const remaining = target - current;
        const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 100;
        
        return { target, current, remaining, percentage };
    }
    
    function inflationAdjust(amount, years, inflationRate = 3) {
        // FV = PV / (1 + r)^t
        return amount / Math.pow(1 + (inflationRate / 100), years);
    }
    
    function ruleOf72(rate) {
        if (rate <= 0) return 0;
        return (72 / rate).toFixed(1);
    }

    // --- Profile & Risk Scoring ---
    
    function calculateRiskScore(answers) {
        let score = 0;
        
        // Age
        const ageMap = {
            'Menor de 25': 20,
            '25 - 35': 15,
            '36 - 45': 10,
            '46 - 55': 5,
            'Mayor de 55': 0
        };
        score += ageMap[answers.age] || 0;
        
        // Horizon
        const horizonMap = {
            1: 0,   // < 2
            3: 5,   // 2-5
            7: 10,  // 5-10
            15: 15, // 10-20
            25: 20  // > 20
        };
        score += horizonMap[answers.investmentHorizon] || 0;
        
        // Risk Tolerance
        const toleranceMap = {
            'very_low': 0,
            'low': 5,
            'moderate': 10,
            'high': 15,
            'very_high': 20
        };
        score += toleranceMap[answers.riskTolerance] || 0;
        
        // Market Drop
        const dropMap = {
            'sell_all': 0,
            'sell_some': 5,
            'hold': 10,
            'buy_more': 20
        };
        score += dropMap[answers.marketDropReaction] || 0;
        
        // Experience
        const expMap = {
            'none': 0,
            'beginner': 5,
            'intermediate': 10,
            'advanced': 15
        };
        score += expMap[answers.investmentExperience] || 0;
        
        // Emergency Fund
        score += answers.hasEmergencyFund === 'true' ? 5 : 0;
        
        return Math.max(1, Math.min(100, score));
    }
    
    function getRiskProfile(score) {
        if (score <= 20) return 'ultra_conservative';
        if (score <= 40) return 'conservative';
        if (score <= 60) return 'moderate';
        if (score <= 80) return 'aggressive';
        return 'very_aggressive';
    }
    
    function getRiskProfileLabel(profile) {
        const labels = {
            'ultra_conservative': 'Ultra Conservador',
            'conservative': 'Conservador',
            'moderate': 'Moderado',
            'aggressive': 'Agresivo',
            'very_aggressive': 'Muy Agresivo'
        };
        return labels[profile] || 'Desconocido';
    }
    
    function getRiskProfileColor(profile) {
        const colors = {
            'ultra_conservative': 'var(--accent-blue)',
            'conservative': 'var(--accent-green)',
            'moderate': 'var(--accent-gold)',
            'aggressive': 'var(--accent-orange)',
            'very_aggressive': 'var(--accent-red)'
        };
        return colors[profile] || 'var(--accent-gold)';
    }
    
    function getAllocation(profile) {
        const allocations = {
            'ultra_conservative': { bonds: 60, stocks: 10, reits: 0, cash: 30 },
            'conservative': { bonds: 50, stocks: 25, reits: 5, cash: 20 },
            'moderate': { bonds: 30, stocks: 45, reits: 15, cash: 10 },
            'aggressive': { bonds: 15, stocks: 60, reits: 20, cash: 5 },
            'very_aggressive': { bonds: 5, stocks: 75, reits: 18, cash: 2 }
        };
        return allocations[profile] || allocations['moderate'];
    }
    
    function getExpectedReturn(profile) {
        const returns = {
            'ultra_conservative': 3.5,
            'conservative': 5.0,
            'moderate': 7.0,
            'aggressive': 9.0,
            'very_aggressive': 11.0
        };
        return returns[profile] || 7.0;
    }
    
    function calculateHealthScore(profile) {
        let score = 0;
        
        // Has emergency fund
        if (profile.hasEmergencyFund === 'true') score += 20;
        
        // Savings rate
        const income = parseFloat(profile.monthlyIncome);
        const expenses = parseFloat(profile.monthlyExpenses);
        if (income > 0) {
            const savingsRate = (income - expenses) / income;
            if (savingsRate > 0.3) score += 25;
            else if (savingsRate > 0.2) score += 20;
            else if (savingsRate > 0.1) score += 15;
            else if (savingsRate > 0) score += 10;
        }
        
        // Horizon vs Age check (simplified)
        // If they have a long horizon, that's healthy
        if (profile.investmentHorizon >= 7) score += 15;
        else if (profile.investmentHorizon >= 3) score += 10;
        
        // Diversification proxy (moderate/balanced is healthier than extremes usually)
        if (profile.riskProfile === 'moderate' || profile.riskProfile === 'conservative' || profile.riskProfile === 'aggressive') {
            score += 20;
        } else {
            score += 10;
        }
        
        // Experience
        const expMap = { 'none': 0, 'beginner': 5, 'intermediate': 10, 'advanced': 20 };
        score += expMap[profile.investmentExperience] || 0;
        
        return Math.max(0, Math.min(100, score));
    }
    
    // --- LocalStorage ---
    
    const STORAGE_KEY = 'wealthwise_profile';
    
    function saveProfile(profileData) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
            return true;
        } catch (e) {
            console.error('Error saving profile:', e);
            return false;
        }
    }
    
    function getProfile() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading profile:', e);
            return null;
        }
    }
    
    function clearProfile() {
        localStorage.removeItem(STORAGE_KEY);
    }
    
    // Public API
    return {
        formatCurrency,
        formatCurrencyShort,
        formatPercent,
        compoundInterest,
        projectScenarios,
        calculateEmergencyFund,
        calculateEmergencyProgress,
        inflationAdjust,
        ruleOf72,
        calculateRiskScore,
        getRiskProfile,
        getRiskProfileLabel,
        getRiskProfileColor,
        getAllocation,
        getExpectedReturn,
        calculateHealthScore,
        saveProfile,
        getProfile,
        clearProfile
    };
})();
