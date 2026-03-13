// Test spécifique des filtres pour identifier l'erreur 500
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testFilters() {
  console.log('🧪 Test spécifique des filtres...\n');
  
  try {
    console.log('📊 Test LUNCH avec détails d\'erreur:');
    const lunchResponse = await fetch(`${BASE_URL}/reservations?service=LUNCH`);
    console.log(`Status: ${lunchResponse.status}`);
    
    if (!lunchResponse.ok) {
      const errorText = await lunchResponse.text();
      console.log(`❌ Erreur LUNCH: ${errorText}`);
    } else {
      const data = await lunchResponse.json();
      console.log(`✅ LUNCH OK: ${data.length} réservations`);
    }
    
    console.log('\n🌆 Test DINNER avec détails d\'erreur:');
    const dinnerResponse = await fetch(`${BASE_URL}/reservations?service=DINNER`);
    console.log(`Status: ${dinnerResponse.status}`);
    
    if (!dinnerResponse.ok) {
      const errorText = await dinnerResponse.text();
      console.log(`❌ Erreur DINNER: ${errorText}`);
    } else {
      const data = await dinnerResponse.json();
      console.log(`✅ DINNER OK: ${data.length} réservations`);
    }
    
    console.log('\n📅 Test avec date spécifique:');
    const dateResponse = await fetch(`${BASE_URL}/reservations?date=2025-11-28`);
    console.log(`Status: ${dateResponse.status}`);
    
    if (!dateResponse.ok) {
      const errorText = await dateResponse.text();
      console.log(`❌ Erreur DATE: ${errorText}`);
    } else {
      const data = await dateResponse.json();
      console.log(`✅ DATE OK: ${data.length} réservations pour 2025-11-28`);
      data.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.guestName} - ${res.time} - ${res.date}`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error}`);
  }
}

testFilters();
