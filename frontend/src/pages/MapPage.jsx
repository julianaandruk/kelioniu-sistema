import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapPage() {
  const { token } = useAuth(); // Gaunam token iš autentifikacijos konteksto
  const [trips, setTrips] = useState([]); // Kelionių duomenų būsena

  // Pradinis žemėlapio centras – Vilnius, Lietuva
  const center = [54.6872, 25.2797];

  // Žalias markerio ikonos stilius
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Gauti keliones iš API, kai komponentas užsikrauna
  useEffect(() => {
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

    fetchTrips();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2 className="text-center text-success mb-4">🌍 Mano kelionių žemėlapis</h2>

      {/* Žemėlapio konteineris */}
      <div className="border rounded shadow" style={{ height: '500px' }}>
        <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
          {/* Žemėlapio plytelių sluoksnis (OpenStreetMap) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markeriai kiekvienai kelionei su koordinatėmis */}
          {trips.map((trip) => {
            const { id, name, notes, date, endDate, latitude, longitude } = trip;

            // Tik jei yra koordinatės, rodom markerį
            if (latitude && longitude) {
              return (
                <Marker key={id} position={[latitude, longitude]} icon={greenIcon}>
                  <Popup>
                    <strong>{name}</strong><br />
                    {notes && <em>{notes}</em>}<br />
                    📅 {date} – {endDate}
                  </Popup>
                </Marker>
              );
            }

            return null; // Jei nėra koordinatės, nieko nerodom
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
