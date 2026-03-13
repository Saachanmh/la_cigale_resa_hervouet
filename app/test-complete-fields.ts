// Test complet avec les nouveaux champs
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testComplete() {
  console.log('🧪 Test complet avec nouveaux champs...\n');

  try {
    console.log('📊 Test LUNCH avec détails complets:');
    const lunchResponse = await fetch(`${BASE_URL}/reservations?service=LUNCH`);
    if (lunchResponse.ok) {
      const lunchRes = await lunchResponse.json();
      console.log(`✅ ${lunchRes.length} réservation(s) LUNCH:`);
      lunchRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} (${res.guestName})`);
        console.log(`      📅 ${res.date} à ${res.time}`);
        console.log(`      🍽️ ${res.covers} couverts`);
        if (res.allergies) console.log(`      ⚠️ Allergies: ${res.allergies}`);
        if (res.dietaryRequirements) console.log(`      🥗 Régime: ${res.dietaryRequirements}`);
        if (res.additionalInfo) console.log(`      📝 Infos: ${res.additionalInfo}`);
        console.log('');
      });
    }

    console.log('\n🌆 Test DINNER avec détails complets:');
    const dinnerResponse = await fetch(`${BASE_URL}/reservations?service=DINNER`);
    if (dinnerResponse.ok) {
      const dinnerRes = await dinnerResponse.json();
      console.log(`✅ ${dinnerRes.length} réservation(s) DINNER:`);
      dinnerRes.slice(0, 3).forEach((res: any, i: number) => { // Limiter à 3 pour lisibilité
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} (${res.guestName})`);
        console.log(`      📅 ${res.date} à ${res.time}`);
        if (res.allergies) console.log(`      ⚠️ Allergies: ${res.allergies}`);
        if (res.dietaryRequirements) console.log(`      🥗 Régime: ${res.dietaryRequirements}`);
        if (res.additionalInfo) console.log(`      📝 Infos: ${res.additionalInfo}`);
        console.log('');
      });
    }

    console.log('\n📅 Test filtrage par date (2025-11-28):');
    const dateResponse = await fetch(`${BASE_URL}/reservations?date=2025-11-28`);
    if (dateResponse.ok) {
      const dateRes = await dateResponse.json();
      console.log(`✅ ${dateRes.length} réservation(s) le 2025-11-28:`);
      dateRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} à ${res.time}`);
        if (res.allergies) console.log(`      ⚠️ ${res.allergies}`);
        if (res.dietaryRequirements) console.log(`      🥗 ${res.dietaryRequirements}`);
      });
    }

    console.log('\n✅ Test du filtrage par date ET service (2025-11-28 DINNER):');
    const combinedResponse = await fetch(`${BASE_URL}/reservations?date=2025-11-28&service=DINNER`);
    if (combinedResponse.ok) {
      const combinedRes = await combinedResponse.json();
      console.log(`✅ ${combinedRes.length} réservation(s) le 2025-11-28 pour le dîner:`);
      combinedRes.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} à ${res.time}`);
      });
    }

  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
  }
}

testComplete();
