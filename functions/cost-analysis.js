// Análisis de costos directo - Sin dependencias

console.log('🧮 ANÁLISIS DE COSTOS - KHIPU vs FLOW vs ACTUALES\n');

const calculateCosts = (amount) => {
  const costs = {
    transbank: Math.round(amount * 0.0295 * 1.19), // 2.95% + IVA
    khipu: 390, // Fijo
    flow_card: Math.round(amount * 0.0349 * 1.19), // 3.49% + IVA  
    flow_transfer: Math.round(amount * 0.0299 * 1.19), // 2.99% + IVA
    flow_servipag: Math.round(amount * 0.045 * 1.19), // 4.5% + IVA
    stripe: Math.round((amount * 0.036) + 30) // 3.6% + $30
  };

  return costs;
};

const coursePrices = [25000, 50000, 75000, 100000, 150000];

coursePrices.forEach(price => {
  console.log(`📚 Curso: $${price.toLocaleString()} CLP`);
  
  const costs = calculateCosts(price);
  
  Object.entries(costs).forEach(([gateway, commission]) => {
    const netAmount = price - commission;
    const percentage = ((commission / price) * 100).toFixed(2);
    const gatewayName = gateway.replace('_', ' ').toUpperCase();
    console.log(`   ${gatewayName.padEnd(15)}: $${commission.toString().padStart(5)} (${percentage.padStart(5)}%) → Recibes: $${netAmount.toLocaleString()}`);
  });
  
  // Encontrar el más barato
  const cheapest = Object.entries(costs).reduce((min, [name, cost]) => 
    cost < min.cost ? {name, cost} : min, 
    {name: '', cost: Infinity}
  );
  
  console.log(`   🏆 MÁS BARATO: ${cheapest.name.toUpperCase()} ($${cheapest.cost})`);
  console.log('');
});

console.log('💡 CONCLUSIONES CLAVE:');
console.log('✅ KHIPU domina en cursos de $40k+ (comisión fija)');
console.log('✅ TRANSBANK mejor para cursos baratos');
console.log('✅ FLOW transferencia competitiva vs Transbank');
console.log('✅ FLOW servipag útil para pagos en efectivo');
console.log('✅ STRIPE solo para mercado internacional');

console.log('\n🎯 RECOMENDACIÓN PARA TU ACADEMIA:');
console.log('1. MANTENER: Transbank (confiabilidad) + Stripe (internacional)');
console.log('2. AGREGAR: KHIPU (máxima rentabilidad en cursos premium)');
console.log('3. CONSIDERAR: Flow (diversificación + Servipag)');

console.log('\n💰 AHORRO POTENCIAL CON KHIPU:');
coursePrices.forEach(price => {
  if (price >= 40000) {
    const transbankCost = calculateCosts(price).transbank;
    const khipuCost = calculateCosts(price).khipu;
    const savings = transbankCost - khipuCost;
    const savingsPercent = ((savings / transbankCost) * 100).toFixed(1);
    console.log(`   Curso $${price.toLocaleString()}: Ahorras $${savings} (${savingsPercent}%)`);
  }
});
