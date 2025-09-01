#!/usr/bin/env node

/**
 * Script de verificación de configuración Stripe
 * Uso: node stripe-check.js
 */

require('dotenv').config();
const stripe = require('stripe');

console.log('🔍 Verificando configuración de Stripe...\n');

// Verificar variables de entorno
const requiredVars = [
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

let missingVars = [];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

// Verificar formato de claves
const publicKey = process.env.STRIPE_PUBLIC_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;

console.log('✅ Variables de entorno encontradas');

// Verificar formato
const isTestMode = publicKey.startsWith('pk_test_') && secretKey.startsWith('sk_test_');
const isProdMode = publicKey.startsWith('pk_live_') && secretKey.startsWith('sk_live_');

if (isTestMode) {
  console.log('🧪 Modo: TESTING (Test keys detectadas)');
} else if (isProdMode) {
  console.log('🏢 Modo: PRODUCCIÓN (Live keys detectadas)');
} else {
  console.error('❌ Formato de claves inválido');
  process.exit(1);
}

// Verificar conectividad con Stripe
async function verifyStripeConnection() {
  try {
    const stripeClient = stripe(secretKey);
    
    console.log('\n🔗 Verificando conexión con Stripe...');
    
    // Test básico de conexión
    const account = await stripeClient.accounts.retrieve();
    console.log(`✅ Conexión exitosa`);
    console.log(`   Cuenta ID: ${account.id}`);
    console.log(`   País: ${account.country}`);
    console.log(`   Moneda por defecto: ${account.default_currency?.toUpperCase()}`);
    
    if (isTestMode) {
      console.log('\n🧪 Testing de Payment Intent...');
      
      // Crear un Payment Intent de prueba
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: 1000, // $10.00
        currency: 'clp',
        metadata: {
          test: 'stripe-verification'
        }
      });
      
      console.log(`✅ Payment Intent creado: ${paymentIntent.id}`);
      console.log(`   Amount: ${paymentIntent.amount} ${paymentIntent.currency.toUpperCase()}`);
      console.log(`   Status: ${paymentIntent.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error conectando con Stripe:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar verificación
verifyStripeConnection().then(() => {
  console.log('\n🎉 Configuración de Stripe verificada exitosamente!');
  
  if (isTestMode) {
    console.log('\n📝 Tarjetas de prueba disponibles:');
    console.log('   Exitosa: 4242 4242 4242 4242');
    console.log('   Rechazada: 4000 0000 0000 0002');
    console.log('   CVV: 123, Fecha: 12/25');
  } else {
    console.log('\n⚠️  PRODUCCIÓN: Usar solo tarjetas reales');
  }
}).catch(console.error);
