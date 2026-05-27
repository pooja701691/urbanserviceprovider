import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [avatar, setAvatar] = useState('');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        setAvatar(user.avatar || '');
        setPreview(user.avatar || '');
      }
      try {
        const profile = await getUserProfile();
        setForm({ name: profile.name || '', email: profile.email || '', phone: profile.phone || '' });
        setAvatar(profile.avatar || '');
        setPreview(profile.avatar || '');
      } catch (err) {
        console.warn('Profile load failed', err);
      }
    };
    initialize();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      if (file) {
        formData.append('avatar', file);
      }

      const updatedUser = await updateProfile(formData);
      setForm((prev) => ({ ...prev, name: updatedUser.name, phone: updatedUser.phone }));
      setAvatar(updatedUser.avatar || avatar);
      setPreview(updatedUser.avatar || preview);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container profile-page">
      <div className="section-heading">
        <span className="eyebrow">Account settings</span>
        <h2>Manage your profile</h2>
        <p>Update your contact information, view your account details, and change your avatar.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="avatar-preview">
            {preview ? <img src={preview} alt="Profile avatar" /> : <div className="avatar-placeholder">{form.name?.[0] || 'U'}</div>}
          </div>
          <div>
            <h3>{form.name || 'User name'}</h3>
            <p>{form.email}</p>
          </div>
        </div>

        <div className="profile-form-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Email Address
              <input name="email" value={form.email} readOnly />
            </label>

            <label>
              Phone Number
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>

            <label>
              Avatar
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>

            {error && <p className="form-error">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button className="button button-block" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Profile;
