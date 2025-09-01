import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

// Estado global de accesibilidad
const isDarkTheme = ref(false)
const highContrastMode = ref(false)
const textSize = ref(100) // Porcentaje base 100%
const reducedMotionMode = ref(false)
const enhancedFocusMode = ref(false)

// Computed properties
const hasAnySettingActive = computed(() => {
  return isDarkTheme.value || highContrastMode.value || textSize.value !== 100 || 
         reducedMotionMode.value || enhancedFocusMode.value
})

const textSizeLabel = computed(() => {
  if (textSize.value < 100) return 'Texto pequeño'
  if (textSize.value > 100) return 'Texto grande'
  return 'Texto normal'
})

// Funciones para aplicar configuraciones
const applyTheme = (theme) => {
  const root = document.documentElement
  const body = document.body
  const app = document.querySelector('.v-application')
  
  console.log(`🎨 ${isDarkTheme.value ? 'Activando' : 'Desactivando'} tema oscuro`)
  
  // Aplicar tema de Vuetify
  if (theme && theme.global) {
    const themeName = isDarkTheme.value ? 'dark' : 'light'
    theme.global.name.value = themeName
    localStorage.setItem('accessibility-theme', themeName)
    console.log(`✅ Tema Vuetify cambiado a: ${themeName}`)
  }
  
  // Aplicar clases CSS para asegurar que todo se actualice
  if (isDarkTheme.value) {
    root.classList.remove('v-theme--light')
    root.classList.add('v-theme--dark')
    body.classList.remove('v-theme--light')
    body.classList.add('v-theme--dark')
    if (app) {
      app.classList.remove('v-theme--light')
      app.classList.add('v-theme--dark')
    }
    console.log('✅ Clases CSS tema oscuro aplicadas')
  } else {
    root.classList.remove('v-theme--dark')
    root.classList.add('v-theme--light')
    body.classList.remove('v-theme--dark')
    body.classList.add('v-theme--light')
    if (app) {
      app.classList.remove('v-theme--dark')
      app.classList.add('v-theme--light')
    }
    console.log('✅ Clases CSS tema claro aplicadas')
  }
  
  console.log(`📁 Tema guardado: ${isDarkTheme.value ? 'dark' : 'light'}`)
}

const applyHighContrast = () => {
  const root = document.documentElement
  const body = document.body
  const app = document.querySelector('.v-application')
  
  console.log(`🔆 ${highContrastMode.value ? 'Activando' : 'Desactivando'} alto contraste`)
  
  if (highContrastMode.value) {
    root.classList.add('high-contrast-mode')
    body.classList.add('high-contrast-mode')
    if (app) app.classList.add('high-contrast-mode')
    console.log('✅ Clases de alto contraste agregadas')
  } else {
    root.classList.remove('high-contrast-mode')
    body.classList.remove('high-contrast-mode')
    if (app) app.classList.remove('high-contrast-mode')
    console.log('✅ Clases de alto contraste removidas')
  }
  
  localStorage.setItem('accessibility-high-contrast', highContrastMode.value.toString())
  console.log(`📁 Alto contraste guardado: ${highContrastMode.value}`)
}

const applyTextSize = () => {
  const root = document.documentElement
  const body = document.body
  
  // Remover todas las clases de texto existentes
  const textClasses = [
    'text-scale-80',
    'text-scale-90', 
    'text-scale-100',
    'text-scale-110',
    'text-scale-120',
    'text-scale-130'
  ]
  
  textClasses.forEach(cls => {
    root.classList.remove(cls)
    body.classList.remove(cls)
  })
  
  // Aplicar la clase correcta basada en el tamaño
  let textClass = 'text-scale-100' // Default 100%
  if (textSize.value <= 80) textClass = 'text-scale-80'
  else if (textSize.value <= 90) textClass = 'text-scale-90'
  else if (textSize.value <= 100) textClass = 'text-scale-100'
  else if (textSize.value <= 110) textClass = 'text-scale-110'
  else if (textSize.value <= 120) textClass = 'text-scale-120'
  else textClass = 'text-scale-130'
  
  root.classList.add(textClass)
  body.classList.add(textClass)
  
  console.log(`🔤 Aplicando tamaño de texto: ${textSize.value}% (clase: ${textClass})`)
  localStorage.setItem('accessibility-text-size', textSize.value.toString())
}

const applyReducedMotion = () => {
  const root = document.documentElement
  const body = document.body
  const app = document.querySelector('.v-application')
  
  console.log(`🏃 ${reducedMotionMode.value ? 'Activando' : 'Desactivando'} reducción de animaciones`)
  
  if (reducedMotionMode.value) {
    root.classList.add('reduced-motion-mode')
    body.classList.add('reduced-motion-mode')
    if (app) app.classList.add('reduced-motion-mode')
    console.log('✅ Reducción de animaciones activada')
  } else {
    root.classList.remove('reduced-motion-mode')
    body.classList.remove('reduced-motion-mode')
    if (app) app.classList.remove('reduced-motion-mode')
    console.log('✅ Reducción de animaciones desactivada')
  }
  
  localStorage.setItem('accessibility-reduced-motion', reducedMotionMode.value.toString())
}

const applyEnhancedFocus = () => {
  const root = document.documentElement
  const body = document.body
  const app = document.querySelector('.v-application')
  
  console.log(`🎯 ${enhancedFocusMode.value ? 'Activando' : 'Desactivando'} foco mejorado`)
  console.log('🔍 Elementos encontrados:', { root: !!root, body: !!body, app: !!app })
  
  if (enhancedFocusMode.value) {
    root.classList.add('enhanced-focus-mode')
    body.classList.add('enhanced-focus-mode')
    if (app) app.classList.add('enhanced-focus-mode')
    console.log('✅ Foco mejorado activado - Clases agregadas')
    console.log('📋 Clases en root:', root.className)
    console.log('📋 Clases en body:', body.className)
    console.log('📋 Clases en app:', app ? app.className : 'N/A')
  } else {
    root.classList.remove('enhanced-focus-mode')
    body.classList.remove('enhanced-focus-mode')
    if (app) app.classList.remove('enhanced-focus-mode')
    console.log('✅ Foco mejorado desactivado - Clases removidas')
  }
  
  localStorage.setItem('accessibility-enhanced-focus', enhancedFocusMode.value.toString())
  
  // Debug adicional: verificar si el CSS se está aplicando
  if (enhancedFocusMode.value) {
    setTimeout(() => {
      const testElement = document.querySelector('button') || document.querySelector('.v-btn')
      if (testElement) {
        console.log('🧪 Elemento de prueba:', testElement)
        console.log('🎨 Estilos computados:', getComputedStyle(testElement))
        const focusColor = getComputedStyle(root).getPropertyValue('--enhanced-focus-color')
        console.log('🌈 Color de foco CSS variable:', focusColor)
      }
    }, 100)
  }
}

const applyAllSettings = (theme = null) => {
  applyTheme(theme)
  applyHighContrast()
  applyTextSize()
  applyReducedMotion()
  applyEnhancedFocus()
}

// Funciones de toggle
const toggleTheme = (theme = null) => {
  console.log(`🌗 Cambiando tema de ${isDarkTheme.value ? 'oscuro' : 'claro'} a ${!isDarkTheme.value ? 'oscuro' : 'claro'}`)
  isDarkTheme.value = !isDarkTheme.value
  applyTheme(theme)
}

const toggleHighContrast = () => {
  console.log(`🔆 ${!highContrastMode.value ? 'Activando' : 'Desactivando'} modo alto contraste`)
  highContrastMode.value = !highContrastMode.value
  applyHighContrast()
}

const increaseTextSize = () => {
  console.log(`🔤 Aumentando texto de ${textSize.value}% a ${Math.min(textSize.value + 10, 130)}%`)
  if (textSize.value < 130) {
    textSize.value += 10
    applyTextSize()
  }
}

const decreaseTextSize = () => {
  console.log(`🔤 Disminuyendo texto de ${textSize.value}% a ${Math.max(textSize.value - 10, 80)}%`)
  if (textSize.value > 80) {
    textSize.value -= 10
    applyTextSize()
  }
}

const resetTextSize = () => {
  textSize.value = 100
  applyTextSize()
}

const toggleReducedMotion = () => {
  reducedMotionMode.value = !reducedMotionMode.value
  applyReducedMotion()
}

const toggleEnhancedFocus = () => {
  enhancedFocusMode.value = !enhancedFocusMode.value
  applyEnhancedFocus()
}

const resetAllSettings = (theme = null) => {
  isDarkTheme.value = false
  highContrastMode.value = false
  textSize.value = 100
  reducedMotionMode.value = false
  enhancedFocusMode.value = false
  
  // Limpiar localStorage
  localStorage.removeItem('accessibility-theme')
  localStorage.removeItem('accessibility-high-contrast')
  localStorage.removeItem('accessibility-text-size')
  localStorage.removeItem('accessibility-reduced-motion')
  localStorage.removeItem('accessibility-enhanced-focus')
  
  applyAllSettings(theme)
}

// Cargar configuraciones guardadas
const loadSavedSettings = (theme = null) => {
  console.log('📁 Cargando configuraciones guardadas...')
  
  // Cargar tema
  const savedTheme = localStorage.getItem('accessibility-theme')
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
    console.log(`🌗 Tema cargado: ${savedTheme}`)
  } else {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkTheme.value = prefersDark
    console.log(`🌗 Usando preferencia del sistema: ${prefersDark ? 'oscuro' : 'claro'}`)
  }

  // Cargar otras configuraciones
  const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true'
  const savedTextSize = parseInt(localStorage.getItem('accessibility-text-size')) || 100
  const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true'
  const savedEnhancedFocus = localStorage.getItem('accessibility-enhanced-focus') === 'true'
  
  highContrastMode.value = savedHighContrast
  textSize.value = savedTextSize
  reducedMotionMode.value = savedReducedMotion
  enhancedFocusMode.value = savedEnhancedFocus
  
  console.log('📋 Configuraciones cargadas:', {
    theme: isDarkTheme.value ? 'dark' : 'light',
    highContrast: highContrastMode.value,
    textSize: textSize.value,
    reducedMotion: reducedMotionMode.value,
    enhancedFocus: enhancedFocusMode.value
  })
  
  // Aplicar todas las configuraciones
  setTimeout(() => {
    applyAllSettings(theme)
    console.log('✅ Configuraciones aplicadas')
  }, 100)
}

export function useAccessibility() {
  const theme = useTheme()
  
  return {
    // Estado
    isDarkTheme,
    highContrastMode,
    textSize,
    reducedMotionMode,
    enhancedFocusMode,
    
    // Computed
    hasAnySettingActive,
    textSizeLabel,
    
    // Funciones
    toggleTheme: () => toggleTheme(theme),
    toggleHighContrast,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    toggleReducedMotion,
    toggleEnhancedFocus,
    resetAllSettings: () => resetAllSettings(theme),
    loadSavedSettings: () => loadSavedSettings(theme),
    applyAllSettings: () => applyAllSettings(theme)
  }
}
