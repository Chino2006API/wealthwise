window.WealthWise = window.WealthWise || {};

window.WealthWise.Comparator = (function() {
    
    let currentYears = 20;
    let adjustInflation = true;
    let listenersSetup = false;
    
    const strategies = [
        { id: 'conservative', name: 'Conservadora', rate: 5.0, color: '#10b981', gradient: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.0)'], desc: '50% Bonos, 25% Acciones' },
        { id: 'moderate', name: 'Moderada', rate: 7.0, color: '#f59e0b', gradient: ['rgba(245, 158, 11, 0.4)', 'rgba(245, 158, 11, 0.0)'], desc: '30% Bonos, 45% Acciones' },
        { id: 'aggressive', name: 'Agresiva', rate: 9.0, color: '#ef4444', gradient: ['rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0.0)'], desc: '15% Bonos, 60% Acciones' },
        { id: 'bank', name: 'Banco Tradicional', rate: 0.5, color: '#3b82f6', gradient: ['rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.0)'], desc: 'Ahorro a plazo fijo' }
    ];

    function init() {
        if (!listenersSetup) {
            setupListeners();
            listenersSetup = true;
        }
        updateComparison();
    }
    
    function setupListeners() {
        const periodBtns = document.querySelectorAll('.period-btn');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                periodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentYears = parseInt(btn.getAttribute('data-period'));
                updateComparison();
            });
        });
        
        const inflationCheck = document.getElementById('comp-inflation');
        if (inflationCheck) {
            inflationCheck.addEventListener('change', (e) => {
                adjustInflation = e.target.checked;
                updateComparison();
            });
        }
    }
    
    function updateComparison() {
        const Utils = window.WealthWise.Utils;
        const initial = 10000;
        const monthly = 200;
        
        const datasets = [];
        const finalValues = {};
        
        const labels = Array.from({length: currentYears + 1}, (_, i) => `Año ${i}`);
        
        strategies.forEach(strat => {
            let data = Utils.compoundInterest(initial, monthly, strat.rate, currentYears);
            
            let points = data.yearlyData.map(d => d.value);
            
            if (adjustInflation) {
                points = points.map((val, idx) => Utils.inflationAdjust(val, idx, 3));
            }
            
            finalValues[strat.id] = points[points.length - 1];
            
            datasets.push({
                label: strat.name,
                data: points,
                borderColor: strat.color,
                gradientColors: strat.gradient
            });
        });
        
        window.WealthWise.Charts.createLineChart('comparator-chart', { labels, datasets });
        
        renderCards(finalValues, initial, monthly);
        renderAnalysis(finalValues, initial, monthly);
    }
    
    function renderCards(finalValues, initial, monthly) {
        const Utils = window.WealthWise.Utils;
        const container = document.getElementById('comparator-cards');
        if (!container) return;
        
        let html = '';
        
        strategies.forEach((strat, index) => {
            const finalVal = finalValues[strat.id];
            
            html += `
            <div class="card p-2 animate-fadeInUp delay-${index + 1}">
                <div class="flex-between mb-1">
                    <h4 class="mb-0">${strat.name}</h4>
                    <span class="badge badge-medium" style="background: ${strat.color}20; color: ${strat.color}">${strat.rate}% anual</span>
                </div>
                <p class="text-sm text-secondary mb-2">${strat.desc}</p>
                
                <div class="font-heading font-weight-700 text-lg mb-05" style="color: ${strat.color}">
                    ${Utils.formatCurrency(finalVal)}
                </div>
                <div class="text-xs text-muted">Valor proyectado a ${currentYears} años${adjustInflation ? ' (ajustado por inflación)' : ''}</div>
            </div>`;
        });
        
        container.innerHTML = html;
    }

    function renderAnalysis(finalValues, initial, monthly) {
        const Utils = window.WealthWise.Utils;
        const container = document.getElementById('comparator-analysis');
        if (!container) return;
        
        const totalInvested = initial + (monthly * 12 * currentYears);
        const bankFinal = finalValues['bank'];
        const moderateFinal = finalValues['moderate'];
        
        const costOfOpportunity = moderateFinal - bankFinal;
        
        // Calculate nominal bank value for comparison
        const rawBank = Utils.compoundInterest(initial, monthly, 0.5, currentYears).finalValue;
        const realBank = Utils.inflationAdjust(rawBank, currentYears, 3);
        
        let html = `
        <div class="card p-2 animate-fadeInUp" style="border: 1px solid rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.02);">
            <h3 class="mb-1 text-gold">💡 Análisis de tu Asesor Financiero</h3>
            
            <div class="grid-2">
                <div>
                    <p class="mb-1 text-primary" style="font-size: 1.05rem;">
                        Si aportas un capital inicial de <strong>${Utils.formatCurrency(initial)}</strong> y ahorras <strong>${Utils.formatCurrency(monthly)} al mes</strong> durante <strong>${currentYears} años</strong>, habrás invertido un total de <strong class="text-white">${Utils.formatCurrency(totalInvested)}</strong> de tu bolsillo.
                    </p>
                    
                    <p class="mb-1 text-secondary">Aquí te explicamos la diferencia de los resultados:</p>
                    
                    <div class="flex-col gap-1">
                        <div class="flex-row gap-1" style="align-items: flex-start;">
                            <span style="font-size: 1.5rem; line-height: 1;">🏦</span>
                            <div>
                                <strong class="text-primary">El Banco Tradicional (Plazo Fijo)</strong>
                                <p class="text-sm">
                                    Con un rendimiento promedio de 0.5% anual, al cabo de ${currentYears} años tendrías <strong>${Utils.formatCurrency(rawBank)}</strong> nominales. Sin embargo, al ajustar por una inflación anual promedio del 3%, el valor real (poder de compra) sería de solo <strong>${Utils.formatCurrency(realBank)}</strong>.
                                    <span class="text-red font-weight-500">Esto significa que tu dinero perdería valor real frente al costo de vida.</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex-row gap-1" style="align-items: flex-start;">
                            <span style="font-size: 1.5rem; line-height: 1;">📈</span>
                            <div>
                                <strong class="text-primary">Las Estrategias de Inversión (Conservadora, Moderada, Agresiva)</strong>
                                <p class="text-sm">
                                    Al invertir en activos reales (como acciones globales y bonos de calidad), tu dinero crece a tasas del 5% al 9% anual. Gracias al <strong>interés compuesto</strong>, tus ganancias vuelven a generar más ganancias. 
                                    En un portafolio <strong class="text-gold">Moderado</strong>, acumularías <strong>${Utils.formatCurrency(moderateFinal)}</strong>${adjustInflation ? ' (ya descontando la inflación)' : ''}, multiplicando tu esfuerzo de ahorro.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex-col justify-between gap-15">
                    <div class="comparison-box" style="margin-top: 0; background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
                        <h4 class="text-red mb-05" style="font-size: 1rem; font-weight: 700;">⚖️ El Costo de Oportunidad de No Invertir</h4>
                        <p class="text-sm text-secondary mb-1">
                            El Costo de Oportunidad representa la riqueza que "dejas ir" al elegir el camino aparentemente seguro de dejar tu dinero en una cuenta bancaria ordinaria en lugar de un portafolio de inversión diversificado.
                        </p>
                        <div class="flex-between">
                            <span class="text-secondary font-weight-500">Pérdida vs. Portafolio Moderado:</span>
                            <strong class="text-red font-heading" style="font-size: 1.5rem; font-weight: 700;">
                                ${Utils.formatCurrency(costOfOpportunity)}
                            </strong>
                        </div>
                    </div>
                    
                    <div class="card p-15" style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border);">
                        <h4 class="text-gold mb-05" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">⚖️ ¿Cuál estrategia elegir?</h4>
                        <ul class="text-sm text-secondary pl-1" style="list-style-type: circle;">
                            <li class="mb-05">Si necesitas este dinero en <strong>menos de 3-5 años</strong>, quédate en el <strong>Banco</strong> o la estrategia <strong>Conservadora</strong>.</li>
                            <li class="mb-05">Si inviertes a <strong>largo plazo (>10 años)</strong>, la estrategia <strong>Moderada o Agresiva</strong> multiplicará mucho más tu dinero, pero debes estar preparado para ver fluctuaciones temporales en el mercado sin vender por pánico.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
        
        container.innerHTML = html;
    }
    
    return { init };
})();
