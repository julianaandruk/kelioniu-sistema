import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddTripPage() {
  const { token } = useAuth(); // Gaunamas prisijungusio vartotojo tokenas
  const [suggestions, setSuggestions] = useState([]); // Vietovės pasiūlymų sąrašas
  const [newTrip, setNewTrip] = useState({
    name: '',
    date: '',
    endDate: '',
    notes: '',
    latitude: '',
    longitude: '',
    budget: '' // Biudžetas saugomas kaip tekstas (konvertuosim prieš siuntimą)
  });

  const navigate = useNavigate(); // Navigacija po sėkmingo pridėjimo

  // Reaguoja į vietovės įvedimą ir siunčia užklausą į Nominatim API
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setNewTrip({ ...newTrip, name: value });

    if (value.length > 2) {
      try {
        const res = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: value,
            format: 'json',
            limit: 5,
          },
        });
        setSuggestions(res.data); // Išsaugomi pasiūlymai
      } catch (error) {
        console.error('Autocomplete klaida:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Vartotojui pasirinkus pasiūlytą vietovę – išsaugomi koordinatės ir pavadinimas
  const handleSelectSuggestion = (place) => {
    setNewTrip({
      ...newTrip,
      name: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
    });
    setSuggestions([]);
  };

  // Pateikus formą – siunčiama nauja kelionė į backend
  const handleAddTrip = async (e) => {
    e.preventDefault();
    const { name, date, endDate, budget } = newTrip;

    // Būtinų laukų validacija
    if (!name || !date || !endDate) {
      alert('❗ Prašome užpildyti pavadinimą, datas ir vietovę.');
      return;
    }

    try {
      const tripToSend = {
        ...newTrip,
        budget: budget ? parseFloat(budget) : null // Konvertuojame biudžetą į skaičių
      };

      // Išsiunčiama POST užklausa į backend
      await axios.post('http://localhost:3000/api/trips', tripToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Nukreipiame į kelionių puslapį
      navigate('/trips');
    } catch (error) {
      alert('Nepavyko pridėti kelionės. Bandykite dar kartą.');
    }
  };

  return (
    <div className="container col-md-6 col-lg-5">
      <h2 className="text-center text-success mb-4">Pridėti kelionę</h2>
      <form onSubmit={handleAddTrip}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Vietovės pavadinimas"
          value={newTrip.name}
          onChange={handleLocationChange}
        />
        {suggestions.length > 0 && (
          <ul className="list-group mb-3">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectSuggestion(place)}
                style={{ cursor: 'pointer' }}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        <input
          type="date"
          className="form-control mb-3"
          value={newTrip.date}
          onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
        />
        <input
          type="date"
          className="form-control mb-3"
          value={newTrip.endDate}
          onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
        />
        <textarea
          className="form-control mb-3"
          placeholder="Pastabos"
          rows={3}
          value={newTrip.notes}
          onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Planuojamas biudžetas (€)"
          value={newTrip.budget}
          onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
        />
        <button type="submit" className="btn btn-success w-100">
          💾 Pridėti kelionę
        </button>
      </form>
    </div>
  );
}

export default AddTripPage;
