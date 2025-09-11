# 🎨 Guía de Estilos y Colores - Academia NeekWorld

## 📋 Índice
1. [Paleta de Colores](#-paleta-de-colores)
2. [Tipografía](#-tipografía)
3. [Componentes UI](#️-componentes-ui)
4. [Espaciado y Layout](#-espaciado-y-layout)
5. [Estados y Variaciones](#-estados-y-variaciones)
6. [Accesibilidad](#♿-accesibilidad)
7. [Responsive Design](#-responsive-design)
8. [Animaciones](#-animaciones)

---

## 🎨 Paleta de Colores

### Colores Primarios

#### **Azul Corporativo**
```css
--primary-blue: #373b8a;
```
- **Uso:** Títulos principales, elementos de marca, navegación
- **Aplicación:** Headers, títulos de sección, elementos destacados
- **Clases CSS:** `.txt-cursos`, `.title-card`, `.txt-title-card`

#### **Verde Acción**
```css
--action-green: #2ea357;
```
- **Uso:** Botones de acción principal, estados de éxito
- **Aplicación:** Botones "Agregar al carrito", confirmaciones
- **Clases CSS:** `.btn-add-to-cart`

### Colores Secundarios

#### **Gris Texto**
```css
--text-gray: #666666;
```
- **Uso:** Texto secundario, descripciones
- **Aplicación:** Párrafos, información adicional
- **Clases CSS:** `.txt-p`, `.sub-cursos`

#### **Azul Acento**
```css
--accent-cyan: #00d9ff;
--accent-blue: #21234a;
```
- **Uso:** Elementos interactivos, borders especiales
- **Aplicación:** Tarjetas de pasos, efectos hover
- **Clases CSS:** `.step-number`, bordes de tarjetas

### Sistema de Temas

#### **Modo Claro (Light Theme)**
```css
.v-theme--light {
  --background: #ffffff;
  --text-primary: #000000;
  --surface: #f5f5f5;
}
```

#### **Modo Oscuro (Dark Theme)**
```css
.v-theme--dark {
  --background: #121212;
  --text-primary: #e2e8f0;
  --surface: #1e1e1e;
}
```

#### **Alto Contraste**
```css
.high-contrast-mode {
  --background: #ffffff;
  --text-primary: #000000;
  --accent: #ffff00;
  --border: #000000;
  --border-width: 3px;
}
```

### Colores de Estado

#### **Niveles de Curso**
```css
--level-beginner: #4caf50;    /* Verde - Principiante */
--level-intermediate: #ff9800; /* Naranja - Intermedio */
--level-advanced: #f44336;     /* Rojo - Avanzado */
```

#### **Estados de Interacción**
```css
--success: #4caf50;
--warning: #ff9800;
--error: #f44336;
--info: #2196f3;
```

---

## 📝 Tipografía

### Fuentes Principales

#### **Montserrat** (Títulos y Headers)
```css
font-family: "Montserrat", sans-serif;
font-weight: 800; /* Extra Bold para títulos principales */
font-weight: 600; /* Semi Bold para subtítulos */
```
- **Uso:** Títulos principales, números de pasos, elementos destacados
- **Aplicación:** `.txt-cursos`, `.title-card`, `.step-number`

#### **DM Sans** (Texto Corporativo)
```css
font-family: "DM Sans", sans-serif;
font-weight: 400; /* Regular para texto normal */
font-weight: 600; /* Semi Bold para énfasis */
```
- **Uso:** Texto párrafos, campos de formulario, texto secundario
- **Aplicación:** `.txt-p`, `.sub-cursos`, `.txt-field`

### Jerarquía Tipográfica

#### **Títulos Principales**
```css
.txt-cursos {
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  color: #373b8a;
  font-size: clamp(2rem, 5vw, 3.5rem);
}
```

#### **Títulos de Tarjetas**
```css
.txt-title-card {
  font-family: "Montserrat", sans-serif;
  color: #373b8a;
  font-weight: 700;
  font-size: 1.25rem;
}
```

#### **Texto Párrafos**
```css
.txt-p {
  font-family: "DM Sans", sans-serif;
  color: #666666;
  font-size: 1rem;
  line-height: 1.5;
}
```

#### **Subtítulos**
```css
.sub-cursos {
  font-family: "DM Sans", sans-serif;
  color: #666666;
  font-size: 1.1rem;
}
```

### Sistema de Escalado de Texto
```css
/* Variables de escalado accesible */
html.text-scale-80 { font-size: 0.8rem; }
html.text-scale-90 { font-size: 0.9rem; }
html.text-scale-100 { font-size: 1rem; }    /* Default */
html.text-scale-110 { font-size: 1.1rem; }
html.text-scale-120 { font-size: 1.2rem; }
html.text-scale-130 { font-size: 1.3rem; }
```

---

## 🏗️ Componentes UI

### Botones

#### **Botón Acción Primaria**
```css
.btn-add-to-cart {
  background-color: #2ea357;
  color: white;
  border-radius: 16px;
  padding: 12px 16px;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(46, 163, 87, 0.3);
}

.btn-add-to-cart:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(46, 163, 87, 0.4);
}
```

#### **Botón Estado Secundario**
```css
.btn-in-cart {
  color: #4caf50;
  border: 2px solid #4caf50;
  background: transparent;
  border-radius: 16px;
  padding: 12px 16px;
}
```

### Tarjetas

#### **Tarjeta de Curso**
```css
.course-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

#### **Tarjeta de Pasos**
```css
.card-step {
  border: 3px solid #21234a;
  border-radius: 16px;
  padding: 2rem;
  background: transparent;
  transition: all 0.3s ease;
  position: relative;
}

.card-step:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 217, 255, 0.3);
}
```

### Campos de Formulario

#### **Estilo Base**
```css
.txt-field {
  font-family: "DM Sans", sans-serif;
}

.v-text-field, .v-select {
  border-radius: 8px;
  transition: border-color 0.3s ease;
}
```

### Chips y Badges

#### **Chips de Nivel**
```css
.v-chip {
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Colores según nivel */
.v-chip.level-beginner { background-color: #4caf50; }
.v-chip.level-intermediate { background-color: #ff9800; }
.v-chip.level-advanced { background-color: #f44336; }
```

---

## 📐 Espaciado y Layout

### Sistema de Grid (Bootstrap)

#### **Responsive Breakpoints**
```css
/* Mobile First */
.col-12           /* Móvil: 100% ancho */
.col-sm-6         /* Tablet pequeño: 50% ancho */
.col-md-4         /* Tablet: 33.33% ancho */
.col-lg-4         /* Desktop: 33.33% ancho */
.col-xl-3         /* Desktop grande: 25% ancho */
```

#### **Contenedores**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.container-fluid {
  width: 100%;
  padding: 0 1rem;
}
```

### Espaciado Consistente

#### **Padding y Margin**
```css
/* Sistema de espaciado */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }

/* Aplicación específica */
.py-5 { padding: 3rem 0; }      /* Secciones principales */
.px-4 { padding: 0 1.5rem; }    /* Contenido interno */
.mb-3 { margin-bottom: 1rem; }   /* Separación elementos */
```

### Layout de Componentes

#### **Header/Hero Section**
```css
.hero-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
```

#### **Sección de Tarjetas**
```css
.cards-section {
  padding: 3rem 0;
  gap: 2rem;
}
```

---

## 🎯 Estados y Variaciones

### Estados de Hover

#### **Elevación de Tarjetas**
```css
.course-card:hover,
.card-step:hover {
  transform: translateY(-8px);
  transition: transform 0.3s ease;
}
```

#### **Botones Interactivos**
```css
.btn-add-to-cart:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(46, 163, 87, 0.4);
}
```

### Estados de Carga

#### **Loading States**
```css
.v-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}
```

### Estados Deshabilitados

#### **Elementos Deshabilitados**
```css
.v-btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #e0e0e0;
}
```

---

## ♿ Accesibilidad

### Contraste de Colores

#### **Ratios de Contraste WCAG AA**
- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos gráficos: mínimo 3:1

#### **Combinaciones Aprobadas**
```css
/* Contraste Alto */
.high-contrast-mode {
  color: #000000;
  background: #ffffff;
  border: 3px solid #000000;
}

/* Modo Oscuro */
.v-theme--dark {
  color: #e2e8f0;
  background: #121212;
}
```

### Focus States

#### **Indicadores de Foco**
```css
:focus-visible {
  outline: 3px solid #2196f3;
  outline-offset: 2px;
  border-radius: 4px;
}

.course-card:focus {
  outline: 3px solid #2e8b57;
  outline-offset: 2px;
}
```

### Screen Reader Support

#### **Texto para Lectores de Pantalla**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 📱 Responsive Design

### Mobile First Approach

#### **Breakpoints**
```css
/* Extra Small (móviles) */
@media (max-width: 575.98px) {
  .step-number { font-size: 2.5rem; }
  .card-step { padding: 1.25rem; }
  .txt-cursos { font-size: 2rem; }
}

/* Small (móviles horizontales) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .step-number { font-size: 3rem; }
  .card-step { padding: 1.5rem; }
}

/* Medium (tablets) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .step-number { font-size: 3.5rem; }
  .card-step { padding: 1.75rem; }
}

/* Large (desktops) */
@media (min-width: 992px) {
  .step-number { font-size: 4rem; }
  .card-step { padding: 2rem; }
}
```

### Grid Responsive

#### **Layout Adaptativo**
```css
/* Tarjetas de Curso */
.course-grid {
  grid-template-columns: 1fr;                    /* Móvil */
}

@media (min-width: 576px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);       /* Tablet */
  }
}

@media (min-width: 992px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);       /* Desktop */
  }
}
```

---

## ✨ Animaciones

### Transiciones Suaves

#### **Duración Estándar**
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

#### **Efectos de Hover**
```css
.interactive-element {
  transition: all var(--transition-normal);
}

.interactive-element:hover {
  transform: translateY(-5px);
}
```

### Efectos Especiales

#### **Gradientes Animados**
```css
.card-step::before {
  background: linear-gradient(45deg, #00d9ff, #0099cc, #00d9ff);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.card-step:hover::before {
  opacity: 1;
}
```

#### **Glow Effects**
```css
.step-number:hover {
  text-shadow: 0 0 20px #00d9ff;
  transform: scale(1.1);
}
```

### Preferencias de Movimiento

#### **Respeto por Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🔧 Implementación

### Clases Utilitarias Personalizadas

#### **Texto y Tipografía**
```css
.txt-cursos      /* Títulos principales azules */
.txt-title-card  /* Títulos de tarjetas */
.txt-p          /* Párrafos y texto secundario */
.txt-btn        /* Texto de botones */
.txt-field      /* Campos de formulario */
```

#### **Componentes Específicos**
```css
.btn-add-to-cart    /* Botón agregar al carrito */
.course-card        /* Tarjetas de cursos */
.card-step          /* Tarjetas de pasos */
.step-number        /* Números de pasos */
```

### Variables CSS Personalizadas

```css
:root {
  /* Colores */
  --primary-blue: #373b8a;
  --action-green: #2ea357;
  --text-gray: #666666;
  --accent-cyan: #00d9ff;
  
  /* Espaciado */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 3rem;
  
  /* Bordes */
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 20px;
  
  /* Sombras */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

## 📋 Checklist de Implementación

### ✅ Colores
- [ ] Verificar contraste WCAG AA
- [ ] Implementar modo oscuro
- [ ] Configurar alto contraste
- [ ] Definir estados de color

### ✅ Tipografía
- [ ] Cargar fuentes Montserrat y DM Sans
- [ ] Implementar escalado de texto
- [ ] Configurar jerarquía tipográfica
- [ ] Verificar legibilidad

### ✅ Componentes
- [ ] Estandarizar botones
- [ ] Unificar tarjetas
- [ ] Normalizar campos de formulario
- [ ] Implementar estados hover

### ✅ Responsive
- [ ] Probar en móviles
- [ ] Verificar tablets
- [ ] Optimizar desktop
- [ ] Validar accesibilidad

### ✅ Accesibilidad
- [ ] Implementar focus states
- [ ] Configurar screen readers
- [ ] Validar contraste
- [ ] Probar navegación por teclado

---

## 🚀 Próximos Pasos

1. **Documentar componentes específicos** (modals, navigation, etc.)
2. **Crear tokens de diseño** para Figma/Sketch
3. **Implementar design system** completo
4. **Automatizar testing visual** con herramientas como Chromatic
5. **Crear guía de iconografía** y elementos gráficos

---

*Última actualización: Septiembre 2025*
*Versión: 1.0*

---

## 📞 Contacto
Para dudas o sugerencias sobre esta guía de estilos, contacta al equipo de desarrollo.
