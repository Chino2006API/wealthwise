window.WealthWise = window.WealthWise || {};

window.WealthWise.Education = (function() {
    
    const glossaryData = [
        { term: 'Acción (Stock)', icon: '<span class="material-icons-outlined">trending_up</span>', def: 'Unidad de propiedad en una corporación. Al comprar una acción, te conviertes en dueño (accionista) de una pequeña parte de esa empresa y tienes derecho a una fracción de sus activos y ganancias.', example: 'Si compras acciones de Apple, ganas si la empresa vende más iPhones y su valor en el mercado sube.' },
        { term: 'Bono (Bond)', icon: '<span class="material-icons-outlined">receipt_long</span>', def: 'Un préstamo que tú le haces a una empresa o a un gobierno. A cambio de tu dinero, ellos prometen devolverte el capital inicial en una fecha determinada (vencimiento) más pagos de intereses regulares (cupones).', example: 'Prestas $1,000 al gobierno a 10 años al 5%. Te pagan $50 anuales y al año 10 te devuelven tus $1,000.' },
        { term: 'ETF (Exchange Traded Fund)', icon: '<span class="material-icons-outlined">shopping_basket</span>', def: 'Un "paquete" de inversiones (acciones, bonos, etc.) que cotiza en la bolsa como si fuera una acción individual. Te permite comprar pequeños pedazos de cientos de empresas en una sola transacción.', example: 'Un ETF del S&P 500 te hace dueño de las 500 mejores empresas de USA comprando un solo "ticket".' },
        { term: 'Interés Compuesto', icon: '<span class="material-icons-outlined">ac_unit</span>', def: 'Es el interés que ganas sobre el interés previo, además de sobre tu dinero original. Es el motor principal para crear riqueza a largo plazo (efecto bola de nieve).', example: 'Inviertes $100 al 10%. Año 1: Tienes $110. Año 2: Ganas el 10% de $110, por lo que ahora tienes $121, no $120.' },
        { term: 'Diversificación', icon: '<span class="material-icons-outlined">pie_chart</span>', def: 'Estrategia de gestión de riesgo que consiste en mezclar una amplia variedad de inversiones en tu portafolio. "No poner todos los huevos en la misma canasta".', example: 'En lugar de invertir todo en Tesla, compras un ETF que tiene Tesla, hospitales, supermercados y bancos.' },
        { term: 'Inflación', icon: '<span class="material-icons-outlined">arrow_upward</span>', def: 'El aumento generalizado de los precios a lo largo del tiempo, que reduce el poder adquisitivo de tu dinero. Si no inviertes, la inflación se "come" tus ahorros.', example: 'Con $100 hoy compras un carrito de compras lleno; en 10 años, con esos mismos $100 comprarás la mitad.' },
        { term: 'Dividendos', icon: '<span class="material-icons-outlined">payments</span>', def: 'Un pago que hacen algunas empresas a sus accionistas, repartiendo una parte de sus ganancias como agradecimiento por confiar su dinero en ellos.', example: 'Coca-Cola paga dividendos regularmente. Si tienes sus acciones, recibes un pago en efectivo cada 3 meses.' },
        { term: 'Volatilidad', icon: '<span class="material-icons-outlined">stacked_line_chart</span>', def: 'La medida de qué tanto sube y baja el precio de una inversión en un período corto. Mucha volatilidad significa riesgo a corto plazo, pero a menudo mayor rentabilidad a largo plazo.', example: 'El precio del Bitcoin cambia un 5% diario (muy volátil), un bono de gobierno casi no cambia de precio (poco volátil).' },
        { term: 'Dollar Cost Averaging (DCA)', icon: '<span class="material-icons-outlined">calendar_month</span>', def: 'Estrategia donde inviertes una cantidad fija de dinero en intervalos regulares, sin importar si el mercado sube o baja. Elimina la emoción y el estrés de "adivinar el mejor momento".', example: 'Invertir $200 todos los días 15 del mes en un ETF del S&P 500 por 20 años consecutivos.' }
    ];
    
    const mythData = [
        { myth: 'Necesito mucho dinero para empezar', reality: 'Puedes comprar ETFs fraccionados con tan solo $5 dólares en la mayoría de los brokers modernos.', icon: '<span class="material-icons-outlined">payments</span>' },
        { myth: 'Invertir en bolsa es como ir al casino', reality: 'En el casino la casa siempre gana estadísticamente. En la bolsa, si compras índices diversificados y esperas, la estadística está 100% a tu favor a largo plazo.', icon: '<span class="material-icons-outlined">casino</span>' },
        { myth: 'Debo revisar mis inversiones todos los días', reality: 'Mirar el portafolio a diario genera ansiedad y lleva a malas decisiones emocionales. A menos que seas trader, revisa cada 3-6 meses.', icon: '<span class="material-icons-outlined">smartphone</span>' },
        { myth: 'El mejor momento para invertir ya pasó', reality: 'El mejor momento fue hace 20 años. El segundo mejor momento es hoy. Nunca es tarde para aprovechar el interés compuesto.', icon: '<span class="material-icons-outlined">hourglass_empty</span>' },
        { myth: 'Necesito ser un genio matemático o financiero', reality: 'Mantenerlo simple funciona mejor. Un portafolio aburrido de 2 o 3 fondos indexados de bajo costo supera a la gran mayoría de expertos.', icon: '<span class="material-icons-outlined">psychology</span>' },
        { myth: 'Si el mercado cae pierdo mi dinero', reality: 'Solo pierdes tu dinero si vendes por pánico. Mientras no vendas, solo tienes una "pérdida de papel" y posees la misma cantidad de acciones.', icon: '<span class="material-icons-outlined">trending_down</span>' }
    ];
    
    const rulesData = [
        { num: 1, title: 'La Regla del 50/30/20', desc: 'Divide tus ingresos netos mensualmente: 50% para Necesidades (renta, comida, luz), 30% para Deseos (salidas, hobbies), y 20% para Ahorro e Inversión.', ex: 'Es una plantilla flexible, si puedes invertir el 30% vivirás más libre el día de mañana.' },
        { num: 2, title: 'Págate a Ti Mismo Primero', desc: 'El error común es ahorrar lo que sobra a fin de mes (casi siempre es cero). Apenas recibas tu sueldo, transfiere automáticamente el 20% a tu cuenta de inversión.', ex: 'La automatización es el secreto del éxito financiero: si no lo ves, no lo gastas.' },
        { num: 3, title: 'Fondo de Emergencia Antes que Riesgo', desc: 'Nunca inviertas en acciones dinero que podrías necesitar para arreglar el coche o pagar gastos médicos el próximo mes.', ex: 'Mantén 3-6 meses de gastos en una cuenta separada y de alta disponibilidad.' },
        { num: 4, title: 'La Regla del 72', desc: 'Fórmula matemática rápida: Divide 72 entre tu tasa de retorno anual esperada, y sabrás en cuántos años tu dinero se duplicará.', ex: 'Si el S&P 500 te da un 9% anual histórico → 72 / 9 = 8. Tu dinero se duplicará cada 8 años.' },
        { num: 5, title: 'Cuidado con las Comisiones', desc: 'A largo plazo, las comisiones altas destruyen el interés compuesto. Invierte en instrumentos pasivos indexados (ETFs) con Expense Ratio menor al 0.20%.', ex: 'Un fondo mutuo de un banco tradicional te cobra 2% anual solo por gestionarlo. Un ETF de Vanguard cobra 0.03%.' },
        { num: 6, title: 'Invierte a Largo Plazo (>5 Años)', desc: 'Si necesitas el dinero en 2 años para comprar una casa, no lo inviertas en bolsa. Mantenlo en renta fija gubernamental.', ex: 'El mercado puede caer 30% en un año cualquiera, pero en periodos rodantes de 20 años históricamente nunca ha perdido dinero.' }
    ];
    
    const guidesData = [
        {
            title: "1. Construye tu base de seguridad",
            icon: '<span class="material-icons-outlined">shield</span>',
            steps: [
                "Abre una cuenta de ahorro de alto rendimiento separada de tu cuenta principal.",
                "Automatiza un depósito mensual hasta juntar 3 a 6 meses de tus gastos fijos.",
                "Usa este dinero SOLO para verdaderas emergencias (despidos, salud, reparaciones urgentes)."
            ]
        },
        {
            title: "2. Abre tu cuenta de inversión (Broker)",
            icon: '<span class="material-icons-outlined">account_balance</span>',
            steps: [
                "Investiga brokers regulados y de bajo costo en tu país (ej. Hapi, Interactive Brokers, eToro, GBM+).",
                "Completa tu registro y verifica tu identidad (proceso conocido como KYC).",
                "Fondea tu cuenta con tu primera transferencia bancaria (puede ser desde $10 USD)."
            ]
        },
        {
            title: "3. Haz tu primera compra (S&P 500)",
            icon: '<span class="material-icons-outlined">bar_chart</span>',
            steps: [
                "En el buscador de tu broker, escribe 'VOO', 'IVV' o 'SPY' (todos son ETFs del S&P 500).",
                "Selecciona la cantidad de dinero que deseas invertir o el número de fracciones de acción.",
                "Haz clic en 'Comprar' (Buy) a Precio de Mercado (Market Order). ¡Felicidades, ya eres dueño de las 500 mejores empresas!"
            ]
        },
        {
            title: "4. Automatiza y olvídate",
            icon: '<span class="material-icons-outlined">smart_toy</span>',
            steps: [
                "Configura depósitos recurrentes desde tu banco hacia el broker todos los meses.",
                "Si tu broker lo permite, programa compras automáticas del ETF seleccionado.",
                "No mires la aplicación todos los días. Deja que el interés compuesto haga el trabajo pesado por ti."
            ]
        }
    ];

    function init() {
        setupTabs();
        
        // Initial renders
        renderGlossary();
        renderMyths();
        renderRules();
        renderGuides();
        
        // Glossary Search
        const searchInput = document.getElementById('glossary-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => filterGlossary(e.target.value));
        }
        
        // Delegation for expanding glossary terms
        const glossContainer = document.getElementById('glossary-container');
        if (glossContainer) {
            glossContainer.addEventListener('click', (e) => {
                const termHeader = e.target.closest('h4');
                if (termHeader) {
                    const card = termHeader.closest('.glossary-term');
                    card.classList.toggle('open');
                }
            });
        }
    }
    
    function setupTabs() {
        const tabBtns = document.querySelectorAll('#education-section .tab-btn');
        const tabContents = document.querySelectorAll('#education-section .tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                
                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${target}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    function renderGlossary(filter = '') {
        const container = document.getElementById('glossary-container');
        if (!container) return;
        
        const lowerFilter = filter.toLowerCase();
        let html = '';
        
        const filtered = glossaryData.filter(item => 
            item.term.toLowerCase().includes(lowerFilter) || 
            item.def.toLowerCase().includes(lowerFilter)
        );
        
        if (filtered.length === 0) {
            html = `<div class="text-muted text-center grid-col-span-2">No se encontraron términos para "${filter}"</div>`;
        } else {
            filtered.forEach((item, index) => {
                html += `
                <div class="card glossary-term animate-fadeInUp delay-${Math.min(index + 1, 6)}">
                    <h4><span>${item.icon}</span> ${item.term}</h4>
                    <div class="glossary-term-def">
                        <p class="text-primary text-sm mb-1">${item.def}</p>
                        <div class="glossary-term-example">
                            <strong>💡 Ejemplo:</strong> ${item.example}
                        </div>
                    </div>
                </div>`;
            });
        }
        
        container.innerHTML = html;
    }
    
    function filterGlossary(term) {
        renderGlossary(term);
    }
    
    function renderMyths() {
        const container = document.getElementById('myths-container');
        if (!container) return;
        
        let html = '';
        mythData.forEach((item, index) => {
            html += `
            <div class="card p-0 myth-card animate-fadeInLeft delay-${Math.min(index, 6)}">
                <div class="myth-side">
                    <h4>Mito Común</h4>
                    <p class="text-primary font-weight-500">" ${item.myth} "</p>
                </div>
                <div class="reality-side">
                    <h4>Realidad ${item.icon}</h4>
                    <p class="text-primary">${item.reality}</p>
                </div>
            </div>`;
        });
        
        container.innerHTML = html;
    }
    
    function renderRules() {
        const container = document.getElementById('rules-container');
        if (!container) return;
        
        let html = '';
        rulesData.forEach((item, index) => {
            html += `
            <div class="card rule-card animate-fadeInUp delay-${Math.min(index + 1, 6)}">
                <div class="rule-number">${item.num}</div>
                <div class="rule-content">
                    <h4>${item.title}</h4>
                    <p class="text-sm mb-1">${item.desc}</p>
                    <div class="rule-example">
                        ${item.ex}
                    </div>
                </div>
            </div>`;
        });
        
        container.innerHTML = html;
    }
    
    function renderGuides() {
        const container = document.getElementById('guides-container');
        if (!container) return;
        
        let html = '';
        guidesData.forEach((guide, index) => {
            html += `
            <div class="card guide-card mb-2 animate-fadeInUp delay-${Math.min(index + 1, 6)}">
                <div class="guide-header">
                    <span class="guide-icon">${guide.icon}</span>
                    <span class="guide-title">${guide.title}</span>
                    <span class="guide-toggle">▼</span>
                </div>
                <div class="guide-body">
                    ${guide.steps.map((step, stepIdx) => `
                        <div class="guide-step">
                            <h4>Paso ${stepIdx + 1}</h4>
                            <p class="text-primary">${step}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        });
        
        container.innerHTML = html;
        
        // Add click listeners to headers for interactive accordion
        const headers = container.querySelectorAll('.guide-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const card = header.closest('.guide-card');
                card.classList.toggle('open');
            });
        });
    }
    
    return {
        init
    };
})();
