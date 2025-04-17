import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pagrindiniai komponentai
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Puslapiai
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TripsPage from './pages/TripsPage';
import AddTripPage from './pages/AddTripPage';
import EditTripPage from './pages/EditTripPage';
import MapPage from './pages/MapPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    // React Router konfigūracija
    <Router>
      {/* Flex konteineris su min-height visam ekranui */}
      <div className="d-flex flex-column min-vh-100">
        
        {/* Navigacijos juosta viršuje */}
        <Navbar />

        {/* Pagrindinė puslapio dalis */}
        <main className="container my-4">
          <Routes>
            {/* Maršrutų susiejimas su komponentais */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/add" element={<AddTripPage />} />
            <Route path="/trips/edit/:tripId" element={<EditTripPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>

        {/* Puslapio apačia */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

