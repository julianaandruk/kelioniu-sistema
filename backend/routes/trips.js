const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Gauti visas keliones (tik prisijungusio vartotojo)
router.get('/', verifyToken, (req, res) => {
  const trips = db.prepare('SELECT * FROM trips WHERE userId = ?').all(req.user.id);
  res.json(trips);
});

// Gauti vieną kelionę pagal ID
router.get('/:id', verifyToken, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: 'Kelionė nerasta' });
  res.json(trip);
});

// Pridėti kelionę
router.post('/', verifyToken, (req, res) => {
  const { name, date, endDate, notes, latitude, longitude } = req.body;
  let budget = req.body.budget;

  // Patikrinama ar privalomi laukai užpildyti
  if (!name?.trim() || !date || !endDate) {
    return res.status(400).json({ message: 'Trūksta laukų' });
  }

  // Konvertuojamas biudžetas į skaičių, jei pateiktas
  if (budget !== null && budget !== undefined && budget !== '') {
    budget = parseFloat(budget);
  } else {
    budget = null;
  }

  // Įrašoma nauja kelionė į duomenų bazę
  const result = db.prepare(`
    INSERT INTO trips (name, date, endDate, notes, latitude, longitude, budget, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name.trim(), date, endDate, notes || '', latitude || null, longitude || null, budget, req.user.id);

  // Grąžinama sukurta kelionė
  const newTrip = db.prepare('SELECT * FROM trips WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTrip);
});

// Redaguoti kelionę
router.put('/:id', verifyToken, (req, res) => {
  const { name, date, endDate, notes, latitude, longitude } = req.body;
  let budget = req.body.budget;

  // Patikrinama ar kelionė egzistuoja ir priklauso vartotojui
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ message: 'Kelionė nerasta' });

  // Konvertuojamas biudžetas į skaičių, jei pateiktas
  if (budget !== null && budget !== undefined && budget !== '') {
    budget = parseFloat(budget);
  } else {
    budget = null;
  }

  // Atnaujinami kelionės duomenys
  db.prepare(`
    UPDATE trips
    SET name = ?, date = ?, endDate = ?, notes = ?, latitude = ?, longitude = ?, budget = ?
    WHERE id = ? AND userId = ?
  `).run(name.trim(), date, endDate, notes || '', latitude || null, longitude || null, budget, req.params.id, req.user.id);

  // Grąžinama atnaujinta kelionė
  const updated = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Ištrinti kelionę
router.delete('/:id', verifyToken, (req, res) => {
  // Šalinama kelionė, jei ji priklauso vartotojui
  const result = db.prepare('DELETE FROM trips WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Kelionė nerasta' });
  res.json({ message: 'Kelionė ištrinta' });
});

module.exports = router;
