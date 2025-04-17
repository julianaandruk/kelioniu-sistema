import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth(); // Gaunam login funkciją iš Auth konteksto
  const navigate = useNavigate(); // Navigacijai po prisijungimo
  const [email, setEmail] = useState(''); // El. pašto laukelio būsena
  const [password, setPassword] = useState(''); // Slaptažodžio laukelio būsena
  const [message, setMessage] = useState(''); // Pranešimo apie klaidą būsena

  // Prisijungimo formos pateikimo funkcija
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Siunčiam užklausą į backendą
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      const token = res.data.token; // Ištraukiam token iš atsakymo
      login(token); // Išsaugom tokeną ir prisijungiam
      navigate('/'); // Pereinam į pagrindinį puslapį
    } catch (err) {
      // Klaidos pranešimas, jei neteisingi duomenys ar problema su serveriu
      setMessage(err.response?.data?.message || 'Prisijungimo klaida');
    }
  };

  return (
    <div className="container col-md-6 col-lg-4">
      <h2 className="text-center text-success mb-4">Prisijungimas</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Įrašome reikšmę į būseną
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Įrašome reikšmę į būseną
        />
        <button type="submit" className="btn btn-success w-100">Prisijungti</button>
      </form>
      {/* Rodomas klaidos pranešimas, jei toks yra */}
      {message && <p className="text-center text-danger mt-3">{message}</p>}
    </div>
  );
}

export default LoginPage;
