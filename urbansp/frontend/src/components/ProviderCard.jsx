import { useNavigate } from 'react-router-dom';

function ProviderCard({ provider }) {
  const navigate = useNavigate();

  return (
    <article className="provider-card">
      <div className="provider-card-avatar">{provider.initials}</div>
      <div className="provider-card-body">
        <h3>{provider.name}</h3>
        <p className="provider-category">{provider.category}</p>
        <p>{provider.description}</p>
        <div className="provider-meta">
          <span>{provider.rating} ★</span>
          <span>{provider.reviews}+ reviews</span>
        </div>
      </div>
      <button className="button button-secondary" onClick={() => navigate(`/provider/${provider.id}`)}>
        View profile
      </button>
    </article>
  );
}

export default ProviderCard;
