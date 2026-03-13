import * as dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

dotenv.config();

console.log('🔍 Vérification de l\'installation CRM Réservations\n');

// 1. Vérification des fichiers requis
const requiredFiles = [
  '.env',
  'package.json',
  'server.ts',
  'src/main.tsx',
  'src/App.tsx'
];

console.log('📁 Fichiers requis :');
requiredFiles.forEach(file => {
  const exists = existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 2. Vérification variables d'environnement
console.log('\n🔐 Variables d\'environnement :');
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_NAME;

console.log(`   ${apiKey ? '✅' : '❌'} AIRTABLE_API_KEY: ${apiKey ? `${apiKey.substring(0, 10)}...` : 'MANQUANTE'}`);
console.log(`   ${baseId ? '✅' : '❌'} AIRTABLE_BASE_ID: ${baseId || 'MANQUANT'}`);
console.log(`   ${tableName ? '✅' : '❌'} AIRTABLE_TABLE_NAME: ${tableName || 'MANQUANT'}`);

// 3. Validation format clé API
if (apiKey) {
  if (apiKey.startsWith('pat') && apiKey.length > 50) {
    console.log('   ✅ Format clé API valide');
  } else {
    console.log('   ❌ Format clé API invalide (trop courte ou ne commence pas par "pat")');
  }
}

// 4. Validation format Base ID
if (baseId) {
  if (baseId.startsWith('app') && baseId.length === 17) {
    console.log('   ✅ Format Base ID valide');
  } else {
    console.log('   ❌ Format Base ID invalide (doit commencer par "app" et faire 17 caractères)');
  }
}

// 5. Test connectivité (si tout est OK)
if (apiKey && baseId && apiKey.length > 50 && baseId.length === 17) {
  console.log('\n🌐 Test de connectivité...');

  const testConnection = async () => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Connexion Airtable réussie!');
        console.log(`   📊 Records trouvés: ${data.records?.length || 0}`);
        return true;
      } else {
        const error = await response.text();
        console.log(`   ❌ Erreur ${response.status}: ${error}`);
        return false;
      }
    } catch (err) {
      console.log(`   ❌ Erreur de connexion: ${err}`);
      return false;
    }
  };

  const connected = await testConnection();

  console.log('\n📋 Résumé :');
  if (connected) {
    console.log('   🎉 Tout est prêt! Tu peux lancer le projet.');
    console.log('   👉 Utilise: npm run dev (frontend) + npm run server (backend)');
  } else {
    console.log('   ❌ Problème de connexion. Vérifie ta clé API et tes permissions.');
  }
} else {
  console.log('\n❌ Configuration incomplète. Consulte GUIDE_DEMARRAGE.md');
}
