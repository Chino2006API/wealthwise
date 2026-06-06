window.WealthWise = window.WealthWise || {};

window.WealthWise.Recommendations = (function() {
    
    const investmentTypes = [
        {
            id: 'government_bonds',
            name: 'Bonos del Gobierno',
            icon: '<span class="material-icons-outlined">account_balance</span>',
            category: 'Renta Fija',
            riskLevel: 1, // 1-5
            riskLabel: 'Muy Bajo',
            historicalReturn: '3-5%',
            description: 'Instrumentos de deuda emitidos por gobiernos. Son considerados la inversión más segura ya que están respaldados por la capacidad tributaria del gobierno.',
            whyRecommend: {
                ultra_conservative: 'Son la base ideal para tu perfil. Proporcionan estabilidad y retornos predecibles sin volatilidad.',
                conservative: 'Forman una parte importante de tu portafolio, brindando anclaje y estabilidad ante los vaivenes del mercado.',
                moderate: 'Proporcionan un contrapeso de estabilidad en tu portafolio diversificado.',
                aggressive: 'Una pequeña posición estratégica para reducir la volatilidad general.',
                very_aggressive: 'Mínima exposición sugerida solo para mantener algo de liquidez extra-segura.'
            },
            examples: ['iShares U.S. Treasury ETF (GOVT)', 'Vanguard Short-Term Treasury (VGSH)', 'TIPS (Protegidos contra inflación)'],
            pros: ['Máxima seguridad', 'Retornos predecibles', 'Liquidez inmediata', 'Protección en crisis bursátiles'],
            cons: ['Retornos bajos', 'Pueden no superar la inflación a largo plazo', 'Sensibles a subidas de tasas de interés']
        },
        {
            id: 'corporate_bonds',
            name: 'Bonos Corporativos',
            icon: '<span class="material-icons-outlined">business</span>',
            category: 'Renta Fija',
            riskLevel: 2,
            riskLabel: 'Bajo',
            historicalReturn: '4-6%',
            description: 'Deuda emitida por empresas para financiar sus operaciones. Ofrecen mayores rendimientos que los bonos del gobierno asumiendo un riesgo levemente mayor.',
            whyRecommend: {
                ultra_conservative: 'Complementan tus bonos gubernamentales con un rendimiento extra manteniendo alta seguridad.',
                conservative: 'Aumentan tu retorno potencial sin agregar volatilidad extrema propia de las acciones.',
                moderate: 'El componente principal de tu renta fija que balancea crecimiento y seguridad.',
                aggressive: 'Tu exposición principal a renta fija para obtener ingresos predecibles.',
                very_aggressive: 'Mínima exposición, ya que buscas maximizar crecimiento sobre generación de ingresos fijos.'
            },
            examples: ['Vanguard Total Bond Market ETF (BND)', 'iShares Corporate Bond ETF (LQD)'],
            pros: ['Mejor rendimiento que deuda pública', 'Pagos regulares de interés (cupones)', 'Menos volátiles que las acciones'],
            cons: ['Riesgo de crédito (si la empresa quiebra)', 'Sensibles a condiciones macroeconómicas']
        },
        {
            id: 'sp500_index',
            name: 'Índice S&P 500 (Acciones Grandes)',
            icon: '<span class="material-icons-outlined">show_chart</span>',
            category: 'Renta Variable',
            riskLevel: 3,
            riskLabel: 'Moderado',
            historicalReturn: '8-10%',
            description: 'Fondo indexado que replica las 500 empresas más grandes de EE.UU. Es la forma más popular, eficiente y recomendada de invertir en acciones para principiantes.',
            whyRecommend: {
                ultra_conservative: 'Una pequeña exposición te permite protegerte contra la inflación y participar del crecimiento económico.',
                conservative: 'Componente esencial para asegurar que tu capital crezca más rápido que el costo de vida.',
                moderate: 'La columna vertebral de tu portafolio. Balance perfecto entre diversificación y crecimiento a largo plazo.',
                aggressive: 'Tu motor principal de crecimiento. Históricamente, las grandes empresas superan a la mayoría de otras inversiones.',
                very_aggressive: 'Componente central indiscutible. Necesitas alta exposición al mercado bursátil para cumplir tus objetivos ambiciosos.'
            },
            examples: ['Vanguard S&P 500 ETF (VOO)', 'SPDR S&P 500 ETF Trust (SPY)', 'iShares Core S&P 500 ETF (IVV)'],
            pros: ['Diversificación automática (500 empresas de golpe)', 'Comisiones bajísimas', 'Rendimiento histórico comprobado de +100 años', 'No requiere elegir empresas individuales'],
            cons: ['Volatilidad a corto plazo (puede caer 20% en un año malo)', 'Concentrado en economía estadounidense']
        },
        {
            id: 'international_stocks',
            name: 'Acciones Internacionales',
            icon: '<span class="material-icons-outlined">public</span>',
            category: 'Renta Variable',
            riskLevel: 4,
            riskLabel: 'Alto',
            historicalReturn: '6-9%',
            description: 'Fondos que invierten en empresas fuera de EE.UU., incluyendo Europa, Japón y mercados emergentes. Proporcionan diversificación geográfica global.',
            whyRecommend: {
                ultra_conservative: 'No recomendado para mantener la máxima estabilidad del portafolio.',
                conservative: 'Pequeña exposición para no depender 100% de la economía de un solo país.',
                moderate: 'Importante diversificador global que reduce el riesgo geográfico de tu portafolio.',
                aggressive: 'Componente clave para crecimiento global y captura de oportunidades en mercados emergentes.',
                very_aggressive: 'Alta exposición requerida para maximizar retornos a nivel mundial y aprovechar ineficiencias de mercado.'
            },
            examples: ['Vanguard Total International Stock ETF (VXUS)', 'iShares MSCI ACWI ex US (ACWX)'],
            pros: ['Diversificación geográfica real', 'Acceso a economías de rápido crecimiento', 'Reduce dependencia del mercado estadounidense'],
            cons: ['Riesgo cambiario (fluctuaciones de moneda)', 'Riesgo político y regulatorio', 'Históricamente (última década) menor retorno que EE.UU.']
        },
        {
            id: 'reits',
            name: 'Bienes Raíces (REITs)',
            icon: '<span class="material-icons-outlined">apartment</span>',
            category: 'Alternativos',
            riskLevel: 3,
            riskLabel: 'Moderado',
            historicalReturn: '7-9%',
            description: 'Fideicomisos de inversión inmobiliaria (REITs). Te permiten ser "dueño" de fracciones de centros comerciales, oficinas y apartamentos sin comprar inmuebles físicos.',
            whyRecommend: {
                ultra_conservative: 'No recomendado debido a su volatilidad inherente similar a las acciones.',
                conservative: 'Mínima exposición para diversificar fuera de activos financieros tradicionales.',
                moderate: 'Excelente generador de ingresos (dividendos) que se comporta diferente a las acciones y bonos.',
                aggressive: 'Exposición significativa para potenciar el crecimiento y generar alto flujo de caja.',
                very_aggressive: 'Fuerte componente alternativo para máxima generación de riqueza e ingresos pasivos.'
            },
            examples: ['Vanguard Real Estate ETF (VNQ)', 'Schwab US REIT ETF (SCHH)'],
            pros: ['Altos dividendos por ley (deben repartir 90% de sus ganancias)', 'Protección natural contra la inflación', 'Acceso al mercado inmobiliario con poco dinero y sin lidiar con inquilinos'],
            cons: ['Muy sensibles a los cambios en tasas de interés', 'Sujetos a ciclos económicos (recesiones afectan ocupación)']
        },
        {
            id: 'cash_equivalents',
            name: 'Efectivo y Mercado Monetario',
            icon: '<span class="material-icons-outlined">payments</span>',
            category: 'Liquidez',
            riskLevel: 1,
            riskLabel: 'Muy Bajo',
            historicalReturn: '2-4%',
            description: 'Fondos de muy alta liquidez y nulo riesgo que pagan un pequeño interés. Sirven como estacionamiento seguro de capital.',
            whyRecommend: {
                ultra_conservative: 'Gran porción de tu capital debe estar aquí para garantizar liquidez total y cero pérdida de principal.',
                conservative: 'Reserva importante para aprovechar oportunidades de compra si los mercados caen.',
                moderate: 'Colchón de seguridad táctico.',
                aggressive: 'Mínimo necesario para rebalanceo y gastos de transacción.',
                very_aggressive: 'Posición residual, el dinero en efectivo pierde valor real por la inflación.'
            },
            examples: ['Fondos Money Market (VMFXX)', 'Cuentas de ahorro de alto rendimiento (HYSA)'],
            pros: ['Cero riesgo de pérdida nominal', 'Liquidez inmediata', 'Tranquilidad psicológica absoluta'],
            cons: ['Pérdida garantizada de poder adquisitivo a largo plazo frente a la inflación', 'Retornos mínimos']
        }
    ];

    function init() {
        // Handle expanding cards using event delegation
        const container = document.getElementById('recommendations-container');
        if (container) {
            container.addEventListener('click', (e) => {
                const header = e.target.closest('.rec-card-header');
                if (header) {
                    const card = header.closest('.rec-card');
                    card.classList.toggle('expanded');
                }
            });
        }
    }
    
    function render(profile) {
        if (!profile) return;
        
        const container = document.getElementById('recommendations-container');
        if (!container) return;
        
        const Utils = window.WealthWise.Utils;
        const subtitle = document.getElementById('recs-subtitle');
        if (subtitle) {
            subtitle.innerHTML = `Basado en tu perfil <strong>${Utils.getRiskProfileLabel(profile.riskProfile)}</strong>, esta es tu cartera recomendada.`;
        }
        
        // Map allocation keys to investment IDs
        const allocationMap = {
            'bonds': ['government_bonds', 'corporate_bonds'],
            'stocks': ['sp500_index', 'international_stocks'],
            'reits': ['reits'],
            'cash': ['cash_equivalents']
        };
        
        const currentAlloc = profile.allocation;
        let html = '';
        let delay = 1;
        
        // Distribute percentage internally
        const targetPortfolio = [
            { id: 'government_bonds', pct: currentAlloc.bonds * 0.6 }, // 60% of bonds to gov
            { id: 'corporate_bonds', pct: currentAlloc.bonds * 0.4 },  // 40% to corp
            { id: 'sp500_index', pct: currentAlloc.stocks * 0.7 },     // 70% of stocks to US
            { id: 'international_stocks', pct: currentAlloc.stocks * 0.3 }, // 30% to Intl
            { id: 'reits', pct: currentAlloc.reits },
            { id: 'cash_equivalents', pct: currentAlloc.cash }
        ].filter(item => item.pct > 0).sort((a, b) => b.pct - a.pct); // sort by highest %
        
        targetPortfolio.forEach((item, index) => {
            const inv = investmentTypes.find(i => i.id === item.id);
            if (inv) {
                html += createCardHtml(inv, item.pct, profile.riskProfile, delay);
                delay++;
            }
        });
        
        container.innerHTML = html;
    }
    
    function createCardHtml(inv, percentage, riskProfile, delayIndex) {
        // Risk dots HTML
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            let className = 'risk-dot';
            if (i <= inv.riskLevel) {
                className += ' filled';
                if (inv.riskLevel <= 2) className += ' low';
                if (inv.riskLevel >= 4) className += ' high';
            }
            dots += `<div class="${className}"></div>`;
        }
        
        // Lists
        const examplesList = inv.examples.map(ex => `<span class="rec-card-example">${ex}</span>`).join('');
        const prosList = inv.pros.map(pro => `<li>${pro}</li>`).join('');
        const consList = inv.cons.map(con => `<li>${con}</li>`).join('');
        
        const why = inv.whyRecommend[riskProfile] || inv.description;
        
        return `
        <div class="card rec-card animate-fadeInUp delay-${Math.min(delayIndex, 5)}">
            <div class="rec-card-header">
                <div class="rec-card-icon">${inv.icon}</div>
                <div class="rec-card-title">
                    <div class="flex-between">
                        <h3>${inv.name}</h3>
                        <span class="font-heading font-weight-700 text-gold" style="font-size: 1.25rem;">${percentage.toFixed(0)}%</span>
                    </div>
                    <div class="flex-row gap-1">
                        <span class="badge badge-category">${inv.category}</span>
                        <div class="rec-card-risk">
                            <span class="text-xs text-muted mr-1">Riesgo: ${inv.riskLabel}</span>
                            ${dots}
                        </div>
                    </div>
                </div>
                <div class="rec-card-toggle">▼</div>
            </div>
            
            <div class="rec-card-body">
                <p class="mb-1">${inv.description}</p>
                
                <div class="rec-card-section">
                    <h4>Por qué te lo recomendamos</h4>
                    <p class="text-primary">${why}</p>
                </div>
                
                <div class="grid-2 mt-2 gap-1">
                    <div class="rec-card-section mt-0">
                        <h4>Retorno Histórico Esperado</h4>
                        <div class="font-heading font-weight-600 text-green" style="font-size: 1.1rem;">${inv.historicalReturn} anual</div>
                    </div>
                    <div class="rec-card-section mt-0">
                        <h4>Ejemplos (ETFs / Fondos)</h4>
                        <div class="rec-card-examples">
                            ${examplesList}
                        </div>
                    </div>
                </div>
                
                <div class="pros-cons mt-2">
                    <div>
                        <h4 class="text-sm text-secondary mb-05">Ventajas</h4>
                        <ul class="pros-list">
                            ${prosList}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-sm text-secondary mb-05">Riesgos / Desventajas</h4>
                        <ul class="cons-list">
                            ${consList}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    return {
        init,
        render
    };
})();
