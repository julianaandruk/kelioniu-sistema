const express = require('express');
const bcrypt = require('bcrypt'); // Slaptažodžių šifravimui
const jwt = require('jsonwebtoken'); // Tokenų generavimui
const router = express.Router();
const db = require('../db'); // Prijungiama prie SQLite duomenų bazės

//  Registracija
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Patikrinama, ar vartotojas jau egzistuoja
  const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (userExists) return res.status(400).json({ message: 'Vartotojas jau yra' });

  // Slaptažodžio šifravimas ir įrašymas į duomenų bazę
  const hashedPassword = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

  // Grąžinamas atsakymas, kad registracija sėkminga
  res.status(201).json({ message: 'Registracija sėkminga' });
});

//  Prisijungimas
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Tikrinama, ar vartotojas egzistuoja
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(400).json({ message: 'Vartotojas nerastas' });

  // Tikrinama, ar slaptažodis teisingas
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Neteisingas slaptažodis' });

  // Sugeneruojamas JWT tokenas
  const token = jwt.sign(
    { id: user.id, email: user.email }, // Duomenys, kurie bus saugomi tokene
    'slaptas_raktas',                  // Pasirašymo raktas
    { expiresIn: '1h' }                // Token galiojimo laikas
  );

  // Išsiunčiamas tokenas vartotojui
  res.json({ token });
});

module.exports = router;
