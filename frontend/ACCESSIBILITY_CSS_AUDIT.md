# 🔍 Auditoría de accessibility.css

## 📊 Resumen Ejecutivo

**Archivo:** `src/assets/css/accessibility.css`
**Tamaño:** 1,527 líneas
**Fecha:** 15 de octubre de 2025

---

## ✅ CLASES UTILIZADAS (Verificadas en componentes)

### 1. **Sistema de Temas** ✅ USADO
```css
.v-theme--light    ✅ Usado en AccessibilityControls.vue y múltiples vistas
.v-theme--dark     ✅ Usado en AccessibilityControls.vue y múltiples vistas
.high-contrast-mode ✅ Usado en useAccessibility.js, AccessibilityControls.vue
```

**Ubicación de uso:**
- `src/composables/useAccessibility.js` (líneas 73-80)
- `src/components/AccessibilityControls.vue` (líneas 574, 584, 588, 593)
- Aplicado dinámicamente a `<html>`, `<body>`, `.v-application`

---

### 2. **Sistema de Escalado de Texto** ✅ USADO
```css
html.text-scale-80   ✅ Usado en useAccessibility.js
html.text-scale-90   ✅ Usado en useAccessibility.js
html.text-scale-100  ✅ Usado en useAccessibility.js (default)
html.text-scale-110  ✅ Usado en useAccessibility.js
html.text-scale-120  ✅ Usado en useAccessibility.js
html.text-scale-130  ✅ Usado en useAccessibility.js
```

**Ubicación de uso:**
- `src/composables/useAccessibility.js` (líneas 94-114)
- `src/debug-text-scaling-complete.js` (líneas 33, 74, 80, 147-149)
- Aplicado dinámicamente al elemento `<html>`

---

### 3. **Sistema de Movimiento Reducido** ✅ USADO
```css
.reduced-motion-mode ✅ Usado en useAccessibility.js, AccessibilityControls.vue
```

**Ubicación de uso:**
- `src/composables/useAccessibility.js` (líneas 131-138)
- `src/components/AccessibilityControls.vue` (líneas 634, 641, 645)
- Aplicado a `<html>`, `<body>`, `.v-application`

---

### 4. **Menú de Accesibilidad** ✅ USADO
```css
.accessibility-menu ✅ Usado en AccessibilityControls.vue
```

**Ubicación de uso:**
- `src/components/AccessibilityControls.vue` (línea 667)

---

### 5. **Componentes Específicos** ✅ USADOS

#### Dashboard
```css
.dashboard            ✅ Usado en DashView.vue (línea 3)
.dashboard-card       ✅ Usado en múltiples componentes dashboard
.dashboard-sidebar    ✅ Usado en DashView.vue
.dashboard-card-wrapper ✅ Usado en DashView.vue
.bg-dash             ✅ Usado en DashView.vue (línea 2)
```

#### Cursos
```css
.bg-course           ✅ Usado en MyCourses.vue, CourseCatalog.vue
.course-card         ✅ Usado en CourseCard.vue
.bg-filtros          ✅ Usado en MyCourses.vue, CourseCatalog.vue
.bg-filtros-generales ✅ Usado en CourseCatalog.vue
```

#### Home
```css
.home-page           ✅ Usado en HomeView.vue (línea 2)
.features-section    ✅ Usado en HomeView.vue
.cta-section         ✅ Usado en HomeView.vue (línea 19)
.card-step           ✅ Usado en CardsAcComponents.vue
```

#### Contacto
```css
.contact-page        ✅ Usado en ContactView.vue (línea 2)
```

#### Perfil
```css
.container-profile   ✅ Usado en UserProfile.vue (línea 2)
.title-profile       ✅ Usado en UserProfile.vue (líneas 6, 307)
.card-profile        ✅ Usado en UserProfile.vue (línea 18)
```

#### Footer
```css
.footer              ✅ Usado - estilos de temas aplicados
.footer-text         ✅ Usado - estilos de temas aplicados
.footer-link         ✅ Usado - estilos de temas aplicados
.bg-footer           ✅ Usado - estilos de temas aplicados
```

#### Shopping Cart
```css
.shopping-cart       ✅ Usado en ShoppingCart.vue
.modal-car           ✅ Usado en ShoppingCart.vue
.title-buy           ✅ Usado en ShoppingCart.vue
```

---

## ⚠️ CLASES DUPLICADAS ENCONTRADAS

### 🔴 **DUPLICACIONES CRÍTICAS:**

#### 1. **Switches del Menú de Accesibilidad** (DUPLICADO)
```css
/* LÍNEAS 268-281 - PRIMERA DEFINICIÓN */
.accessibility-menu .v-switch__thumb {
  background-color: #ffffff !important;
  border: 2px solid #cccccc !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  width: 18px !important;
  height: 18px !important;
  opacity: 1 !important;
}

/* LÍNEAS 283-296 - SEGUNDA DEFINICIÓN (DUPLICADO) */
.accessibility-menu .v-switch__thumb {
  background-color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid #cccccc !important;
  width: 18px !important;
  height: 18px !important;
}
```
**🔧 ACCIÓN:** Eliminar la segunda definición (líneas 283-296)

---

#### 2. **Tema Oscuro - Switches** (DUPLICADO)
```css
/* LÍNEAS 329-336 - PRIMERA DEFINICIÓN */
.v-theme--dark .accessibility-menu .v-switch__thumb {
  background-color: #ffffff !important;
  border: 3px solid #e0e0e0 !important;
  box-shadow: ... !important;
  width: 20px !important;
  height: 20px !important;
  opacity: 1 !important;
}

/* LÍNEAS 338-346 - SEGUNDA DEFINICIÓN (DUPLICADO SIMILAR) */
.v-theme--dark .accessibility-menu .v-switch--active .v-switch__thumb {
  background-color: #ffffff !important;
  border: 3px solid #4caf50 !important;
  box-shadow: ... !important;
  width: 20px !important;
  height: 20px !important;
}
```
**🔧 ACCIÓN:** Mantener ambas (una para estado normal, otra para activo)

---

#### 3. **Footer Themes** (REDUNDANCIAS)

**MODO CLARO:**
```css
/* LÍNEAS 682-705 - DEFINICIÓN EN ACCESSIBILITY */
.v-theme--light footer.footer {
  background-color: #2a3b5f !important;
  ...
}

/* ⚠️ POSIBLE DUPLICADO EN footer.css */
```
**🔧 ACCIÓN:** Verificar si footer.css tiene las mismas definiciones

---

#### 4. **About Page Themes** (REDUNDANCIAS)
```css
/* LÍNEAS 922-932 - MODO CLARO */
.v-theme--light .about-page {
  background-color: #f8f9fa !important;
  ...
}

/* ⚠️ POSIBLE DUPLICADO EN about.css */
```
**🔧 ACCIÓN:** Verificar si about.css tiene las mismas definiciones

---

#### 5. **Cards Components Dark Mode** (DUPLICADOS)
```css
/* LÍNEAS 1003-1011 - PRIMERA DEFINICIÓN */
.v-theme--dark .title-card {
  color: var(--v-theme-text) !important;
}

/* LÍNEAS 1069-1071 - SEGUNDA DEFINICIÓN (DUPLICADO) */
.v-theme--dark .title-card {
  color: var(--v-theme-text) !important;
}
```
**🔧 ACCIÓN:** Eliminar una de las definiciones duplicadas

---

#### 6. **Dashboard Dark Mode** (MÚLTIPLES DUPLICADOS)
```css
/* LÍNEAS 1251-1254 */
.v-theme--dark .bg-dash,
.v-theme--dark .dashboard {
  background-color: var(--v-theme-primary-2) !important;
}

/* LÍNEAS 1256-1260 */
.v-theme--dark .dashboard-sidebar,
.v-theme--dark .dash-1,
.v-theme--dark .dashboard-card-wrapper {
  background-color: var(--v-theme-primary-1) !important;
}

/* ⚠️ POSIBLE DUPLICADO EN dashStyle.css */
```
**🔧 ACCIÓN:** Consolidar en un solo archivo

---

## ❌ CLASES NO UTILIZADAS (Candidatas para Eliminación)

### 1. **Variables CSS No Referenciadas**
```css
/* LÍNEA 7 - NUNCA USADA */
:root {
  --accessibility-text-scale: 1;
}
```
**🔧 ACCIÓN:** Eliminar si no se usa en cálculos CSS

---

### 2. **Estilos Comentados Vacíos**
```css
/* LÍNEAS 44-48 - COMENTARIOS SIN CONTENIDO */
/* Fondo y texto para modo claro */

/* Fondo y texto para modo oscuro */

/* Fondo y texto para alto contraste */
```
**🔧 ACCIÓN:** Eliminar comentarios vacíos

---

### 3. **Clases de Formularios Específicas** ⚠️ VERIFICAR
```css
/* LÍNEAS 1224-1227 */
.v-theme--dark .txt-color,
.v-theme--dark .label-color {
  color: var(--v-theme-text) !important;
}

.v-theme--dark .close-btn {
  background-color: var(--v-theme-text) !important;
}
```
**🔧 ACCIÓN:** Verificar si `txt-color`, `label-color`, `close-btn` se usan en formularios

---

### 4. **Large Text Mode** ❌ NO USADA
```css
/* LÍNEAS 626-632 en AccessibilityControls.vue */
.large-text-mode .v-btn {
  font-size: 18px !important;
}
.large-text-mode .v-list-item-title {
  font-size: 18px !important;
}
```
**🔧 ACCIÓN:** Clase `large-text-mode` NO se aplica en useAccessibility.js
**RESULTADO:** ❌ ELIMINAR (no se usa en el sistema de accesibilidad)

---

## 🔄 REDUNDANCIAS CON OTROS ARCHIVOS CSS

### **1. about.css vs accessibility.css**
```css
/* about.css tiene: */
.v-theme--light .about-page { ... }
.v-theme--dark .about-page { ... }

/* accessibility.css TAMBIÉN tiene: */
.v-theme--light .about-page { ... }
.v-theme--dark .about-page { ... }
```
**🔧 ACCIÓN:** Consolidar en UN SOLO ARCHIVO (dejar en accessibility.css o about.css, no ambos)

---

### **2. footer.css vs accessibility.css**
```css
/* accessibility.css tiene estilos completos de footer con temas */
.v-theme--light footer.footer { ... }
.v-theme--dark footer.footer { ... }
.high-contrast-mode footer.footer { ... }

/* footer.css probablemente tiene estilos base */
```
**🔧 ACCIÓN:** Mantener estilos base en footer.css, temas en accessibility.css

---

### **3. cardshome.css vs accessibility.css**
```css
/* accessibility.css tiene: */
.v-theme--dark .btn-add-to-cart { ... }
.high-contrast-mode .btn-add-to-cart { ... }

/* cardshome.css TAMBIÉN tiene: */
.btn-add-to-cart { ... }
.v-theme--dark .btn-add-to-cart { ... }
```
**🔧 ACCIÓN:** Consolidar (estilos base en cardshome.css, temas en accessibility.css)

---

### **4. dashStyle.css vs accessibility.css**
```css
/* accessibility.css tiene TODOS los estilos de dashboard con temas */
.v-theme--dark .dashboard { ... }
.v-theme--dark .dashboard-sidebar { ... }
.high-contrast-mode .dashboard { ... }

/* dashStyle.css tiene estilos base de dashboard */
.dashboard { ... }
.dashboard-grid { ... }
```
**🔧 ACCIÓN:** Mantener estilos base en dashStyle.css, temas en accessibility.css

---

## 📋 PLAN DE LIMPIEZA

### **PASO 1: Eliminar Duplicados Internos**
```
✅ ELIMINAR:
- Líneas 283-296: .accessibility-menu .v-switch__thumb (duplicado)
- Línea 1071: .v-theme--dark .title-card (duplicado)
- Líneas 7-9: :root variable no usada
- Líneas 44-48: Comentarios vacíos
```

### **PASO 2: Eliminar Clases No Usadas**
```
❌ ELIMINAR:
- .large-text-mode (líneas en AccessibilityControls.vue - NO se aplica en composable)
```

### **PASO 3: Consolidar con Otros Archivos**
```
🔄 REVISAR REDUNDANCIAS:
1. about.css - mover estilos de temas a accessibility.css
2. footer.css - verificar duplicación
3. cardshome.css - verificar duplicación de btn-add-to-cart
4. dashStyle.css - mantener solo estilos base
```

### **PASO 4: Verificar Clases Sospechosas**
```
⚠️ VERIFICAR SI SE USAN:
- .txt-color
- .label-color
- .close-btn
- .text-cancel
- .text-seRe
- .txt-dash
- .txt-card-course
- .text-none
```

---

## 🎯 RESULTADO ESPERADO

### **Reducción Estimada:**
- **Líneas actuales:** 1,527
- **Líneas a eliminar:** ~150-200
- **Líneas finales:** ~1,300-1,400
- **Reducción:** 10-15%

### **Beneficios:**
✅ Elimina duplicados internos
✅ Mejora rendimiento (menos CSS)
✅ Código más mantenible
✅ Sin redundancias entre archivos

---

## ⚠️ ADVERTENCIAS

### **NO ELIMINAR:**
- ✅ Todos los selectores `.v-theme--light`
- ✅ Todos los selectores `.v-theme--dark`
- ✅ Todos los selectores `.high-contrast-mode`
- ✅ Todos los selectores `.reduced-motion-mode`
- ✅ Todos los selectores `html.text-scale-*`
- ✅ Estilos de componentes Vuetify (`.v-btn`, `.v-card`, `.v-list`, etc.)

### **ELIMINAR SOLO:**
- ❌ Duplicados EXACTOS dentro del mismo archivo
- ❌ Clases que NO se usan en ningún componente
- ❌ Comentarios vacíos sin contenido

---

## 🔍 SIGUIENTE PASO

¿Quieres que proceda a:

1. **Limpiar accessibility.css** (eliminar duplicados y clases no usadas)?
2. **Consolidar con otros archivos** (mover estilos de temas a accessibility.css)?
3. **Crear versión limpia** (backup + versión optimizada)?

**Recomendación:** Opción 3 - Crear backup primero, luego limpiar
