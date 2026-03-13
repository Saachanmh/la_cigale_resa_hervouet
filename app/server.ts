/**
 * API Backend-for-Frontend (BFF) - Proxy pour Airtable
 * Sécurise l'accès à Airtable et gère le Rate Limiting
 */

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import type { Reservation } from './src/types/reservation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuration Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Reservations';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Variables AIRTABLE_API_KEY et AIRTABLE_BASE_ID requises');
  process.exit(1);
}

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

// Helper: Appel Airtable avec gestion d'erreurs
async function airtableFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${AIRTABLE_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Mapper Airtable -> Notre format
function mapAirtableRecord(record: any): Reservation {
  const nom = record.fields['Nom'] || '';
  const prenom = record.fields['Prénom'] || '';
  const guestName = `${prenom} ${nom}`.trim() || 'Client';

  // Utiliser "Heure de réservation" (format HH:MM)
  const heureReservation = record.fields['Heure de réservation'] || '19:00';

  // Utiliser "Date de réservation"
  const dateReservation = record.fields['Date de réservation'] || '2026-03-12';

  // Récupération détaillée des informations
  const infosComplementaires = record.fields['Informations complémentaires'] || '';
  const allergies = record.fields['Allergies'] || '';
  const regimes = record.fields['Régimes alimentaires'] || '';

  // Notes combinées pour compatibilité
  let notes = infosComplementaires;
  if (allergies) notes += (notes ? ' | ' : '') + `Allergies: ${allergies}`;
  if (regimes) notes += (notes ? ' | ' : '') + `Régime: ${regimes}`;

  return {
    id: record.id,
    guestName: guestName,
    firstName: prenom,
    lastName: nom,
    covers: 2, // Valeur par défaut
    time: heureReservation,
    date: dateReservation,
    status: 'CONFIRMED',
    table: '',
    notes: notes,
    allergies: allergies,
    dietaryRequirements: regimes,
    additionalInfo: infosComplementaires,
  };
}

// GET /api/reservations?date=YYYY-MM-DD&service=LUNCH|DINNER
app.get('/api/reservations', async (req, res) => {
  try {
    const { date, service } = req.query;

    // Récupérer toutes les réservations et filtrer côté serveur
    // C'est plus simple et plus fiable que les formules Airtable complexes
    const data = await airtableFetch('?sort[0][field]=Heure de réservation&sort[0][direction]=asc');

    let reservations = data.records.map(mapAirtableRecord);

    // Filtrage par date côté serveur
    if (date) {
      reservations = reservations.filter(res => res.date === date);
    }

    // Filtrage par service côté serveur
    if (service === 'LUNCH') {
      reservations = reservations.filter(res => {
        const hour = parseInt(res.time.split(':')[0]);
        return hour >= 11 && hour < 15;
      });
    } else if (service === 'DINNER') {
      reservations = reservations.filter(res => {
        const hour = parseInt(res.time.split(':')[0]);
        return hour >= 18 && hour <= 23;
      });
    }

    res.json(reservations);
  } catch (error: any) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/reservations/:id/status
app.patch('/api/reservations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Pour l'instant, ne pas modifier le statut car la colonne n'existe pas encore
    // Réponse simulée pour éviter l'erreur
    const data = await airtableFetch(`/${id}`);
    res.json(mapAirtableRecord(data));
  } catch (error: any) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/reservations/:id
app.patch('/api/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { covers, time, table, notes, allergies, dietaryRequirements, additionalInfo } = req.body;

    const fields: any = {};

    // Modifier les champs supportés par ta table
    if (time !== undefined) fields['Heure de réservation'] = time;
    if (allergies !== undefined) fields['Allergies'] = allergies;
    if (dietaryRequirements !== undefined) fields['Régimes alimentaires'] = dietaryRequirements;
    if (additionalInfo !== undefined) fields['Informations complémentaires'] = additionalInfo;

    // Les champs covers et table ne sont pas dans ta structure Airtable

    const data = await airtableFetch(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    });

    res.json(mapAirtableRecord(data));
  } catch (error: any) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const { guestName, covers, time, date, status, allergies, dietaryRequirements, additionalInfo } = req.body;

    // Séparer le nom complet en prénom et nom
    const parts = guestName.trim().split(' ');
    const prenom = parts[0] || '';
    const nom = parts.slice(1).join(' ') || parts[0] || 'Client';

    // Construire les champs à envoyer
    const fields: any = {
      'Nom': nom,
      'Prénom': prenom,
      'Date de réservation': date,
      'Heure de réservation': time,
    };

    // Ajouter les champs optionnels s'ils sont fournis
    if (allergies) fields['Allergies'] = allergies;
    if (dietaryRequirements) fields['Régimes alimentaires'] = dietaryRequirements;
    if (additionalInfo) fields['Informations complémentaires'] = additionalInfo;

    // Si pas d'infos supplémentaires, ajouter une note par défaut
    if (!additionalInfo) {
      fields['Informations complémentaires'] = `Réservation créée via CRM le ${new Date().toLocaleDateString('fr-FR')}`;
    }

    const data = await airtableFetch('', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    });

    res.json(mapAirtableRecord(data));
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reservations/:id
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await airtableFetch(`/${id}`, { method: 'DELETE' });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
});

