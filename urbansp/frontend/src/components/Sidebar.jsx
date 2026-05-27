import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={() => navigate('/')}>
          <span className="sidebar-brand-mark">USP</span>
          {!collapsed && <span>Admin</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📊</span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/dashboard/admin/services" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">🔧</span>
          {!collapsed && <span>Services</span>}
        </NavLink>
        <NavLink to="/dashboard/admin/providers" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">👥</span>
          {!collapsed && <span>Providers</span>}
        </NavLink>
        <NavLink to="/dashboard/admin/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📅</span>
          {!collapsed && <span>Bookings</span>}
        </NavLink>
        <NavLink to="/dashboard/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">👤</span>
          {!collapsed && <span>Users</span>}
        </NavLink>
        <NavLink to="/dashboard/admin/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📈</span>
          {!collapsed && <span>Analytics</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate('/')} className="sidebar-logout">
          <span className="icon">🚪</span>
          {!collapsed && <span>Back to Home</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
