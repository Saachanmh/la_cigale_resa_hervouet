// Inspection approfondie de la structure Airtable pour identifier les champs éditables
import * as dotenv from 'dotenv';
dotenv.config();

async function inspectFieldsDeep() {
  console.log('🔍 Inspection approfondie de la structure Airtable...\n');

  try {
    // 1. Récupérer les métadonnées de la base (si possible)
    console.log('📊 Structure actuelle des records:');

    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Reservations?maxRecords=3`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Erreur:', await response.text());
      return;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      console.log(`✅ ${data.records.length} record(s) analysé(s):\n`);

      // Analyser chaque champ dans chaque record
      const fieldsAnalysis: any = {};

      data.records.forEach((record: any, index: number) => {
        console.log(`📝 Record ${index + 1} (${record.id}):`);
        Object.keys(record.fields).forEach(fieldName => {
          const value = record.fields[fieldName];
          const type = typeof value;

          if (!fieldsAnalysis[fieldName]) {
            fieldsAnalysis[fieldName] = {
              type: type,
              values: [],
              isFormula: false
            };
          }

          fieldsAnalysis[fieldName].values.push(value);
          console.log(`   "${fieldName}": ${JSON.stringify(value)} (${type})`);
        });
        console.log('');
      });

      console.log('📋 Analyse des champs:');
      Object.keys(fieldsAnalysis).forEach(fieldName => {
        const analysis = fieldsAnalysis[fieldName];
        const uniqueValues = [...new Set(analysis.values)];

        console.log(`\n🏷️  "${fieldName}":`);
        console.log(`   Type: ${analysis.type}`);
        console.log(`   Valeurs: ${uniqueValues.slice(0, 3).map(v => JSON.stringify(v)).join(', ')}${uniqueValues.length > 3 ? '...' : ''}`);

        // Détecter les champs potentiellement calculés
        if (fieldName.includes('(AI)') || fieldName.includes('Résumé') || fieldName === 'Heure (24h)') {
          console.log(`   ⚠️  POSSIBLEMENT CALCULÉ - Ne pas modifier`);
        } else if (fieldName === 'Nom' || fieldName === 'Informations...' || fieldName === 'Jour de la semaine') {
          console.log(`   ✅ PROBABLEMENT ÉDITABLE`);
        }
      });

      console.log('\n🛠️  Recommandations pour le POST:');
      console.log('   ✅ Champs sûrs à utiliser:');
      console.log('      - "Nom" (texte)');
      console.log('      - "Informations..." (texte)');
      console.log('      - "Jour de la semaine" (texte)');
      console.log('   ❌ Champs à éviter:');
      console.log('      - "Heure (24h)" (calculé)');
      console.log('      - "Résumé réservation (AI)" (IA)');
      console.log('      - "Type de régime (AI)" (IA)');

    } else {
      console.log('⚠️ Aucun enregistrement trouvé.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

inspectFieldsDeep();
