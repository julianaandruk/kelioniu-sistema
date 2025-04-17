import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// FullCalendar + Bootstrap integracija
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

// Stiliai
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fullcalendar/daygrid';

function CalendarPage() {
  const { token } = useAuth(); // Gauti vartotojo token iš konteksto
  const [events, setEvents] = useState([]); // Įvykių sąrašas (kelionės)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/trips', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Suformatuojam kelionių duomenis kalendoriui
        const formatted = res.data.map(trip => ({
          title: trip.name,            // Kelionės pavadinimas
          start: trip.date,            // Pradžios data
          end: trip.endDate,           // Pabaigos data
          extendedProps: {
            notes: trip.notes          // Pastabos (naudojamos vėliau)
          }
        }));

        setEvents(formatted); // Nustatom kalendoriaus įvykius
      } catch (error) {
        console.error('Nepavyko gauti kelionių:', error);
      }
    };

    fetchTrips(); // Iškviečiame funkciją komponentui užsikrovus
  }, [token]);

  // Kai paspaudžiamas įvykis – rodomas pranešimas su info
  const handleEventClick = (info) => {
    const { title, start, end, extendedProps } = info.event;
    alert(
      `📍 ${title}\n` +
      `📅 ${start.toDateString()} – ${end.toDateString()}\n\n` +
      `📝 ${extendedProps.notes || 'Pastabų nėra'}`
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-success text-center mb-4">📆 Kelionių kalendorius</h2>
      <FullCalendar
        plugins={[dayGridPlugin, bootstrap5Plugin]} // Naudojami FullCalendar papildiniai
        themeSystem="bootstrap5"                    // Naudojama Bootstrap 5 tema
        initialView="dayGridMonth"                 // Pradinis kalendoriaus vaizdas
        events={events}                             // Priskiriami įvykiai
        eventClick={handleEventClick}               // Įvykio paspaudimo funkcija
        height="auto"                               // Automatinis aukštis
      />
    </div>
  );
}

export default CalendarPage;
