// Test spécifique du filtrage par date
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testDateFiltering() {
  console.log('🔍 Test spécifique du filtrage par date...\n');

  // D'abord récupérons toutes les réservations pour voir les dates
  console.log('📋 Toutes les réservations avec leurs vraies dates:');
  const allResponse = await fetch(`${BASE_URL}/reservations`);
  if (allResponse.ok) {
    const allRes = await allResponse.json();
    allRes.forEach((res: any, i: number) => {
      console.log(`   ${i+1}. ${res.guestName} - Date: "${res.date}" - Heure: ${res.time}`);
    });
  }

  console.log('\n🔍 Test de dates spécifiques:');
  const testDates = ['2025-11-28', '2025-11-29', '2025-11-30', '2026-03-12'];

  for (const testDate of testDates) {
    const response = await fetch(`${BASE_URL}/reservations?date=${testDate}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   ${testDate}: ${data.length} réservation(s)`);
      data.forEach((res: any) => {
        console.log(`      - ${res.guestName} à ${res.time}`);
      });
    }
  }
}

testDateFiltering();
