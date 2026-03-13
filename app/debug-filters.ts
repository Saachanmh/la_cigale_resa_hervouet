// Test sans filtre d'heure pour voir toutes les réservations d'une date
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testWithoutTimeFilter() {
  console.log('🔍 Test sans filtre d\'heure...\n');

  try {
    // Appel direct à Airtable pour voir toutes les réservations de cette date
    const testDate = '2025-11-30';
    console.log(`📅 Recherche des réservations du ${testDate}:`);

    // Test avec appel direct (sans service filter)
    const response = await fetch(`http://localhost:3001/api/reservations?date=${testDate}&service=DINNER`);
    const dinnerRes = await response.json();
    console.log(`🌆 DINNER (18h-23h): ${dinnerRes.length} réservation(s)`);

    const lunchResponse = await fetch(`http://localhost:3001/api/reservations?date=${testDate}&service=LUNCH`);
    const lunchRes = await lunchResponse.json();
    console.log(`🌅 LUNCH (11h-15h): ${lunchRes.length} réservation(s)`);

    // Test direct avec Airtable pour debug
    console.log('\n🔧 Debug - Test direct Airtable:');
    const directResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Reservations?filterByFormula={Date de réservation} = '${testDate}'`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    if (directResponse.ok) {
      const directData = await directResponse.json();
      console.log(`   ${directData.records?.length || 0} record(s) trouvé(s) dans Airtable`);

      if (directData.records?.length > 0) {
        directData.records.forEach((rec: any) => {
          console.log(`   - ${rec.fields['Prénom']} ${rec.fields['Nom']} à ${rec.fields['Heure de réservation']}`);
        });
      }
    }

  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
  }
}

testWithoutTimeFilter();
