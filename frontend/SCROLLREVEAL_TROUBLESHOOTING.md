# 🔧 Solución de Problemas - ScrollReveal

## ❌ Problema: "Las animaciones no funcionan"

### **Síntomas:**
- Agregas la clase `sr-zoom`, `sr-bottom`, etc. pero no ves ninguna animación
- Los elementos aparecen normalmente sin efecto

### **Causas Comunes:**

#### 1️⃣ **ScrollReveal no está inicializado en App.vue**

**Verifica que tengas esto en `App.vue`:**

```vue
<script>
import { onMounted } from "vue";
import { initScrollRevealWithClasses } from "@/utils/scrollReveal";

export default {
  setup() {
    onMounted(() => {
      initScrollRevealWithClasses(); // ✅ Debe estar aquí
    });
  }
};
</script>
```

---

#### 2️⃣ **El componente se renderiza ANTES que ScrollReveal se inicialice**

**Problema:** Los componentes que están en la parte superior (como Hero) se renderizan inmediatamente y ScrollReveal no los detecta.

**Solución 1 - Reinicializar en el componente (Recomendado):**

```vue
<script setup>
import { onMounted, nextTick } from 'vue';
import ScrollReveal from 'scrollreveal';

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      const sr = ScrollReveal();
      
      // Reinicializar animaciones para este componente
      sr.reveal('.sr-zoom', {
        distance: '0px',
        duration: 1000,
        delay: 200,
        scale: 0.85,
        opacity: 0
      });
      
      sr.reveal('.sr-left', {
        origin: 'left',
        distance: '80px',
        duration: 1000,
        delay: 300,
        opacity: 0
      });
    }, 100);
  });
});
</script>
```

**Solución 2 - Usar `viewOffset` para activar antes:**

```javascript
// En scrollReveal.js
sr.reveal('.sr-zoom', {
  distance: '0px',
  duration: 1000,
  scale: 0.85,
  opacity: 0,
  viewOffset: {
    top: 200  // Activa 200px antes de entrar al viewport
  }
});
```

---

#### 3️⃣ **Elemento no visible inicialmente**

**Problema:** El elemento está fuera del viewport (abajo) pero ScrollReveal no lo detecta.

**Solución - Scroll hacia abajo y vuelve a subir:**

Si el elemento está en la parte superior de la página, ya está visible cuando se carga, por lo que ScrollReveal puede no animarlo.

**Opciones:**
1. Usa `reset: true` para que se anime cada vez
2. Usa `viewFactor: 0` para que se active inmediatamente
3. Agrega `viewOffset` para detectarlo antes

```javascript
sr.reveal('.sr-zoom', {
  distance: '0px',
  duration: 1000,
  scale: 0.85,
  opacity: 0,
  reset: false,
  viewFactor: 0,  // Se activa sin importar cuánto esté visible
});
```

---

#### 4️⃣ **Conflicto con CSS existente**

**Problema:** Tienes CSS que fuerza `opacity: 1` o `transform` en el elemento.

**Solución - Verifica tu CSS:**

```css
/* ❌ MALO - Sobrescribe ScrollReveal */
.hero-image-container {
  opacity: 1 !important;
  transform: none !important;
}

/* ✅ BUENO - Deja que ScrollReveal maneje opacity y transform */
.hero-image-container {
  /* No toques opacity ni transform aquí */
}
```

---

#### 5️⃣ **Elemento dentro de un v-if o v-show**

**Problema:** El elemento no existe en el DOM cuando ScrollReveal se inicializa.

**Solución - Observar cambios en el DOM:**

```vue
<script setup>
import { watch, nextTick } from 'vue';
import ScrollReveal from 'scrollreveal';

const showElement = ref(false);

watch(showElement, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const sr = ScrollReveal();
      sr.reveal('.sr-zoom', { /* config */ });
    });
  }
});
</script>
```

---

#### 6️⃣ **Clase mal escrita**

**Problema:** Typo en la clase CSS.

```vue
<!-- ❌ MALO -->
<div class="sr-zom">...</div>      <!-- Falta una 'o' -->
<div class="sr zoom">...</div>     <!-- Espacio en vez de guion -->
<div class="sr_zoom">...</div>     <!-- Guion bajo en vez de guion -->

<!-- ✅ BUENO -->
<div class="sr-zoom">...</div>
```

---

## 🛠️ Debugging - Cómo diagnosticar

### **Paso 1: Verifica que ScrollReveal está cargado**

Abre la consola del navegador (F12) y escribe:

```javascript
console.log(ScrollReveal);
```

**Resultado esperado:** Debería mostrar una función, no `undefined`.

---

### **Paso 2: Verifica que initScrollRevealWithClasses() se ejecutó**

En `App.vue`, agrega un console.log:

```javascript
onMounted(() => {
  console.log('Inicializando ScrollReveal...');
  initScrollRevealWithClasses();
  console.log('ScrollReveal inicializado ✅');
});
```

---

### **Paso 3: Inspecciona el elemento en DevTools**

1. Haz clic derecho en el elemento → "Inspeccionar"
2. Verifica que tiene la clase `sr-zoom` (o la que uses)
3. Mira el estilo computado: debería tener `opacity: 0` inicialmente

---

### **Paso 4: Verifica en la consola si hay errores de ScrollReveal**

Busca errores rojos en la consola del navegador que mencionen "ScrollReveal" o "sr-".

---

## ✅ Solución Definitiva para HeroComponents

Si tienes un componente Hero que aparece inmediatamente (en la parte superior), usa esta configuración:

```vue
<template>
  <section class="hero-section">
    <div class="hero-image-container sr-zoom">
      <img :src="imgSrc" alt="Hero" />
    </div>
    <h1 class="hero-title sr-left">Título</h1>
    <p class="hero-subtitle sr-left">Subtítulo</p>
    <button class="btn sr-bottom">Botón</button>
  </section>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import ScrollReveal from 'scrollreveal';

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      const sr = ScrollReveal();
      
      // Imagen con zoom
      sr.reveal('.sr-zoom', {
        distance: '0px',
        duration: 1200,
        delay: 0,      // Sin delay inicial
        scale: 0.85,
        opacity: 0,
        viewFactor: 0  // Se activa inmediatamente
      });
      
      // Título desde izquierda
      sr.reveal('.sr-left', {
        origin: 'left',
        distance: '80px',
        duration: 1000,
        delay: 300,
        opacity: 0,
        viewFactor: 0
      });
      
      // Botones desde abajo
      sr.reveal('.sr-bottom', {
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 600,
        opacity: 0,
        viewFactor: 0
      });
    }, 100);  // Pequeño delay para asegurar el DOM
  });
});
</script>
```

---

## 🎯 Configuración Recomendada por Tipo de Elemento

### **Elementos en la parte SUPERIOR de la página:**
```javascript
sr.reveal('.elemento', {
  // ... configuración
  viewFactor: 0,     // Se activa inmediatamente
  viewOffset: {
    top: 0,
    bottom: 0
  }
});
```

### **Elementos en el MEDIO/ABAJO de la página:**
```javascript
sr.reveal('.elemento', {
  // ... configuración
  viewFactor: 0.2,   // Necesita 20% visible
  viewOffset: {
    top: 100         // Se activa 100px antes
  }
});
```

---

## 📱 Problemas específicos de móviles

### **Las animaciones no funcionan en móvil**

Verifica que `mobile: true` esté configurado:

```javascript
// En scrollReveal.js
export const initScrollRevealWithClasses = () => {
  const sr = ScrollReveal({
    mobile: true,  // ✅ Debe estar en true
    desktop: true
  });
};
```

---

## 🔄 Reinicializar ScrollReveal después de cambios dinámicos

Si agregas elementos dinámicamente (v-if, v-for, etc.):

```vue
<script setup>
import { watch, nextTick } from 'vue';
import ScrollReveal from 'scrollreveal';

const items = ref([]);

watch(items, () => {
  nextTick(() => {
    const sr = ScrollReveal();
    sr.reveal('.new-item', { /* config */ });
  });
});
</script>
```

---

## 🆘 Solución de Emergencia

Si nada funciona, reinicia todo:

1. **Borra la caché del navegador** (Ctrl + Shift + Delete)
2. **Reinicia el servidor** (npm run serve)
3. **Verifica que el paquete está instalado:**
   ```bash
   npm list scrollreveal
   ```
4. **Si no está, reinstala:**
   ```bash
   npm uninstall scrollreveal
   npm install scrollreveal --save
   ```

---

## 📞 Checklist Final

- [ ] ScrollReveal instalado (`npm list scrollreveal`)
- [ ] `initScrollRevealWithClasses()` llamado en App.vue
- [ ] Clase CSS correctamente escrita (`sr-zoom`, no `sr zoom`)
- [ ] Elemento existe en el DOM (no dentro de v-if falso)
- [ ] No hay CSS que sobrescriba opacity/transform
- [ ] Para Hero: Reinicializar en onMounted con setTimeout
- [ ] viewFactor: 0 para elementos en la parte superior
- [ ] mobile: true en la configuración

---

¡Con estas soluciones deberías tener ScrollReveal funcionando perfectamente! 🎉
