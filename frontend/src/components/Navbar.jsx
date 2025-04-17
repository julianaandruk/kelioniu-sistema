import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importuojam paveikslėlį

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo} // Naudojam importuotą paveikslėlį
            alt="Logo"
            width="140"
            height="60"
            className="d-inline-block align-text-top me-2"
          />
        </Link>

        {/* Toggle */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Meniu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Pagrindinis</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/trips">Kelionės</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/map">Žemėlapis</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/calendar">Kalendorius</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light ms-2">Atsijungti</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Prisijungti</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registruotis</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
