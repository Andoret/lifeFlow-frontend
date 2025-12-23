# 💰 Mewa - Gestión de Gastos Personales

Una aplicación moderna y elegante para gestionar tus gastos personales de manera intuitiva. Mewa te ayuda a mantener el control de tus finanzas con una interfaz limpia y visualizaciones claras de tus gastos.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.6-007FFF?logo=mui&logoColor=white)

## ✨ Características

- 📊 **Visualización de Gastos**: Gráfica de pastel interactiva que muestra tu gasto vs disponible
- 💳 **Gestión de Presupuesto**: Controla tu margen de gastos de manera sencilla
- 🎨 **Diseño Moderno**: Interfaz elegante con Material-UI y tema personalizado
- 📱 **Responsive**: Optimizada para dispositivos móviles y desktop
- 🎤 **Entrada de Voz**: Agrega gastos rápidamente usando comandos de voz
- ⚡ **Rendimiento**: Construida con Vite para una experiencia ultrarrápida

## 🚀 Tecnologías Utilizadas

- **React 19.2.0** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **MUI X Charts** - Gráficas y visualizaciones
- **React Router** - Navegación
- **Emotion** - Estilos CSS-in-JS

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/app-v1.git
cd app-v1
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 📁 Estructura del Proyecto

```
app-v1/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── spendChart.tsx   # Gráfica de gastos
│   │   └── fallback.tsx     # Componente de carga
│   ├── views/               # Vistas de la aplicación
│   │   ├── Home.tsx         # Vista principal
│   │   └── home.styles.ts   # Estilos de la vista Home
│   ├── theme.ts             # Configuración del tema MUI
│   ├── App.tsx              # Componente raíz
│   └── main.tsx             # Punto de entrada
├── public/                  # Archivos estáticos
└── package.json             # Dependencias y scripts
```

## 🎨 Tema Personalizado

La aplicación utiliza un tema personalizado con una paleta de colores elegante:

- **Primary**: Azul oscuro (#112250) y dorado (#E0C58F)
- **Secondary**: Beige (#D9CBC2)
- **Background**: Azul (#3d5bcb) y beige claro (#F5f0e9)

## 📱 Características Responsive

- **Desktop**: Layout horizontal con gráfica y detalles lado a lado
- **Mobile**: Layout vertical optimizado, gráfica arriba y detalles abajo

## 🚧 Estado del Proyecto

Este proyecto está en desarrollo activo. Las funcionalidades principales están implementadas y se están agregando nuevas características regularmente.

## 📝 Licencia

Este proyecto es privado y personal.

---

Hecho con ❤️ por Daniel
