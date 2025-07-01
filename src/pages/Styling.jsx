import React from 'react';
import comingSoon from '../assets/coming-soon-text.png'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Styling.css';

const Styling = () => {
  return (
    <>
      <Helmet>
        <title>Styling & Branding | NeNe The Architect</title>
        <meta
          name="description"
          content="Personal styling and brand development tailored to your vibe, voice, and vision. Coming soon."
        />
      </Helmet>
      <section className="coming-soon-hero">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <div className="hero-content">
          <div className="service-buttons">
            <div className="service-button">Image Consulting</div>
            <div className="service-button">Personal Branding</div>
            <div className="service-button">Brand Development</div>
            <div className="service-button">Personal Shopping</div>
            <div className="service-button">Closet Revamps</div>
            <div className="service-button">Styling</div>
          </div>
          <img
            src={comingSoon}
            alt="Coming Soon"
            className="coming-soon-img"
          />
          <p className="coming-soon-subtext">
            Where timeless legacy meets modern luxury — and every detail tells the story of you.
            Your image, your essence, your evolution — fully styled, fully branded.
          </p>
        </div>
      </section>
    </>
  );
};

export default Styling;
