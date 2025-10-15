# 🚀 ScrollReveal - Inicio Rápido

## ✅ Ya está instalado y configurado

ScrollReveal se inicializa automáticamente en `App.vue`. Solo necesitas usar las clases CSS.

---

## 📝 Uso Básico - 3 Pasos

### **1. ScrollReveal ya está activo** (en App.vue)
```javascript
// Ya configurado en App.vue - no necesitas hacer nada
import { initScrollRevealWithClasses } from '@/utils/scrollReveal';
onMounted(() => {
  initScrollRevealWithClasses();
});
```

### **2. Agrega clases en tus componentes**
```vue
<template>
  <div class="sr-bottom">Este elemento aparece desde abajo</div>
</template>
```

### **3. ¡Listo! No necesitas JavaScript adicional**

---

## 🎯 Clases Más Usadas

| Clase | Uso |
|-------|-----|
| `sr-bottom` | Aparece desde abajo (más común) |
| `sr-top` | Aparece desde arriba (títulos) |
| `sr-left` | Aparece desde izquierda |
| `sr-right` | Aparece desde derecha |
| `sr-fade` | Fade in simple |
| `sr-zoom` | Aparece con zoom (botones, logos) |
| `sr-card` | Optimizado para tarjetas |
| `sr-sequence` | Para listas (items aparecen uno tras otro) |

---

## 💡 Ejemplos Prácticos para tu Proyecto

### **HomeView.vue - Hero Section**
```vue
<template>
  <section class="hero">
    <h1 class="sr-top">Bienvenido a NeekWorld</h1>
    <p class="sr-fade sr-delay-400">
      La mejor plataforma de aprendizaje
    </p>
    <button class="btn btn-primary sr-zoom sr-delay-600">
      Comenzar ahora
    </button>
  </section>
</template>
```

### **CourseCatalog.vue - Tarjetas de Cursos**
```vue
<template>
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
</template>
```

### **MyCourses.vue - Lista de Cursos**
```vue
<template>
  <div class="my-courses">
    <h1 class="sr-title">Mis Cursos</h1>
    
    <div 
      v-for="course in myCourses" 
      :key="course.id"
      class="course-item sr-sequence"
    >
      <h3>{{ course.title }}</h3>
      <p>Progreso: {{ course.progress }}%</p>
    </div>
  </div>
</template>
```

### **UserInfoComponents.vue - Perfil**
```vue
<template>
  <div class="user-profile">
    <v-avatar class="sr-zoom">
      <img :src="user.avatar">
    </v-avatar>
    
    <h2 class="sr-fade sr-delay-300">{{ user.name }}</h2>
    
    <div class="stats">
      <div class="stat sr-sequence">
        <h3>10</h3>
        <p>Cursos</p>
      </div>
      <div class="stat sr-sequence">
        <h3>5</h3>
        <p>En Progreso</p>
      </div>
      <div class="stat sr-sequence">
        <h3>85%</h3>
        <p>Promedio</p>
      </div>
    </div>
  </div>
</template>
```

### **FeatureComponents.vue - Features Grid**
```vue
<template>
  <section class="features">
    <h2 class="sr-title">Características</h2>
    
    <div class="features-grid">
      <div class="feature sr-sequence">
        <i class="icon mdi mdi-book"></i>
        <h3>Cursos de Calidad</h3>
        <p>Contenido premium</p>
      </div>
      
      <div class="feature sr-sequence">
        <i class="icon mdi mdi-account"></i>
        <h3>Instructores Expertos</h3>
        <p>Los mejores profesionales</p>
      </div>
      
      <div class="feature sr-sequence">
        <i class="icon mdi mdi-certificate"></i>
        <h3>Certificados</h3>
        <p>Reconocimiento oficial</p>
      </div>
    </div>
  </section>
</template>
```

---

## 🎨 Combinando Clases

Puedes combinar clases para efectos personalizados:

```vue
<!-- Dirección + Delay -->
<div class="sr-left sr-delay-400">Contenido</div>

<!-- Dirección + Velocidad -->
<div class="sr-bottom sr-fast">Rápido desde abajo</div>

<!-- Zoom + Delay -->
<button class="sr-zoom sr-delay-600">Botón</button>

<!-- Múltiples delays para secuencia manual -->
<h1 class="sr-top">Título</h1>
<p class="sr-fade sr-delay-300">Párrafo 1</p>
<p class="sr-fade sr-delay-500">Párrafo 2</p>
<button class="sr-zoom sr-delay-700">Botón</button>
```

---

## 📋 Cheat Sheet - Referencia Rápida

### **Direcciones Básicas**
```vue
<div class="sr-bottom">Desde abajo</div>
<div class="sr-top">Desde arriba</div>
<div class="sr-left">Desde izquierda</div>
<div class="sr-right">Desde derecha</div>
```

### **Efectos Especiales**
```vue
<div class="sr-fade">Fade in</div>
<div class="sr-zoom">Zoom in</div>
<div class="sr-card">Tarjeta</div>
```

### **Velocidades**
```vue
<div class="sr-bottom sr-fast">Rápido (600ms)</div>
<div class="sr-bottom">Normal (1000ms)</div>
<div class="sr-bottom sr-slow">Lento (1500ms)</div>
```

### **Delays**
```vue
<div class="sr-bottom sr-delay-100">100ms</div>
<div class="sr-bottom sr-delay-300">300ms</div>
<div class="sr-bottom sr-delay-500">500ms</div>
<div class="sr-bottom sr-delay-800">800ms</div>
```

### **Secuenciales (Listas)**
```vue
<!-- Cada hijo aparece con delay automático -->
<div class="item sr-sequence">Item 1</div>
<div class="item sr-sequence">Item 2</div>
<div class="item sr-sequence">Item 3</div>
```

### **Textos**
```vue
<h1 class="sr-title">Título</h1>
<h3 class="sr-subtitle">Subtítulo</h3>
<p class="sr-paragraph">Párrafo</p>
<button class="sr-button">Botón</button>
```

---

## 🎯 Recomendaciones por Componente

| Componente | Clases Recomendadas |
|------------|---------------------|
| **HomeView** | `sr-top`, `sr-fade`, `sr-zoom`, `sr-delay-*` |
| **CourseCatalog** | `sr-card`, `sr-sequence` |
| **MyCourses** | `sr-sequence`, `sr-left` |
| **UserProfile** | `sr-zoom`, `sr-fade`, `sr-sequence` |
| **Features** | `sr-sequence`, `sr-bottom` |
| **Footer** | `sr-bottom`, `sr-fade` |
| **Cards** | `sr-card` |
| **Botones CTA** | `sr-zoom`, `sr-button` |
| **Títulos** | `sr-title`, `sr-top` |
| **Listas** | `sr-sequence` |

---

## 🔍 Ver Demo Completa

Visita la página de demo para ver todas las animaciones en acción:

**Ruta:** `/scroll-reveal-demo`

**Archivo:** `src/views/ScrollRevealDemo.vue`

---

## ⚠️ Tips Importantes

### ✅ **Hacer:**
- Usa `sr-sequence` para listas con `v-for`
- Combina clases para efectos personalizados
- Usa delays escalonados para secuencias manuales
- Usa `sr-card` para tarjetas de cursos

### ❌ **No Hacer:**
- NO inicializar ScrollReveal en cada componente (ya está en App.vue)
- NO usar delays mayores a 1000ms
- NO animar TODOS los elementos (solo los importantes)
- NO combinar más de 3 clases a la vez

---

## 🎓 Resumen

**Para usar ScrollReveal:**
1. ✅ Ya está instalado (`npm install scrollreveal`)
2. ✅ Ya está configurado (en App.vue)
3. ✅ Solo agrega clases CSS en tus componentes

**Clase más común:**
```vue
<div class="sr-bottom">Contenido</div>
```

**Para listas:**
```vue
<div v-for="item in items" :key="item.id" class="sr-sequence">
  {{ item.name }}
</div>
```

---

¡Ahora puedes agregar animaciones increíbles con solo clases CSS! 🎉
