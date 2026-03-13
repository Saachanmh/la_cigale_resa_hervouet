// Test des endpoints du serveur backend
const BASE_URL = 'http://localhost:3001/api';

async function testEndpoint(url: string, options: any = {}) {
  console.log(`🔍 Test: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ Erreur: ${error}`);
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ Réponse: ${JSON.stringify(data, null, 2)}`);
    return true;
  } catch (error) {
    console.log(`   ❌ Erreur de connexion: ${error}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Test des endpoints API...\n');

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Test 1: GET réservations du jour (service LUNCH)
  await testEndpoint(`${BASE_URL}/reservations?date=${today}&service=LUNCH`);

  // Test 2: GET réservations du jour (service DINNER)
  await testEndpoint(`${BASE_URL}/reservations?date=${today}&service=DINNER`);

  // Test 3: POST nouvelle réservation (test)
  const newReservation = {
    guestName: 'Test Client',
    covers: 2,
    time: '19:00',
    date: today,
    status: 'CONFIRMED'
  };

  await testEndpoint(`${BASE_URL}/reservations`, {
    method: 'POST',
    body: JSON.stringify(newReservation)
  });

  console.log('\n✨ Tests terminés');
}

// Attendre que le serveur soit prêt
setTimeout(runTests, 1000);
