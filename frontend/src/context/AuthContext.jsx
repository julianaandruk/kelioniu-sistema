import { createContext, useContext, useEffect, useState } from 'react';

// Sukuriamas autentifikacijos kontekstas
const AuthContext = createContext();

// Konteksto tiekėjas, kuris apgaubia visą aplikaciją
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Išsaugotas prisijungęs vartotojas
  const [token, setToken] = useState(null); // JWT tokenas

  // Funkcija prisijungimui – saugo tokeną ir nustato vartotoją
  const login = (token) => {
    localStorage.setItem('token', token);     // Išsaugoma naršyklės localStorage
    setToken(token);                          // Nustatomas token į state
    const payload = JSON.parse(atob(token.split('.')[1])); // Dekoduojamas JWT tokenas
    setUser({ email: payload.email });        // Ištraukiamas el. paštas iš tokeno
  };

  // Funkcija atsijungimui – ištrina tokeną ir vartotojo duomenis
  const logout = () => {
    localStorage.removeItem('token'); // Išvalomas tokenas iš localStorage
    setToken(null);                   // Išvalomas iš state
    setUser(null);
  };

  // Kai puslapis užsikrauna – patikriname, ar jau turime išsaugotą tokeną
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken); // Nustatome tokeną
      const payload = JSON.parse(atob(savedToken.split('.')[1])); // Dekoduojame
      setUser({ email: payload.email }); // Nustatome vartotoją
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Pagalbinė funkcija naudoti kontekstą kitur aplikacijoje
export const useAuth = () => useContext(AuthContext);
