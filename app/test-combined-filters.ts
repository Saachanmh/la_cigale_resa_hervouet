// Test complet des filtres combinés
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testCombinedFilters() {
  console.log('🧪 Test des filtres combinés...\n');

  try {
    // Test 1: Date + Service DINNER
    console.log('📅🌆 Test 2025-11-28 + DINNER:');
    const dinnerDateResponse = await fetch(`${BASE_URL}/reservations?date=2025-11-28&service=DINNER`);
    if (dinnerDateResponse.ok) {
      const data = await dinnerDateResponse.json();
      console.log(`✅ ${data.length} réservation(s):`);
      data.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} à ${res.time}`);
        if (res.allergies) console.log(`      ⚠️ ${res.allergies}`);
        if (res.dietaryRequirements) console.log(`      🥗 ${res.dietaryRequirements}`);
      });
    }

    // Test 2: Date + Service LUNCH
    console.log('\n📅🌅 Test 2025-11-29 + LUNCH:');
    const lunchDateResponse = await fetch(`${BASE_URL}/reservations?date=2025-11-29&service=LUNCH`);
    if (lunchDateResponse.ok) {
      const data = await lunchDateResponse.json();
      console.log(`✅ ${data.length} réservation(s):`);
      data.forEach((res: any, i: number) => {
        console.log(`   ${i+1}. ${res.firstName} ${res.lastName} à ${res.time}`);
        if (res.allergies) console.log(`      ⚠️ ${res.allergies}`);
        if (res.dietaryRequirements) console.log(`      🥗 ${res.dietaryRequirements}`);
      });
    }

    // Test 3: Aujourd'hui (2026-03-12) par service
    console.log('\n📅 Test aujourd\'hui (2026-03-12) par service:');

    const todayLunchResponse = await fetch(`${BASE_URL}/reservations?date=2026-03-12&service=LUNCH`);
    if (todayLunchResponse.ok) {
      const lunchData = await todayLunchResponse.json();
      console.log(`   🌅 LUNCH: ${lunchData.length} réservation(s)`);
      lunchData.forEach((res: any) => {
        console.log(`      - ${res.guestName} à ${res.time}`);
      });
    }

    const todayDinnerResponse = await fetch(`${BASE_URL}/reservations?date=2026-03-12&service=DINNER`);
    if (todayDinnerResponse.ok) {
      const dinnerData = await todayDinnerResponse.json();
      console.log(`   🌆 DINNER: ${dinnerData.length} réservation(s)`);
      dinnerData.forEach((res: any) => {
        console.log(`      - ${res.guestName} à ${res.time}`);
      });
    }

  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
  }
}

testCombinedFilters();
