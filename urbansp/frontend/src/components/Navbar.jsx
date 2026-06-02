import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/') }>
        <span className="brand-mark">USP</span>
        <div>
          <h1>Urban Service Provider</h1>
          <p>Find trusted professionals near you</p>
        </div>
      </div>

      <button className="nav-toggle" onClick={() => setMenuOpen(prev => !prev)}>
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/nearby">Nearby</NavLink>
        {user && <NavLink to="/booking">Book a Service</NavLink>}
        {user && <NavLink to="/profile">Profile</NavLink>}
        {user && user.role !== 'admin' && <NavLink to="/dashboard/user">My Bookings</NavLink>}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/dashboard/admin">📊 Dashboard</NavLink>
            <NavLink to="/dashboard/admin/services">🔧 Services</NavLink>
            <NavLink to="/dashboard/admin/bookings">📅 Bookings</NavLink>
            <NavLink to="/dashboard/admin/users">👤 Users</NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">
              Hi, {user.name}
              <span className={`role-badge role-badge-${user.role}`}>
                {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </span>
            </span>
            <button className="button button-secondary" onClick={() => { logout(); navigate('/'); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="button button-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="button" onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
