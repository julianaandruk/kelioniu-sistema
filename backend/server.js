const express = require('express'); // Express framework'as
const cors = require('cors'); // Middleware leidžiantis naudoti CORS (leidžia frontend'ui prisijungti)
require('dotenv').config(); // Įkeliami kintamieji iš .env failo
require('./db'); // Inicijuojama duomenų bazė (trips.db ir lentelės)

// Maršrutų failai (autentifikacija ir kelionės)
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

const app = express(); // Sukuriamas Express serveris

// Middleware
app.use(cors()); // Leidžiami užklausų srautai iš kitų domenų (naudinga frontend'ui)
app.use(express.json()); // Leidžia priimti JSON formato duomenis iš body

// Maršrutai
app.use('/api/auth', authRoutes);   // Registracija ir prisijungimas
app.use('/api/trips', tripRoutes); // Kelionių CRUD veiksmai

// Pagrindinis šakninis endpointas testavimui
app.get('/', (req, res) => {
  res.send('Kelionių API veikia!');
});

// Nustatomas serverio prievadas (port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveris paleistas: http://localhost:${PORT}`);
});
