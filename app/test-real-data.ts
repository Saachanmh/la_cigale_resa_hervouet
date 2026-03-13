// Test pour voir les vraies réservations dans la table
const BASE_URL = 'http://localhost:3001/api';

async function testRealData() {
  console.log('🔍 Test avec les vraies données de ta table...\n');

  try {
    // Test avec la date d'aujourd'hui (où nous venons de créer une réservation)
    const testDate = '2026-03-12';

    console.log(`📅 Test avec la date ${testDate}:`);

    const response = await fetch(`${BASE_URL}/reservations?date=${testDate}&service=DINNER`);

    if (!response.ok) {
      console.log(`❌ Erreur ${response.status}: ${await response.text()}`);
      return;
    }

    const reservations = await response.json();
    console.log(`✅ ${reservations.length} réservation(s) trouvée(s):`);

    reservations.forEach((res: any, i: number) => {
      console.log(`   ${i+1}. ${res.guestName} - ${res.time} - ${res.covers} couverts`);
      console.log(`      ID: ${res.id}`);
      console.log(`      Status: ${res.status}`);
    });

  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
  }
}

testRealData();
