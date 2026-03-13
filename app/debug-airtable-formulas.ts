// Debug des formules Airtable
import * as dotenv from 'dotenv';
dotenv.config();

async function debugAirtableFormulas() {
  console.log('🔍 Debug des formules Airtable...\n');

  const testDate = '2025-11-28';
  const formula = `{Date de réservation} = '${testDate}'`;

  console.log(`📝 Formule testée: ${formula}`);

  try {
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Reservations?filterByFormula=${encodeURIComponent(formula)}&maxRecords=5`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    console.log(`Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Erreur: ${errorText}`);
    } else {
      const data = await response.json();
      console.log(`✅ ${data.records.length} record(s) trouvé(s) directement depuis Airtable:`);
      data.records.forEach((record: any) => {
        console.log(`   - ${record.fields['Prénom']} ${record.fields['Nom']} - Date: ${record.fields['Date de réservation']}`);
      });

      // Test de différents formats de date
      console.log('\n🧪 Test avec différents formats:');
      const testFormats = [
        `{Date de réservation} = '2025-11-28'`,
        `{Date de réservation} = "2025-11-28"`,
        `DATESTR({Date de réservation}) = '2025-11-28'`,
      ];

      for (const testFormula of testFormats) {
        const testResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Reservations?filterByFormula=${encodeURIComponent(testFormula)}&maxRecords=1`, {
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
        });

        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log(`   "${testFormula}" → ${testData.records.length} résultat(s)`);
        } else {
          console.log(`   "${testFormula}" → ERREUR`);
        }
      }
    }

  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error}`);
  }
}

debugAirtableFormulas();
