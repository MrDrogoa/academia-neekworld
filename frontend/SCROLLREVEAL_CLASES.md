# 🎨 ScrollReveal - Clases CSS Directas

## 📖 Guía de Uso Rápido

### 1️⃣ **Inicializar ScrollReveal en tu App**

Agrega esto en tu `App.vue` o `main.js`:

```vue
<!-- App.vue -->
<script setup>
import { onMounted } from 'vue';
import { initScrollRevealWithClasses } from '@/utils/scrollReveal';

onMounted(() => {
  // Inicializar ScrollReveal con todas las clases
  initScrollRevealWithClasses();
});
</script>
```

### 2️⃣ **Usar las clases directamente en tus componentes**

```vue
<template>
  <!-- ¡Solo agrega la clase y listo! -->
  <div class="sr-bottom">
    <h1>Este título aparece desde abajo</h1>
  </div>

  <div class="sr-left">
    <p>Este texto viene desde la izquierda</p>
  </div>

  <button class="sr-zoom sr-delay-400">
    Botón con zoom y delay
  </button>
</template>
```

---

## 🎯 Clases Disponibles

### **📍 Animaciones Básicas (Direccionales)**

| Clase | Efecto | Ejemplo |
|-------|--------|---------|
| `.sr-bottom` | Desde abajo | `<div class="sr-bottom">Contenido</div>` |
| `.sr-top` | Desde arriba | `<h1 class="sr-top">Título</h1>` |
| `.sr-left` | Desde la izquierda | `<img class="sr-left" src="...">` |
| `.sr-right` | Desde la derecha | `<p class="sr-right">Texto</p>` |
| `.sr-fade` | Fade in (sin dirección) | `<div class="sr-fade">Fade</div>` |
| `.sr-zoom` | Zoom in | `<button class="sr-zoom">Botón</button>` |

**Ejemplo:**
```vue
<section>
  <h1 class="sr-top">Título Principal</h1>
  <p class="sr-left">Descripción desde izquierda</p>
  <img class="sr-right" src="imagen.jpg">
  <button class="sr-zoom">Ver más</button>
</section>
```

---

### **⚡ Variaciones de Velocidad**

| Clase | Duración | Uso |
|-------|----------|-----|
| `.sr-slow` | 1500ms (lento) | Animaciones elegantes |
| `.sr-fast` | 600ms (rápido) | Animaciones dinámicas |

**Ejemplo:**
```vue
<div class="sr-bottom sr-slow">Aparece lentamente</div>
<div class="sr-bottom sr-fast">Aparece rápido</div>
```

---

### **⏱️ Delays Personalizados**

| Clase | Delay | Ejemplo |
|-------|-------|---------|
| `.sr-delay-100` | 100ms | Primer elemento |
| `.sr-delay-200` | 200ms | Segundo elemento |
| `.sr-delay-300` | 300ms | Tercer elemento |
| `.sr-delay-400` | 400ms | Cuarto elemento |
| `.sr-delay-500` | 500ms | Quinto elemento |
| `.sr-delay-600` | 600ms | Sexto elemento |
| `.sr-delay-800` | 800ms | - |
| `.sr-delay-1000` | 1000ms (1s) | Último elemento |

**Ejemplo - Secuencia manual:**
```vue
<div>
  <h1 class="sr-top">Título (200ms default)</h1>
  <p class="sr-fade sr-delay-400">Párrafo 1 (400ms)</p>
  <p class="sr-fade sr-delay-600">Párrafo 2 (600ms)</p>
  <button class="sr-zoom sr-delay-800">Botón (800ms)</button>
</div>
```

---

### **📋 Animaciones Secuenciales (Para Listas)**

| Clase | Descripción | Velocidad | Intervalo |
|-------|-------------|-----------|-----------|
| `.sr-sequence` | Secuencial normal | 800ms | 150ms entre items |
| `.sr-sequence-fast` | Secuencial rápido | 600ms | 100ms entre items |
| `.sr-sequence-slow` | Secuencial lento | 1000ms | 250ms entre items |

**Ejemplo - Lista de tarjetas:**
```vue
<template>
  <div class="cards-container">
    <!-- Cada hijo aparecerá uno tras otro -->
    <div class="card sr-sequence">Tarjeta 1</div>
    <div class="card sr-sequence">Tarjeta 2</div>
    <div class="card sr-sequence">Tarjeta 3</div>
    <div class="card sr-sequence">Tarjeta 4</div>
  </div>
</template>
```

**Ejemplo - Lista con v-for:**
```vue
<template>
  <div class="products">
    <div 
      v-for="product in products" 
      :key="product.id"
      class="product-card sr-sequence"
    >
      {{ product.name }}
    </div>
  </div>
</template>
```

---

### **🎪 Combinaciones Especiales**

| Clase | Efecto |
|-------|--------|
| `.sr-bottom-zoom` | Desde abajo con zoom |
| `.sr-left-fast` | Desde izquierda rápido |
| `.sr-right-slow` | Desde derecha lento |
| `.sr-top-zoom` | Desde arriba con zoom |

**Ejemplo:**
```vue
<div class="hero-section">
  <h1 class="sr-top-zoom">¡Bienvenido!</h1>
  <img class="sr-left-fast" src="logo.png">
  <p class="sr-bottom-zoom">Descripción impactante</p>
</div>
```

---

### **🌀 Animaciones con Rotación**

| Clase | Efecto |
|-------|--------|
| `.sr-rotate-left` | Rota desde izquierda |
| `.sr-rotate-right` | Rota desde derecha |
| `.sr-flip-horizontal` | Giro horizontal (flip) |
| `.sr-flip-vertical` | Giro vertical (flip) |

**Ejemplo:**
```vue
<div class="special-cards">
  <div class="card sr-rotate-left">Card con rotación</div>
  <div class="card sr-flip-horizontal">Card con flip</div>
</div>
```

---

### **📏 Escalas Personalizadas**

| Clase | Efecto |
|-------|--------|
| `.sr-scale-up` | Crece desde pequeño (0.5x) |
| `.sr-scale-down` | Encoge desde grande (1.5x) |

**Ejemplo:**
```vue
<div class="logo-container">
  <img class="sr-scale-up" src="logo.svg">
</div>
```

---

### **📝 Clases para Textos**

| Clase | Uso Recomendado |
|-------|-----------------|
| `.sr-title` | Títulos principales (h1, h2) |
| `.sr-subtitle` | Subtítulos (h3, h4) |
| `.sr-paragraph` | Párrafos de texto |

**Ejemplo:**
```vue
<article>
  <h1 class="sr-title">Título del Artículo</h1>
  <h3 class="sr-subtitle">Subtítulo descriptivo</h3>
  <p class="sr-paragraph">
    Contenido del artículo que aparece con fade in...
  </p>
</article>
```

---

### **🔘 Clase para Botones**

| Clase | Efecto |
|-------|--------|
| `.sr-button` | Animación optimizada para botones (zoom + delay) |

**Ejemplo:**
```vue
<div class="cta-section">
  <h2 class="sr-title">¿Listo para comenzar?</h2>
  <button class="btn btn-primary sr-button">
    Comenzar ahora
  </button>
</div>
```

---

### **🎴 Clase para Tarjetas (Cards)**

| Clase | Efecto |
|-------|--------|
| `.sr-card` | Animación optimizada para tarjetas (bottom + scale) |

**Ejemplo:**
```vue
<div class="courses-grid">
  <div class="course-card sr-card">
    <h3>Curso 1</h3>
    <p>Descripción...</p>
  </div>
  <div class="course-card sr-card">
    <h3>Curso 2</h3>
    <p>Descripción...</p>
  </div>
</div>
```

---

### **🔄 Animación Reset (se repite)**

| Clase | Efecto |
|-------|--------|
| `.sr-reset` | Se anima cada vez que entra al viewport |

**Ejemplo:**
```vue
<!-- Útil para elementos que se ven múltiples veces al hacer scroll -->
<div class="floating-badge sr-reset">
  ¡Oferta!
</div>
```

---

## 🎯 Ejemplos Completos por Tipo de Componente

### **📱 Página Home/Landing**

```vue
<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="sr-top">Bienvenido a NeekWorld</h1>
      <p class="sr-fade sr-delay-400">
        La mejor plataforma de aprendizaje
      </p>
      <button class="btn btn-primary sr-zoom sr-delay-600">
        Comenzar ahora
      </button>
    </section>

    <!-- Features Grid -->
    <section class="features">
      <div class="feature sr-sequence">
        <i class="icon"></i>
        <h3>Feature 1</h3>
      </div>
      <div class="feature sr-sequence">
        <i class="icon"></i>
        <h3>Feature 2</h3>
      </div>
      <div class="feature sr-sequence">
        <i class="icon"></i>
        <h3>Feature 3</h3>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <h2 class="sr-title">¿Listo para empezar?</h2>
      <button class="sr-button">Registrarse gratis</button>
    </section>
  </div>
</template>
```

---

### **📚 Catálogo de Cursos**

```vue
<template>
  <div class="course-catalog">
    <!-- Filtros -->
    <div class="filters sr-left">
      <v-select label="Categoría"></v-select>
      <v-select label="Nivel"></v-select>
    </div>

    <!-- Grid de Cursos -->
    <div class="courses-grid">
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="course-card sr-card"
      >
        <img :src="course.image" :alt="course.title">
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <button class="btn btn-add-to-cart">
          Agregar al carrito
        </button>
      </div>
    </div>
  </div>
</template>
```

---

### **👤 Perfil de Usuario**

```vue
<template>
  <div class="user-profile">
    <!-- Header -->
    <div class="profile-header sr-top">
      <v-avatar class="sr-zoom sr-delay-200">
        <img :src="user.avatar">
      </v-avatar>
      <h1 class="sr-fade sr-delay-400">{{ user.name }}</h1>
    </div>

    <!-- Estadísticas -->
    <div class="stats">
      <div class="stat-card sr-sequence">
        <h2>10</h2>
        <p>Cursos Completados</p>
      </div>
      <div class="stat-card sr-sequence">
        <h2>5</h2>
        <p>En Progreso</p>
      </div>
      <div class="stat-card sr-sequence">
        <h2>85%</h2>
        <p>Promedio</p>
      </div>
    </div>

    <!-- Cursos Recientes -->
    <section class="recent-courses">
      <h2 class="sr-title">Cursos Recientes</h2>
      <div 
        v-for="course in recentCourses" 
        :key="course.id"
        class="course-item sr-left"
      >
        {{ course.title }}
      </div>
    </section>
  </div>
</template>
```

---

### **📄 Página About/Nosotros**

```vue
<template>
  <div class="about-page">
    <!-- Intro -->
    <section class="intro">
      <h1 class="sr-title">Sobre NeekWorld</h1>
      <p class="sr-paragraph">
        Somos una plataforma dedicada a...
      </p>
    </section>

    <!-- Team -->
    <section class="team">
      <h2 class="sr-subtitle">Nuestro Equipo</h2>
      <div class="team-grid">
        <div class="member sr-sequence">
          <img src="...">
          <h3>John Doe</h3>
          <p>CEO</p>
        </div>
        <div class="member sr-sequence">
          <img src="...">
          <h3>Jane Smith</h3>
          <p>CTO</p>
        </div>
        <!-- más miembros... -->
      </div>
    </section>

    <!-- Valores -->
    <section class="values">
      <div class="value sr-left">
        <h3>Innovación</h3>
      </div>
      <div class="value sr-right">
        <h3>Calidad</h3>
      </div>
      <div class="value sr-left">
        <h3>Compromiso</h3>
      </div>
    </section>
  </div>
</template>
```

---

## 🎨 Combinando Clases

Puedes combinar múltiples clases para efectos personalizados:

```vue
<!-- Dirección + Velocidad -->
<div class="sr-left sr-fast">Rápido desde izquierda</div>

<!-- Dirección + Delay -->
<div class="sr-bottom sr-delay-600">Desde abajo con delay</div>

<!-- Zoom + Delay -->
<button class="sr-zoom sr-delay-800">Botón con zoom tardío</button>

<!-- Fade + Velocidad + Delay -->
<p class="sr-fade sr-slow sr-delay-400">
  Texto que aparece lento
</p>
```

---

## 🚀 Integración en App.vue

```vue
<template>
  <v-app>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
    <FooterComponents />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { initScrollRevealWithClasses } from '@/utils/scrollReveal';
import NavigationBar from '@/components/NavigationBar.vue';
import FooterComponents from '@/components/FooterComponents.vue';

onMounted(() => {
  // ✅ Inicializar ScrollReveal UNA SOLA VEZ
  initScrollRevealWithClasses();
});
</script>
```

---

## ⚠️ Importante

### ✅ **Hacer:**
1. Inicializar `initScrollRevealWithClasses()` UNA SOLA VEZ en `App.vue`
2. Usar las clases directamente en cualquier componente
3. Combinar clases para efectos personalizados
4. Usar `.sr-sequence` para listas dinámicas con `v-for`

### ❌ **NO Hacer:**
1. NO inicializar ScrollReveal en cada componente
2. NO usar delays muy largos (>1000ms)
3. NO animar demasiados elementos a la vez
4. NO usar animaciones en elementos críticos (formularios, botones importantes)

---

## 📱 Accesibilidad

Las animaciones están habilitadas por defecto en móviles y desktop. Si quieres deshabilitar en ciertos dispositivos, modifica `scrollReveal.js`:

```javascript
// En scrollReveal.js
export const initScrollRevealWithClasses = () => {
  const sr = ScrollReveal({
    reset: false,
    mobile: false,  // ❌ Deshabilitar en móviles
    desktop: true   // ✅ Solo en desktop
  });
  // ...
};
```

---

## 🎓 Resumen Rápido

| Tipo | Clases |
|------|--------|
| **Direcciones** | `sr-bottom`, `sr-top`, `sr-left`, `sr-right` |
| **Especiales** | `sr-fade`, `sr-zoom` |
| **Velocidad** | `sr-fast`, `sr-slow` |
| **Delays** | `sr-delay-100` hasta `sr-delay-1000` |
| **Secuencial** | `sr-sequence`, `sr-sequence-fast`, `sr-sequence-slow` |
| **Combinadas** | `sr-bottom-zoom`, `sr-left-fast`, `sr-right-slow` |
| **Rotación** | `sr-rotate-left`, `sr-rotate-right`, `sr-flip-*` |
| **Escalas** | `sr-scale-up`, `sr-scale-down` |
| **Textos** | `sr-title`, `sr-subtitle`, `sr-paragraph` |
| **Elementos** | `sr-button`, `sr-card` |
| **Reset** | `sr-reset` |

---

¡Ahora puedes usar ScrollReveal con solo agregar clases CSS! 🎉
