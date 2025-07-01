import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactModal.css';

const ContactModal = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        emailjs.send('service_jmmqiak', 'template_mw5stkr', form, 'difAjEVPXIo302Cam')
            .then(() => {
                setStatus('🎉 Message sent successfully!');
                setForm({ name: '', email: '', message: '' });
            })
            .catch(() => setStatus('⚠️ Something went wrong. Please try again.'))
            .finally(() => setLoading(false));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="close-btn">×</button>
                <h2>✨ Wanna Collaborate? ✨</h2>
                <form aria-label="Contact form" onSubmit={handleSubmit}>
                    <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
                    <textarea name="message" placeholder="Tell me what you need" value={form.message} onChange={handleChange} required />
                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                        <button type="button" className="button-outline" onClick={onClose}>
                            Cancel
                        </button>
                    </div>

                    {status && <p className="form-status">{status}</p>}
                </form>

            </div>
        </div>
    );
};

export default ContactModal;
