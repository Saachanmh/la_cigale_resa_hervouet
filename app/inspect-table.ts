import * as dotenv from 'dotenv';
dotenv.config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Reservations';

async function inspectTable() {
  console.log('🔍 Inspection de la structure de ta table Airtable...\n');

  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=1`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Erreur:', error);
      return;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const record = data.records[0];
      console.log('📊 Premier enregistrement trouvé:');
      console.log(`   ID: ${record.id}`);
      console.log('   Champs disponibles:');

      Object.keys(record.fields).forEach(fieldName => {
        const value = record.fields[fieldName];
        console.log(`   - "${fieldName}" = "${value}" (${typeof value})`);
      });

      console.log('\n🔧 Noms attendus par le code:');
      console.log('   - "Guest Name" (nom du client)');
      console.log('   - "Covers" (nombre de couverts)');
      console.log('   - "Time" (heure, format HH:MM)');
      console.log('   - "Date" (date, format YYYY-MM-DD)');
      console.log('   - "Status" (statut: CONFIRMED, CHECKED_IN, etc.)');
      console.log('   - "Table" (optionnel)');
      console.log('   - "Notes" (optionnel)');

    } else {
      console.log('⚠️ Aucun enregistrement trouvé dans la table.');
      console.log('   Ajoute au moins une réservation test dans Airtable.');
    }

  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

inspectTable();
