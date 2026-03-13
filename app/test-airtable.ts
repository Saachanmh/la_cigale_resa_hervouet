import * as dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Test de connectivité Airtable...');
console.log('API Key:', process.env.AIRTABLE_API_KEY ? '✅ Présente' : '❌ Manquante');
console.log('Base ID:', process.env.AIRTABLE_BASE_ID ? '✅ Présente' : '❌ Manquante');
console.log('Table Name:', process.env.AIRTABLE_TABLE_NAME || 'Reservations (défaut)');

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME || 'Reservations'}`;
console.log('URL:', AIRTABLE_BASE_URL);

// Test de connexion basique
async function testConnection() {
  try {
    console.log('\n🌐 Test de connexion à Airtable...');

    const response = await fetch(AIRTABLE_BASE_URL + '?maxRecords=1', {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Erreur:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Connexion réussie!');
    console.log('Nombre de records:', data.records?.length || 0);

    if (data.records && data.records.length > 0) {
      console.log('Premier record:', JSON.stringify(data.records[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

testConnection();
