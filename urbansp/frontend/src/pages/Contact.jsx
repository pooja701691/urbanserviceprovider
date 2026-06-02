import { useState } from 'react';
import { submitContactForm } from '../services/contactService';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await submitContactForm(form);
      setSuccess(res.message || 'Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to send message.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    border: '1.5px solid var(--border)', borderRadius: '12px',
    background: 'var(--surface)', color: 'var(--text)',
    fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'grid', gap: '0.4rem', fontWeight: 700, fontSize: '0.83rem', color: 'var(--text)' };

  return (
    <section className="page-container">
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="eyebrow">Get in touch</span>
        <h2 style={{ margin: '0.5rem 0 0.5rem', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
          Contact Us
        </h2>
        <p style={{ color: 'var(--muted)', margin: 0, maxWidth: '480px', marginInline: 'auto' }}>
          Have a question or need help? Fill in the form and we'll get back to you as soon as possible.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* Info cards */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { icon: '📧', title: 'Email Us', info: 'support@usp.com' },
            { icon: '📞', title: 'Call Us', info: '+91 98765 43210' },
            { icon: '🕐', title: 'Working Hours', info: 'Mon – Sat, 9 AM – 6 PM' },
            { icon: '📍', title: 'Address', info: 'New Delhi, India' },
          ].map(c => (
            <div key={c.title} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.25rem', background: 'var(--surface)',
              borderRadius: '16px', boxShadow: 'var(--shadow)',
            }}>
              <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem' }}>{c.title}</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.info}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800 }}>Send a Message</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={labelStyle}>
                Full Name *
                <input required name="name" value={form.name} onChange={set} placeholder="John Doe" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Phone Number
                <input name="phone" type="tel" value={form.phone} onChange={set} placeholder="+91 98765 43210" style={inputStyle} />
              </label>
            </div>

            <label style={labelStyle}>
              Email Address *
              <input required name="email" type="email" value={form.email} onChange={set} placeholder="you@example.com" style={inputStyle} />
            </label>

            <label style={labelStyle}>
              Subject *
              <input required name="subject" value={form.subject} onChange={set} placeholder="How can we help you?" style={inputStyle} />
            </label>

            <label style={labelStyle}>
              Message *
              <textarea
                required name="message" rows={5} value={form.message} onChange={set}
                placeholder="Write your message here..."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </label>

            {error   && <div className="rp-error">⚠️ {error}</div>}
            {success && <div style={{ padding: '0.8rem 1rem', background: '#d1fae5', color: '#065f46', borderRadius: '10px', fontWeight: 600 }}>✅ {success}</div>}

            <button type="submit" className="button" disabled={loading} style={{ justifySelf: 'start', minWidth: '160px' }}>
              {loading ? 'Sending...' : '📤 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
