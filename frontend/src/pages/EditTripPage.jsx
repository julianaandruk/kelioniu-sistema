import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

function EditTripPage() {
  const { token } = useAuth(); // Gauti vartotojo tokeną iš konteksto
  const navigate = useNavigate();
  const { tripId } = useParams(); // Gauti kelionės ID iš URL

  // Kelionės informacijos būsena
  const [trip, setTrip] = useState({
    name: '',
    date: '',
    endDate: '',
    notes: '',
    latitude: null,
    longitude: null,
    budget: '' // saugoma kaip tekstas, bet siunčiama kaip skaičius
  });

  // Vietovės pasiūlymai autocomplete'ui
  const [suggestions, setSuggestions] = useState([]);

  // Užkraunama redaguojamos kelionės informacija
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrip({
          name: res.data.name || '',
          date: res.data.date || '',
          endDate: res.data.endDate || '',
          notes: res.data.notes || '',
          latitude: res.data.latitude || null,
          longitude: res.data.longitude || null,
          budget: res.data.budget !== null && res.data.budget !== undefined
            ? res.data.budget.toString()
            : '' // jei nėra biudžeto, paliekam tuščią lauką
        });
      } catch (error) {
        alert('Nepavyko gauti kelionės duomenų.');
      }
    };

    fetchTrip();
  }, [tripId, token]);

  // Išsaugoti redaguotą kelionę
  const handleEditTrip = async (e) => {
    e.preventDefault();
    try {
      const updatedTrip = {
        ...trip,
        budget: trip.budget ? parseFloat(trip.budget) : null // konvertuojam biudžetą į skaičių
      };

      await axios.put(`http://localhost:3000/api/trips/${tripId}`, updatedTrip, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/trips'); // nukreipiama į kelionių puslapį
    } catch (error) {
      alert('Nepavyko išsaugoti pakeitimų.');
    }
  };

  // Reaguojama į vietovės pavadinimo įvedimą ir pateikiami pasiūlymai
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setTrip({ ...trip, name: value });

    if (value.length > 2) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value}&format=json&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  // Vartotojui pasirinkus pasiūlytą vietovę
  const handleSelectSuggestion = (place) => {
    setTrip({
      ...trip,
      name: place.display_name,
      latitude: place.lat,
      longitude: place.lon
    });
    setSuggestions([]);
  };

  return (
    <div className="container col-md-6 col-lg-5">
      <h2 className="text-center text-success mb-4">Redaguoti kelionę</h2>
      <form onSubmit={handleEditTrip}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Kelionės pavadinimas"
          value={trip.name}
          onChange={handleLocationChange}
        />
        {suggestions.length > 0 && (
          <ul className="list-group mb-3">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectSuggestion(s)}
                style={{ cursor: 'pointer' }}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}

        <input
          type="date"
          className="form-control mb-3"
          value={trip.date}
          onChange={(e) => setTrip({ ...trip, date: e.target.value })}
        />
        <input
          type="date"
          className="form-control mb-3"
          value={trip.endDate}
          onChange={(e) => setTrip({ ...trip, endDate: e.target.value })}
        />
        <textarea
          className="form-control mb-3"
          placeholder="Pastabos"
          rows={3}
          value={trip.notes}
          onChange={(e) => setTrip({ ...trip, notes: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Planuojamas biudžetas (€)"
          value={trip.budget}
          onChange={(e) => setTrip({ ...trip, budget: e.target.value })}
        />
        <button type="submit" className="btn btn-success w-100">
          💾 Išsaugoti pakeitimus
        </button>
      </form>
    </div>
  );
}

export default EditTripPage;
