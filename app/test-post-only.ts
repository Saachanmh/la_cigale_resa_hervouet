// Test spécifique du POST pour identifier l'erreur 500
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function testPostOnly() {
  console.log('🧪 Test spécifique du POST...\n');

  const testReservation = {
    guestName: 'Test POST',
    covers: 2,
    time: '20:30',
    date: '2026-03-12',
    status: 'CONFIRMED'
  };

  console.log('📤 Tentative de création avec:', testReservation);

  try {
    const response = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReservation)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Erreur détaillée: ${errorText}`);

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          console.log(`🔍 Message d'erreur: ${errorJson.error}`);
        }
      } catch (e) {
        console.log('📝 Réponse brute (non JSON):', errorText);
      }

      return;
    }

    const data = await response.json();
    console.log('✅ Création réussie:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error}`);
  }
}

testPostOnly();
