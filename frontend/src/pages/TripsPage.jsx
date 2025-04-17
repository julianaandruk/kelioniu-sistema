import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function TripsPage() {
  const { token } = useAuth(); // Iš konteksto gaunam token'ą
  const [trips, setTrips] = useState([]); // Kelionių sąrašas
  const [weatherData, setWeatherData] = useState({}); // Orų informacija pagal kelionių ID

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; // API raktas iš .env

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Gaunam keliones iš serverio
        const res = await axios.get('http://localhost:3000/api/trips', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(res.data);

        // Už kiekvieną kelionę gaunam orų prognozę (jei yra koordinatės)
        res.data.forEach(async (trip) => {
          if (trip.latitude && trip.longitude && apiKey) {
            try {
              const weatherRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${trip.latitude}&lon=${trip.longitude}&units=metric&lang=lt&appid=${apiKey}`
              );
              setWeatherData(prev => ({
                ...prev,
                [trip.id]: weatherRes.data
              }));
            } catch (err) {
              console.warn(`Orų klaida kelionei ID ${trip.id}:`, err.message);
              setWeatherData(prev => ({ ...prev, [trip.id]: null }));
            }
          }
        });
      } catch (error) {
        console.error('Klaida gaunant keliones:', error);
      }
    };

    if (token) {
      fetchTrips();
    }
  }, [token, apiKey]);

  // Kelionės ištrynimas
  const handleDelete = async (id) => {
    const confirm = window.confirm('Ar tikrai norite ištrinti šią kelionę?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Pašalinam kelionę iš state
      setTrips(trips.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Klaida tryniant kelionę:', error);
      alert('Nepavyko ištrinti kelionės.');
    }
  };

  return (
    <div className="container">
      <h2 className="text-success mb-4">Mano kelionės</h2>
      <Link to="/trips/add" className="btn btn-success mb-3">➕ Pridėti kelionę</Link>

      {trips.length === 0 ? (
        <p>Šiuo metu neturite kelionių.</p>
      ) : (
        <div className="list-group">
          {trips.map((trip) => (
            <div key={trip.id} className="list-group-item mb-3 p-3 shadow-sm">
              <div className="row">
                {/* Kairė dalis – informacija apie kelionę */}
                <div className="col-md-8">
                  <h5 className="mb-1">{trip.name}</h5>
                  <small>📅 {trip.date} – {trip.endDate}</small>
                  <p className="mb-1">{trip.notes}</p>

                  {/* Biudžeto rodymas, jei yra */}
                  {trip.budget !== null && (
                    <p className="mb-1"><strong>💰 Biudžetas:</strong> {trip.budget} €</p>
                  )}

                  <div className="d-flex gap-2 mt-2">
                    <Link to={`/trips/edit/${trip.id}`} className="btn btn-outline-success btn-sm">✏️ Redaguoti</Link>
                    <button onClick={() => handleDelete(trip.id)} className="btn btn-outline-danger btn-sm">🗑️ Ištrinti</button>
                  </div>
                </div>

                {/* Dešinė dalis – orų informacija */}
                <div className="col-md-4 text-end">
                  {weatherData[trip.id] ? (
                    <div className="bg-light border rounded p-2">
                      <p className="mb-1"><strong>🌤️ Oras:</strong> {weatherData[trip.id].weather[0].description}</p>
                      <p className="mb-1"><strong>🌡️ Temperatūra:</strong> {weatherData[trip.id].main.temp}°C</p>
                      <p className="mb-1"><strong>💨 Vėjas:</strong> {weatherData[trip.id].wind.speed} m/s</p>
                    </div>
                  ) : (
                    <p className="text-muted">Nėra orų duomenų</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripsPage;
