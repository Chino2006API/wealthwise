window.WealthWise = window.WealthWise || {};

window.WealthWise.Quiz = (function() {
    
    const questions = [
        {
            id: 'age',
            question: '¿Cuál es tu rango de edad?',
            subtitle: 'Tu edad nos ayuda a determinar tu horizonte de inversión.',
            options: [
                { text: 'Menor de 25', value: 'Menor de 25', icon: '<span class="material-icons-outlined">eco</span>' },
                { text: '25 - 35', value: '25 - 35', icon: '<span class="material-icons-outlined">spa</span>' },
                { text: '36 - 45', value: '36 - 45', icon: '<span class="material-icons-outlined">park</span>' },
                { text: '46 - 55', value: '46 - 55', icon: '<span class="material-icons-outlined">nature</span>' },
                { text: 'Mayor de 55', value: 'Mayor de 55', icon: '<span class="material-icons-outlined">landscape</span>' }
            ]
        },
        {
            id: 'monthlyIncome',
            question: '¿Cuál es tu ingreso mensual aproximado?',
            subtitle: 'Esto nos ayuda a calcular tu capacidad de ahorro.',
            options: [
                { text: 'Menos de $1,000', value: 750, icon: '<span class="material-icons-outlined">payments</span>' },
                { text: '$1,000 - $3,000', value: 2000, icon: '<span class="material-icons-outlined">payments</span>' },
                { text: '$3,000 - $5,000', value: 4000, icon: '<span class="material-icons-outlined">payments</span>' },
                { text: '$5,000 - $10,000', value: 7500, icon: '<span class="material-icons-outlined">payments</span>' },
                { text: 'Más de $10,000', value: 15000, icon: '<span class="material-icons-outlined">payments</span>' }
            ]
        },
        {
            id: 'monthlyExpenses',
            question: '¿Cuánto gastas mensualmente en promedio?',
            subtitle: 'Incluye renta, comida, servicios y estilo de vida.',
            options: [
                { text: 'Menos de $500', value: 350, icon: '<span class="material-icons-outlined">credit_card</span>' },
                { text: '$500 - $1,500', value: 1000, icon: '<span class="material-icons-outlined">credit_card</span>' },
                { text: '$1,500 - $3,000', value: 2250, icon: '<span class="material-icons-outlined">credit_card</span>' },
                { text: '$3,000 - $5,000', value: 4000, icon: '<span class="material-icons-outlined">credit_card</span>' },
                { text: 'Más de $5,000', value: 7500, icon: '<span class="material-icons-outlined">credit_card</span>' }
            ]
        },
        {
            id: 'currentSavings',
            question: '¿Cuánto tienes ahorrado o invertido actualmente?',
            subtitle: 'Considera todo tu capital disponible.',
            options: [
                { text: 'Menos de $1,000', value: 500, icon: '<span class="material-icons-outlined">account_balance</span>' },
                { text: '$1,000 - $5,000', value: 3000, icon: '<span class="material-icons-outlined">account_balance</span>' },
                { text: '$5,000 - $20,000', value: 12500, icon: '<span class="material-icons-outlined">account_balance</span>' },
                { text: '$20,000 - $50,000', value: 35000, icon: '<span class="material-icons-outlined">account_balance</span>' },
                { text: 'Más de $50,000', value: 75000, icon: '<span class="material-icons-outlined">account_balance</span>' }
            ]
        },
        {
            id: 'investmentGoal',
            question: '¿Cuál es tu principal objetivo financiero?',
            subtitle: 'Tener una meta clara es el primer paso del éxito.',
            options: [
                { text: 'Jubilación tranquila', value: 'retirement', icon: '<span class="material-icons-outlined">beach_access</span>' },
                { text: 'Comprar una casa', value: 'home', icon: '<span class="material-icons-outlined">home</span>' },
                { text: 'Educación (hijos o propia)', value: 'education', icon: '<span class="material-icons-outlined">school</span>' },
                { text: 'Libertad financiera / Retiro temprano', value: 'freedom', icon: '<span class="material-icons-outlined">diamond</span>' },
                { text: 'Viajar por el mundo', value: 'travel', icon: '<span class="material-icons-outlined">flight</span>' },
                { text: 'Ahorro general y crecimiento', value: 'general', icon: '<span class="material-icons-outlined">savings</span>' }
            ]
        },
        {
            id: 'investmentHorizon',
            question: '¿En cuánto tiempo necesitarás utilizar este dinero?',
            subtitle: 'El tiempo es tu mayor aliado al invertir.',
            options: [
                { text: 'Menos de 2 años', value: 1, icon: '<span class="material-icons-outlined">hourglass_empty</span>' },
                { text: '2 a 5 años', value: 3, icon: '<span class="material-icons-outlined">calendar_month</span>' },
                { text: '5 a 10 años', value: 7, icon: '<span class="material-icons-outlined">event</span>' },
                { text: '10 a 20 años', value: 15, icon: '<span class="material-icons-outlined">trending_up</span>' },
                { text: 'Más de 20 años', value: 25, icon: '<span class="material-icons-outlined">rocket</span>' }
            ]
        },
        {
            id: 'riskTolerance',
            question: '¿Cómo describirías tu tolerancia al riesgo?',
            subtitle: 'El riesgo y el retorno van de la mano. Mayor riesgo = mayor potencial de ganancia y pérdida.',
            options: [
                { text: 'Muy baja - Prefiero no perder nada, aunque gane poco', value: 'very_low', icon: '<span class="material-icons-outlined">shield</span>' },
                { text: 'Baja - Acepto pérdidas mínimas y ocasionales', value: 'low', icon: '<span class="material-icons-outlined">pets</span>' },
                { text: 'Moderada - Busco un balance entre seguridad y crecimiento', value: 'moderate', icon: '<span class="material-icons-outlined">balance</span>' },
                { text: 'Alta - Acepto volatilidad a cambio de mayores ganancias', value: 'high', icon: '<span class="material-icons-outlined">flight_takeoff</span>' },
                { text: 'Muy alta - Busco máximo crecimiento a pesar del riesgo', value: 'very_high', icon: '<span class="material-icons-outlined">local_fire_department</span>' }
            ]
        },
        {
            id: 'marketDropReaction',
            question: 'Si tu inversión pierde 20% de su valor en un mes, ¿qué harías?',
            subtitle: 'No hay respuesta correcta. Esto nos ayuda a entender tu perfil emocional.',
            options: [
                { text: 'Vendería todo inmediatamente para no perder más', value: 'sell_all', icon: '<span class="material-icons-outlined">sentiment_dissatisfied</span>' },
                { text: 'Vendería una parte para sentirme más seguro', value: 'sell_some', icon: '<span class="material-icons-outlined">sentiment_neutral</span>' },
                { text: 'No haría nada, esperaría a que el mercado se recupere', value: 'hold', icon: '<span class="material-icons-outlined">sentiment_satisfied</span>' },
                { text: 'Invertiría más, ¡es una excelente oportunidad de compra!', value: 'buy_more', icon: '<span class="material-icons-outlined">sentiment_very_satisfied</span>' }
            ]
        },
        {
            id: 'investmentExperience',
            question: '¿Cuál es tu experiencia con inversiones?',
            subtitle: 'Adaptaremos el lenguaje a tu nivel.',
            options: [
                { text: 'Ninguna - Nunca he invertido', value: 'none', icon: '<span class="material-icons-outlined">eco</span>' },
                { text: 'Principiante - Solo cuentas de ahorro o plazos fijos', value: 'beginner', icon: '<span class="material-icons-outlined">spa</span>' },
                { text: 'Intermedia - Invierto regularmente en acciones o fondos', value: 'intermediate', icon: '<span class="material-icons-outlined">park</span>' },
                { text: 'Avanzada - Entiendo mercados, opciones o bienes raíces', value: 'advanced', icon: '<span class="material-icons-outlined">terrain</span>' }
            ]
        },
        {
            id: 'hasEmergencyFund',
            question: '¿Tienes un fondo de emergencia?',
            subtitle: 'Dinero disponible para cubrir 3 a 6 meses de tus gastos básicos.',
            options: [
                { text: 'Sí, tengo al menos 3 meses cubiertos', value: 'true', icon: '<span class="material-icons-outlined">check_circle</span>' },
                { text: 'No, aún no he creado uno', value: 'false', icon: '<span class="material-icons-outlined">cancel</span>' }
            ]
        }
    ];

    let currentStep = 0;
    let answers = {};
    
    // DOM Elements
    let container, progressText, progressBar, prevBtn, nextBtn;

    function init() {
        container = document.getElementById('quiz-question-container');
        progressText = document.getElementById('quiz-progress-text');
        progressBar = document.getElementById('quiz-progress-bar');
        prevBtn = document.getElementById('quiz-prev-btn');
        nextBtn = document.getElementById('quiz-next-btn');
        
        if (!container) return;

        // Ensure clean state
        currentStep = 0;
        answers = {};
        
        prevBtn.addEventListener('click', prevQuestion);
        nextBtn.addEventListener('click', nextQuestion);
        
        const retakeBtn = document.getElementById('btn-retake-quiz');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                resetQuiz();
                window.WealthWise.App.navigateTo('quiz-section');
            });
        }
        
        renderQuestion(currentStep);
    }
    
    function renderQuestion(index) {
        const q = questions[index];
        if (!q) return;
        
        // Update progress
        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pregunta ${index + 1} de ${questions.length}`;
        
        // Buttons state
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = index === questions.length - 1 ? 'Finalizar Análisis →' : 'Siguiente →';
        
        // Create HTML
        let html = `
            <div class="quiz-question animate-fadeInUp">
                <h2>${q.question}</h2>
                <p class="text-secondary mb-2">${q.subtitle || ''}</p>
                <div class="quiz-options">
        `;
        
        q.options.forEach((opt, i) => {
            const isSelected = answers[q.id] === opt.value;
            html += `
                <div class="quiz-option ${isSelected ? 'selected' : ''}" 
                     data-id="${q.id}" 
                     data-value="${opt.value}"
                     style="animation-delay: ${i * 0.1}s">
                    <span class="quiz-option-icon">${opt.icon}</span>
                    <span class="quiz-option-text">${opt.text}</span>
                </div>
            `;
        });
        
        html += `</div></div>`;
        container.innerHTML = html;
        
        // Add listeners to options
        const optionEls = container.querySelectorAll('.quiz-option');
        optionEls.forEach(el => {
            el.addEventListener('click', function() {
                // Remove selected from all
                optionEls.forEach(o => o.classList.remove('selected'));
                // Add to clicked
                this.classList.add('selected');
                
                const id = this.getAttribute('data-id');
                const val = this.getAttribute('data-value');
                
                // Note: Handle numeric values safely, although storing as string/number is fine
                answers[id] = isNaN(val) || val === '' || val === 'true' || val === 'false' ? val : Number(val);
                
                // Auto advance after short delay
                setTimeout(() => {
                    nextQuestion();
                }, 400);
            });
        });
    }
    
    function nextQuestion() {
        const q = questions[currentStep];
        
        // Validate
        if (answers[q.id] === undefined) {
            window.WealthWise.App.showNotification('Por favor, selecciona una opción', 'error');
            return;
        }
        
        if (currentStep < questions.length - 1) {
            currentStep++;
            renderQuestion(currentStep);
        } else {
            calculateResults();
        }
    }
    
    function prevQuestion() {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion(currentStep);
        }
    }
    
    function resetQuiz() {
        currentStep = 0;
        answers = {};
        renderQuestion(currentStep);
    }
    
    function calculateResults() {
        const Utils = window.WealthWise.Utils;
        
        // Build Profile
        const riskScore = Utils.calculateRiskScore(answers);
        const riskProfileStr = Utils.getRiskProfile(riskScore);
        
        const profile = {
            ...answers,
            riskScore: riskScore,
            riskProfile: riskProfileStr,
            allocation: Utils.getAllocation(riskProfileStr)
        };
        
        // Save
        Utils.saveProfile(profile);
        
        // Show Results Screen temporarily
        showResultsScreen(profile);
    }
    
    function showResultsScreen(profile) {
        const Utils = window.WealthWise.Utils;
        window.WealthWise.App.navigateTo('quiz-results-section');
        
        const scoreEl = document.getElementById('result-score-value');
        const profileNameEl = document.getElementById('result-profile-name');
        const circleEl = document.getElementById('result-score-circle');
        const dashBtn = document.getElementById('btn-view-dashboard');
        
        // Set profile name and color
        profileNameEl.textContent = Utils.getRiskProfileLabel(profile.riskProfile);
        profileNameEl.style.color = Utils.getRiskProfileColor(profile.riskProfile);
        
        // Animate Circle & Score
        const circumference = 2 * Math.PI * 61; // r=61
        const offset = circumference - (profile.riskScore / 100) * circumference;
        
        circleEl.style.strokeDashoffset = offset;
        circleEl.style.stroke = Utils.getRiskProfileColor(profile.riskProfile);
        
        // Animate number
        let current = 0;
        const target = profile.riskScore;
        const duration = 1500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const inc = target / steps;
        
        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            scoreEl.textContent = Math.round(current);
        }, stepTime);
        
        // Dashboard button
        if (dashBtn) {
            dashBtn.onclick = () => {
                window.WealthWise.App.navigateTo('dashboard-section');
            };
        }
    }
    
    function getCurrentAnswers() {
        return answers;
    }
    
    return {
        init,
        getCurrentAnswers,
        resetQuiz
    };
})();
