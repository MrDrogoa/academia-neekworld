# 📖 Guía Completa de ScrollReveal en el Proyecto

## ✅ Instalación Completada
```bash
npm install scrollreveal --save
```

## 📁 Archivos Creados

### 1. **Utilidad ScrollReveal** (`src/utils/scrollReveal.js`)
Contiene la configuración global y animaciones predefinidas.

### 2. **Componente de Ejemplo** (`src/components/examples/ScrollRevealExample.vue`)
Ejemplo completo de todas las animaciones disponibles.

---

## 🎨 Animaciones Disponibles

### **1. fromBottom** - Desde abajo
```javascript
sr.reveal('.elemento', animations.fromBottom);
```

### **2. fromTop** - Desde arriba
```javascript
sr.reveal('.elemento', animations.fromTop);
```

### **3. fromLeft** - Desde la izquierda
```javascript
sr.reveal('.elemento', animations.fromLeft);
```

### **4. fromRight** - Desde la derecha
```javascript
sr.reveal('.elemento', animations.fromRight);
```

### **5. fadeIn** - Aparecer con fade
```javascript
sr.reveal('.elemento', animations.fadeIn);
```

### **6. zoomIn** - Aparecer con zoom
```javascript
sr.reveal('.elemento', animations.zoomIn);
```

### **7. sequence** - Animación secuencial (listas)
```javascript
sr.reveal('.elemento', animations.sequence);
```

---

## 🚀 Uso en Componentes Vue

### **Método 1: Composition API (Recomendado)**

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initScrollReveal, animations } from '@/utils/scrollReveal';

let sr = null;

onMounted(() => {
  // Inicializar ScrollReveal
  sr = initScrollReveal();

  // Aplicar animaciones
  sr.reveal('.mi-elemento', {
    ...animations.fromBottom,
    delay: 200
  });
});

onUnmounted(() => {
  // Limpiar al desmontar
  if (sr) {
    sr.destroy();
  }
});
</script>
```

### **Método 2: Options API**

```vue
<script>
import { initScrollReveal, animations } from '@/utils/scrollReveal';

export default {
  data() {
    return {
      sr: null
    };
  },
  
  mounted() {
    this.sr = initScrollReveal();
    
    this.sr.reveal('.mi-elemento', {
      ...animations.fromLeft
    });
  },
  
  beforeUnmount() {
    if (this.sr) {
      this.sr.destroy();
    }
  }
};
</script>
```

---

## 📋 Ejemplos Prácticos

### **Ejemplo 1: Tarjetas con animación**

```vue
<template>
  <div class="cards-container">
    <div class="card reveal-card" v-for="card in cards" :key="card.id">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initScrollReveal, animations } from '@/utils/scrollReveal';

let sr = null;

onMounted(() => {
  sr = initScrollReveal();
  
  // Animación secuencial para cada tarjeta
  sr.reveal('.reveal-card', {
    ...animations.sequence,
    interval: 200  // 200ms entre cada tarjeta
  });
});

onUnmounted(() => {
  if (sr) sr.destroy();
});
</script>
```

### **Ejemplo 2: Secciones de página**

```vue
<template>
  <div>
    <section class="hero reveal-hero">
      <h1>Título Principal</h1>
    </section>
    
    <section class="features reveal-features">
      <div class="feature">Feature 1</div>
      <div class="feature">Feature 2</div>
      <div class="feature">Feature 3</div>
    </section>
    
    <section class="cta reveal-cta">
      <button>Call to Action</button>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initScrollReveal, animations } from '@/utils/scrollReveal';

let sr = null;

onMounted(() => {
  sr = initScrollReveal();
  
  // Hero desde arriba
  sr.reveal('.reveal-hero', {
    ...animations.fromTop,
    delay: 0,
    duration: 1200
  });
  
  // Features secuencial
  sr.reveal('.reveal-features .feature', {
    ...animations.sequence,
    interval: 150
  });
  
  // CTA con zoom
  sr.reveal('.reveal-cta', {
    ...animations.zoomIn,
    delay: 800
  });
});

onUnmounted(() => {
  if (sr) sr.destroy();
});
</script>
```

### **Ejemplo 3: Elementos diferentes en una sección**

```vue
<template>
  <section class="about-section">
    <h2 class="reveal-title">Sobre Nosotros</h2>
    <div class="content">
      <div class="image reveal-image">
        <img src="..." alt="Imagen">
      </div>
      <div class="text reveal-text">
        <p>Descripción...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initScrollReveal, animations } from '@/utils/scrollReveal';

let sr = null;

onMounted(() => {
  sr = initScrollReveal();
  
  // Título desde arriba
  sr.reveal('.reveal-title', animations.fromTop);
  
  // Imagen desde la izquierda
  sr.reveal('.reveal-image', {
    ...animations.fromLeft,
    delay: 200
  });
  
  // Texto desde la derecha
  sr.reveal('.reveal-text', {
    ...animations.fromRight,
    delay: 400
  });
});

onUnmounted(() => {
  if (sr) sr.destroy();
});
</script>
```

---

## ⚙️ Configuración Personalizada

### **Opciones disponibles:**

```javascript
sr.reveal('.elemento', {
  origin: 'bottom',      // 'top', 'right', 'bottom', 'left'
  distance: '60px',      // Distancia de desplazamiento
  duration: 1000,        // Duración en milisegundos
  delay: 200,            // Delay antes de iniciar
  interval: 0,           // Delay entre elementos (para múltiples)
  reset: false,          // Si true, anima cada vez que aparece
  opacity: 0,            // Opacidad inicial (0-1)
  scale: 1,              // Escala inicial (0-1)
  rotate: {              // Rotación inicial
    x: 0,
    y: 0,
    z: 0
  },
  easing: 'ease',        // Función de easing
  mobile: true,          // Habilitar en móviles
  desktop: true,         // Habilitar en desktop
  viewFactor: 0.2,       // Porcentaje visible para activar (0-1)
  viewOffset: {          // Offset del viewport
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});
```

### **Ejemplo de configuración avanzada:**

```javascript
sr.reveal('.elemento-custom', {
  origin: 'left',
  distance: '100px',
  duration: 1500,
  delay: 300,
  opacity: 0,
  scale: 0.8,
  rotate: { y: 15 },
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  reset: true,           // Se anima cada vez que entra en viewport
  viewFactor: 0.3        // Necesita 30% visible para activarse
});
```

---

## 🎯 Mejores Prácticas

### ✅ **DO - Hacer:**

1. **Siempre limpiar en onUnmounted:**
```javascript
onUnmounted(() => {
  if (sr) sr.destroy();
});
```

2. **Usar delays escalonados:**
```javascript
sr.reveal('.elemento-1', { delay: 0 });
sr.reveal('.elemento-2', { delay: 200 });
sr.reveal('.elemento-3', { delay: 400 });
```

3. **Usar `interval` para listas:**
```javascript
sr.reveal('.item', {
  ...animations.sequence,
  interval: 150
});
```

4. **Mantener durations razonables (600-1200ms):**
```javascript
sr.reveal('.elemento', {
  duration: 1000  // ✅ Bueno
});
```

### ❌ **DON'T - No hacer:**

1. **No animar demasiados elementos:**
```javascript
// ❌ Malo - sobrecarga
sr.reveal('*', animations.fromBottom);
```

2. **No usar delays muy largos:**
```javascript
// ❌ Malo - el usuario espera mucho
sr.reveal('.elemento', { delay: 5000 });
```

3. **No olvidar limpiar:**
```javascript
// ❌ Malo - memory leak
onMounted(() => {
  const sr = initScrollReveal();
  sr.reveal('.elemento', animations.fadeIn);
  // Falta onUnmounted con sr.destroy()
});
```

---

## 🔧 Troubleshooting

### **Problema: Las animaciones no funcionan**

**Solución:**
- Verifica que las clases existen en el DOM
- Comprueba que `onMounted` se ejecuta correctamente
- Revisa la consola por errores

### **Problema: Elementos no visibles inicialmente**

**Solución:**
```css
/* Agregar en tu CSS global */
.reveal-element {
  visibility: hidden;
}
```

### **Problema: Animaciones muy lentas en móvil**

**Solución:**
```javascript
sr.reveal('.elemento', {
  ...animations.fromBottom,
  mobile: false  // Deshabilitar en móviles
});
```

---

## 📱 Consideraciones de Accesibilidad

### **Respetar preferencias de usuario:**

```javascript
// Detectar si el usuario prefiere reducir movimiento
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

onMounted(() => {
  if (!prefersReducedMotion) {
    sr = initScrollReveal();
    sr.reveal('.elemento', animations.fromBottom);
  }
});
```

### **Integración con tu sistema de accesibilidad:**

```javascript
import { useAccessibility } from '@/composables/useAccessibility';

const { reducedMotion } = useAccessibility();

onMounted(() => {
  if (!reducedMotion.value) {
    sr = initScrollReveal();
    sr.reveal('.elemento', animations.fromBottom);
  }
});
```

---

## 🌟 Ejemplo Completo en HomeView

Ya aplicado en `src/views/HomeView.vue`:

```vue
<template>
  <div class="home-page home-view">
    <!-- Cards Section -->
    <section class="container m-auto my-5 reveal-cards">
      <CardsAcComponents />
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section reveal-cta">
      <h2 class="reveal-cta-title">¿Listo para empezar?</h2>
      <button class="reveal-cta-button">Comenzar ahora</button>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { initScrollReveal, animations } from '@/utils/scrollReveal';

let sr = null;

onMounted(() => {
  sr = initScrollReveal();
  
  sr.reveal('.reveal-cards', animations.fromLeft);
  sr.reveal('.reveal-cta-title', animations.fromTop);
  sr.reveal('.reveal-cta-button', animations.zoomIn);
});

onUnmounted(() => {
  if (sr) sr.destroy();
});
</script>
```

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://scrollrevealjs.org/
- **GitHub:** https://github.com/jlmakes/scrollreveal
- **Ejemplos avanzados:** https://scrollrevealjs.org/guide/

---

## 🎓 Próximos Pasos

1. **Prueba el ejemplo:** Carga `ScrollRevealExample.vue` en tu proyecto
2. **Aplica a tus componentes:** Usa las animaciones en `CourseCatalog`, `MyCourses`, etc.
3. **Personaliza:** Ajusta delays, durations y origins según tu diseño
4. **Optimiza:** Usa solo en elementos clave para mejor performance

---

¡ScrollReveal está listo para usar! 🚀
