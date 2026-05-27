import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="page-container notfound-page">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>Looks like the address you entered does not exist on Urban Service Provider Platform.</p>
        <button className="button" onClick={() => navigate('/')}>Return home</button>
      </div>
    </section>
  );
}

export default NotFound;
