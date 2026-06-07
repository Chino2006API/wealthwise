# WealthWise — Tu Asesor Financiero Inteligente 💎

WealthWise es una aplicación web SPA (Single Page Application) enfocada en ayudar a usuarios principiantes e intermedios a entender sus finanzas, descubrir su perfil de riesgo y planificar su futuro mediante inversiones inteligentes. Todo esto bajo una experiencia de usuario fluida, elegante y con un diseño *Glassmorphism* moderno.

🔗 **[Visitar la Aplicación en Vivo](https://Chino2006API.github.io/wealthwise/)**

![WealthWise Screenshot](https://raw.githubusercontent.com/Chino2006API/wealthwise/main/glass_welcome.png) <!-- *Asegúrate de agregar capturas si lo deseas.* -->

## 🚀 Características Principales

1. **Evaluación de Perfil de Riesgo**: Un cuestionario interactivo que determina la tolerancia al riesgo, horizonte de inversión y conocimiento financiero del usuario para asignarle uno de 5 perfiles (desde Ultra Conservador hasta Muy Agresivo).
2. **Dashboard Personalizado**: Un panel de control central con un *Score* de Salud Financiera y un resumen gráfico de ingresos, gastos y distribución de portafolio.
3. **Fondo de Emergencia**: Una herramienta para calcular y trazar metas de ahorros de emergencia recomendadas (6 meses de gastos).
4. **Simulador de Interés Compuesto**: Un simulador visual interactivo que proyecta el crecimiento del dinero a largo plazo (escenarios pesimistas, esperados y optimistas) frente al banco y la inflación.
5. **Educación Financiera**: Un glosario y conjunto de guías con mitos, realidades y reglas de oro del dinero.
6. **Comparador de Estrategias**: Analiza el rendimiento frente a la inflación a través de 5, 10, 20 o 30 años.

## 🎨 Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 (Vanilla).
- **Diseño**: Arquitectura basada en variables CSS, Animaciones CSS y Estética *Glassmorphism* avanzada (Backdrop filters, Radial gradients, Dynamic orbs).
- **Lógica de Negocio**: Vanilla JavaScript (ES6+), implementando el patrón Módulo (IIFE) para separación de responsabilidades.
- **Gráficos**: [Chart.js](https://www.chartjs.org/) (Doughnut, Line y Bar charts) integrados con variables de estilo de la aplicación.
- **Iconografía**: [Material Icons Outlined](https://fonts.google.com/icons) de Google.

## 📁 Estructura del Proyecto

```text
wealthwise/
├── index.html               # Estructura principal (SPA)
├── css/
│   ├── styles.css           # Estilos base, variables de diseño y utilidades
│   ├── components.css       # Estilos específicos de tarjetas, botones y formularios
│   └── animations.css       # Transiciones y keyframes
└── js/
    ├── app.js               # Controlador principal de vistas y navegación
    ├── utils.js             # Cálculos financieros y formateadores lógicos
    ├── charts.js            # Wrapper de Chart.js con configuración visual
    ├── quiz.js              # Lógica de preguntas y cálculo de perfil
    ├── dashboard.js         # Renderizado de métricas y Score de Salud
    ├── simulator.js         # Motor matemático y gráfico del simulador
    ├── recommendations.js   # Generación de portafolios en base al riesgo
    ├── education.js         # Datos del centro educativo financiero
    ├── comparator.js        # Lógica del analizador a largo plazo
    └── chart.min.js         # Librería Chart.js minificada
```

## 🛠️ Instalación y Uso Local

Este proyecto no requiere de configuraciones de servidor complejas ni dependencias de `npm` (Node.js). Para ejecutarlo localmente:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Chino2006API/wealthwise.git
   ```
2. Entra al directorio:
   ```bash
   cd wealthwise
   ```
3. Ejecuta un servidor HTTP local para evitar problemas con módulos CORS (recomendado). Si tienes Python instalado puedes ejecutar:
   ```bash
   python -m http.server 8000
   ```
   *(O utilizar extensiones como "Live Server" en VSCode).*
4. Abre `http://localhost:8000` en tu navegador.

## 🛡️ Privacidad

WealthWise respeta la privacidad al **100%**. No requiere registro, ni conecta con APIs externas para enviar información. Todos los cálculos, variables y progresos del cuestionario se almacenan localmente en el navegador del usuario utilizando `localStorage`.

---

*Desarrollado con pasión para mejorar la educación financiera.*
