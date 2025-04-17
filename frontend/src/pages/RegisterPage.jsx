import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  // Būsenos laukeliai naudotojo įvedimui
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Navigacija po sėkmingos registracijos

  // Registracijos formos pateikimas
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Siunčiam POST užklausą į backend
      const res = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
      });

      // Jei sėkmingai – rodom žinutę ir po 1.5s nukreipiam į prisijungimo puslapį
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      // Jei klaida – parodoma klaidos žinutė
      setMessage(err.response?.data?.message || 'Klaida registruojant');
    }
  };

  return (
    <div className="container col-md-6 col-lg-4">
      <h2 className="text-center text-success mb-4">Registracija</h2>

      {/* Registracijos forma */}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-success w-100">Registruotis</button>
      </form>

      {/* Žinutė apie rezultatą */}
      {message && <p className="text-center text-danger mt-3">{message}</p>}
    </div>
  );
}

export default RegisterPage;
