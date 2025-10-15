// Utilidad para ScrollReveal - Animaciones al hacer scroll
import ScrollReveal from "scrollreveal";

/**
 * Configuración global de ScrollReveal
 */
export const initScrollReveal = () => {
  const sr = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    reset: false,
    easing: "ease-in-out",
    scale: 1,
    opacity: 0,
    mobile: true,
    desktop: true,
  });

  return sr;
};

/**
 * Inicializa ScrollReveal con clases CSS automáticas
 * Solo llama esta función una vez en tu App.vue o main.js
 */
export const initScrollRevealWithClasses = () => {
  const sr = ScrollReveal({
    reset: false,
    mobile: true,
    desktop: true,
  });

  // ========================================
  // ANIMACIONES BÁSICAS
  // ========================================

  // Desde abajo
  sr.reveal(".sr-bottom", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Desde arriba
  sr.reveal(".sr-top", {
    origin: "top",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Desde la izquierda
  sr.reveal(".sr-left", {
    origin: "left",
    distance: "80px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Desde la derecha
  sr.reveal(".sr-right", {
    origin: "right",
    distance: "80px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Fade in (sin dirección)
  sr.reveal(".sr-fade", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Zoom in
  sr.reveal(".sr-zoom", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    scale: 0.85,
    opacity: 0,
  });

  // ========================================
  // VARIACIONES DE VELOCIDAD
  // ========================================

  // Lento (slow) - 1500ms
  sr.reveal(".sr-slow", {
    origin: "bottom",
    distance: "60px",
    duration: 1500,
    delay: 200,
    opacity: 0,
  });

  // Rápido (fast) - 600ms
  sr.reveal(".sr-fast", {
    origin: "bottom",
    distance: "60px",
    duration: 600,
    delay: 100,
    opacity: 0,
  });

  // ========================================
  // DELAYS PERSONALIZADOS
  // ========================================

  sr.reveal(".sr-delay-100", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 100,
    opacity: 0,
  });

  sr.reveal(".sr-delay-200", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  sr.reveal(".sr-delay-300", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 300,
    opacity: 0,
  });

  sr.reveal(".sr-delay-400", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 400,
    opacity: 0,
  });

  sr.reveal(".sr-delay-500", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 500,
    opacity: 0,
  });

  sr.reveal(".sr-delay-600", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 600,
    opacity: 0,
  });

  sr.reveal(".sr-delay-800", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 800,
    opacity: 0,
  });

  sr.reveal(".sr-delay-1000", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 1000,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES SECUENCIALES (PARA LISTAS)
  // ========================================

  // Secuencial normal
  sr.reveal(".sr-sequence", {
    origin: "bottom",
    distance: "40px",
    duration: 800,
    delay: 100,
    interval: 150,
    opacity: 0,
  });

  // Secuencial rápido
  sr.reveal(".sr-sequence-fast", {
    origin: "bottom",
    distance: "30px",
    duration: 600,
    delay: 50,
    interval: 100,
    opacity: 0,
  });

  // Secuencial lento
  sr.reveal(".sr-sequence-slow", {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
    delay: 200,
    interval: 250,
    opacity: 0,
  });

  // ========================================
  // COMBINACIONES DIRECCIONALES
  // ========================================

  // Desde abajo + zoom
  sr.reveal(".sr-bottom-zoom", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    scale: 0.9,
    opacity: 0,
  });

  // Desde izquierda + rápido
  sr.reveal(".sr-left-fast", {
    origin: "left",
    distance: "80px",
    duration: 600,
    delay: 100,
    opacity: 0,
  });

  // Desde derecha + lento
  sr.reveal(".sr-right-slow", {
    origin: "right",
    distance: "80px",
    duration: 1500,
    delay: 300,
    opacity: 0,
  });

  // Desde arriba + zoom
  sr.reveal(".sr-top-zoom", {
    origin: "top",
    distance: "60px",
    duration: 1000,
    delay: 200,
    scale: 0.9,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES ESPECIALES
  // ========================================

  // Rotación desde izquierda
  sr.reveal(".sr-rotate-left", {
    origin: "left",
    distance: "80px",
    duration: 1000,
    delay: 200,
    rotate: { z: 20 },
    opacity: 0,
  });

  // Rotación desde derecha
  sr.reveal(".sr-rotate-right", {
    origin: "right",
    distance: "80px",
    duration: 1000,
    delay: 200,
    rotate: { z: -20 },
    opacity: 0,
  });

  // Flip horizontal
  sr.reveal(".sr-flip-horizontal", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    rotate: { y: 90 },
    opacity: 0,
  });

  // Flip vertical
  sr.reveal(".sr-flip-vertical", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    rotate: { x: 90 },
    opacity: 0,
  });

  // Scale up (crecimiento)
  sr.reveal(".sr-scale-up", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    scale: 0.5,
    opacity: 0,
  });

  // Scale down (desde grande)
  sr.reveal(".sr-scale-down", {
    distance: "0px",
    duration: 1000,
    delay: 200,
    scale: 1.5,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES PARA TEXTOS
  // ========================================

  // Título principal
  sr.reveal(".sr-title", {
    origin: "top",
    distance: "40px",
    duration: 1200,
    delay: 0,
    opacity: 0,
  });

  // Subtítulo
  sr.reveal(".sr-subtitle", {
    origin: "bottom",
    distance: "30px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  });

  // Párrafo
  sr.reveal(".sr-paragraph", {
    distance: "0px",
    duration: 1000,
    delay: 300,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES PARA BOTONES
  // ========================================

  sr.reveal(".sr-button", {
    distance: "0px",
    duration: 800,
    delay: 400,
    scale: 0.9,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES PARA TARJETAS (CARDS)
  // ========================================

  sr.reveal(".sr-card", {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
    delay: 200,
    scale: 0.95,
    opacity: 0,
  });

  // ========================================
  // ANIMACIONES RESET (se repiten)
  // ========================================

  sr.reveal(".sr-reset", {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
    reset: true, // Se anima cada vez que entra al viewport
  });

  return sr;
};

/**
 * Animaciones predefinidas para diferentes elementos
 */
export const animations = {
  // Animación desde abajo
  fromBottom: {
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  },

  // Animación desde arriba
  fromTop: {
    origin: "top",
    distance: "60px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  },

  // Animación desde la izquierda
  fromLeft: {
    origin: "left",
    distance: "80px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  },

  // Animación desde la derecha
  fromRight: {
    origin: "right",
    distance: "80px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  },

  // Animación de fade in
  fadeIn: {
    distance: "0px",
    duration: 1000,
    delay: 200,
    opacity: 0,
  },

  // Animación con zoom
  zoomIn: {
    distance: "0px",
    duration: 1000,
    delay: 200,
    scale: 0.85,
    opacity: 0,
  },

  // Animación secuencial (para listas)
  sequence: {
    origin: "bottom",
    distance: "40px",
    duration: 800,
    delay: 100,
    interval: 150, // Delay entre elementos
    opacity: 0,
  },
};

export default initScrollReveal;
