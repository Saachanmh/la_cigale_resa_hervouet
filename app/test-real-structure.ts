// Test adapté à la vraie structure Airtable de Chloe
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testRealStructure() {
  console.log('🔍 Test avec la vraie structure de ta table...\n');

  try {
    console.log('📊 Test LUNCH (11h-15h):');
    const lunchResponse = await fetch(`${BASE_URL}/reservations?service=LUNCH`);
    if (lunchResponse.ok) {
      const lunchRes = await lunchResponse.json();
      console.log(`   ✅ ${lunchRes.length} réservation(s) trouvée(s)`);
      lunchRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.guestName} - ${res.time} - Notes: ${res.notes}`);
      });
    } else {
      console.log(`   ❌ Erreur: ${lunchResponse.status}`);
    }

    console.log('\n🌆 Test DINNER (18h-23h):');
    const dinnerResponse = await fetch(`${BASE_URL}/reservations?service=DINNER`);
    if (dinnerResponse.ok) {
      const dinnerRes = await dinnerResponse.json();
      console.log(`   ✅ ${dinnerRes.length} réservation(s) trouvée(s)`);
      dinnerRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.guestName} - ${res.time} - Notes: ${res.notes}`);
      });
    } else {
      console.log(`   ❌ Erreur: ${dinnerResponse.status}`);
    }

    console.log('\n🌍 Test TOUTES les réservations:');
    const allResponse = await fetch(`${BASE_URL}/reservations`);
    if (allResponse.ok) {
      const allRes = await allResponse.json();
      console.log(`   ✅ ${allRes.length} réservation(s) au total`);
      allRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.guestName} - ${res.time} - Notes: ${res.notes || 'Aucune'}`);
      });
    }

  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
  }
}

// Attendre que le serveur soit prêt
setTimeout(testRealStructure, 2000);
