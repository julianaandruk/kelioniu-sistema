import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
  const { user, token } = useAuth(); // Gaunam vartotojo info ir tokeną iš konteksto
  const [trips, setTrips] = useState([]); // Visi vartotojo kelionių duomenys

  useEffect(() => {
    // Užklausiam kelionių tik jei yra vartotojas ir token
    const fetchTrips = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/trips', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(res.data); // Įrašom keliones į state
      } catch (error) {
        console.error('Nepavyko gauti kelionių:', error);
      }
    };

    if (user && token) {
      fetchTrips();
    }
  }, [user, token]);

  // Filtruojam tik tas keliones, kurios jau įvyko (pagal pabaigos datą)
  const today = new Date();
  const pastTrips = trips.filter(t => new Date(t.endDate) < today);

  // Grąžina naujausios įvykusios kelionės pavadinimą
  const getLastTripName = () => {
    if (pastTrips.length === 0) return null;
    const sorted = [...pastTrips].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
    return sorted[0]?.name || null;
  };

  // Apskaičiuoja, kiek unikalių šalių aplankyta
  const getUniqueCountries = () => {
    const countries = pastTrips
      .map(t => {
        const parts = t.name?.split(',').map(p => p.trim());
        return parts?.[parts.length - 1] || null; // Grąžina paskutinį pavadinimo segmentą – šalį
      })
      .filter(c => c !== null && c !== '');
    return new Set(countries).size;
  };

  return (
    <div className="container text-center mt-4">
      {/* Hero nuotrauka */}
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=300&q=80"
        alt="Travel banner"
        className="img-fluid mb-4 rounded shadow"
      />

      {/* Pagrindinis antraštė ir paantraštė */}
      <h1 className="text-success fw-bold">🌍 Kelionių planavimo sistema</h1>
      <p className="lead text-muted">Atrask pasaulį – viena kelionė vienu metu ✈️</p>

      {user ? (
        <>
          {/* Vartotojo pasisveikinimas */}
          <p className="fw-semibold mt-4">👋 Sveiki, {user.email}!</p>

          {/* Statistikos blokas, jei yra bent viena kelionė */}
          {trips.length > 0 && (
            <div className="bg-light rounded p-3 mt-3 shadow-sm">
              <p>🧳 Jūs jau sukūrėte <strong>{trips.length}</strong> kelionių!</p>
              <p>🗺️ Aplankėte <strong>{getUniqueCountries()}</strong> skirtingas šalis!</p>
              {getLastTripName() && (
                <p>📍 Paskutinė kelionė buvo į <strong>{getLastTripName()}</strong></p>
              )}
            </div>
          )}

          {/* Mygtukas eiti į kelionių puslapį */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/trips" className="btn btn-success btn-lg mt-4 shadow">
              ✈️ Peržiūrėti savo keliones
            </Link>
          </motion.div>
        </>
      ) : (
        // Jei neprisijungęs vartotojas – siūloma prisijungti arba registruotis
        <div className="mt-4">
          <p>Prisijunkite arba užsiregistruokite ir pradėkite planuoti keliones!</p>
          <Link to="/login" className="btn btn-outline-success me-2">Prisijungti</Link>
          <Link to="/register" className="btn btn-success">Registruotis</Link>
        </div>
      )}

      {/* Apatinė žinutė */}
      <p className="text-muted mt-5" style={{ fontSize: '0.9rem' }}>
        Visi keliai veda į prisiminimus. Pradėkite savo kelionę šiandien. 🌍
      </p>
    </div>
  );
}

export default HomePage;

