window.WealthWise = window.WealthWise || {};

window.WealthWise.Charts = (function() {
    
    const chartInstances = {};
    
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function(chart) {
            if (chart.config.options && chart.config.options.elements && chart.config.options.elements.center && chart.config.options.elements.center.text) {
                const ctx = chart.ctx;
                const centerConfig = chart.config.options.elements.center;
                const txt = centerConfig.text;
                const color = centerConfig.color || '#f1f5f9';
                let fillCol = color;
                if (color.startsWith('var(')) {
                    const varName = color.match(/var\((.*?)\)/)[1];
                    fillCol = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#f1f5f9';
                }
                
                ctx.save();
                const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                
                ctx.font = "bold 1.25rem 'Outfit', sans-serif";
                ctx.fillStyle = fillCol;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(txt, centerX, centerY);
                ctx.restore();
            }
        }
    };
    
    // Global Configurations (only if Chart is loaded)
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#94a3b8'; // text-secondary
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.register(centerTextPlugin);
    }

    function createDoughnutChart(canvasId, { labels, data, colors, centerText, centerColor }) {
        destroyChart(canvasId);
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const config = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: false // Custom HTML legend in dashboard
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 15, 28, 0.9)',
                        titleFont: { size: 14, family: 'Inter' },
                        bodyFont: { size: 14, family: 'Outfit', weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                elements: {
                    center: {
                        text: centerText,
                        color: centerColor || '#f1f5f9'
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        };
        
        if (typeof Chart !== 'undefined') {
            chartInstances[canvasId] = new Chart(canvas, config);
            return chartInstances[canvasId];
        }
        return null;
    }

    function createLineChart(canvasId, { labels, datasets }) {
        destroyChart(canvasId);
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        // Process datasets to add gradients if requested
        datasets.forEach(ds => {
            if (ds.gradientColors) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, ds.gradientColors[0]);
                gradient.addColorStop(1, ds.gradientColors[1]);
                ds.backgroundColor = gradient;
                ds.fill = true;
            }
            ds.tension = ds.tension || 0.4;
            ds.pointRadius = ds.pointRadius || 0;
            ds.pointHoverRadius = ds.pointHoverRadius || 6;
            ds.borderWidth = ds.borderWidth || 3;
        });

        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            color: '#94a3b8'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 15, 28, 0.9)',
                        titleFont: { size: 13, family: 'Inter', color: '#94a3b8' },
                        bodyFont: { size: 14, family: 'Inter', weight: '600' },
                        padding: 12,
                        cornerRadius: 8,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { 
                            display: false,
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                                if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                                return '$' + value;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        };
        
        if (typeof Chart !== 'undefined') {
            chartInstances[canvasId] = new Chart(canvas, config);
            return chartInstances[canvasId];
        }
        return null;
    }
    
    function createBarChart(canvasId, { labels, datasets }) {
        destroyChart(canvasId);
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(10, 15, 28, 0.9)',
                        cornerRadius: 8,
                    }
                },
                scales: {
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    },
                    y: { 
                        beginAtZero: true, 
                        border: { display: false },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        };
        
        if (typeof Chart !== 'undefined') {
            chartInstances[canvasId] = new Chart(canvas, config);
            return chartInstances[canvasId];
        }
        return null;
    }

    function destroyChart(canvasId) {
        if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
            delete chartInstances[canvasId];
        }
    }
    
    function updateChart(canvasId, newData) {
        if (chartInstances[canvasId]) {
            const chart = chartInstances[canvasId];
            chart.data = newData;
            chart.update();
        }
    }

    return {
        createDoughnutChart,
        createLineChart,
        createBarChart,
        destroyChart,
        updateChart
    };
})();
