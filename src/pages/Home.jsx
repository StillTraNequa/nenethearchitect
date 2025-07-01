import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line no-unused-vars
import { trackEvent } from '../utils/analytics.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import ContactModal from '../components/ContactModal.jsx';
import nailsLogo from '../assets/nenenaildit-logo.png';
import techLogo from '../assets/stilltranequa-logo.png';
import stylingLogo from '../assets/styling-logo.png';
import heroImage from '../assets/hero-collage-nene.png';
import '../components/ContactModal.css';
import './Home.css';

const Home = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Helmet>
                <title>NeNe The Architect | Multi-Hyphenate Creative</title>
                <meta name="description" content="Explore tech services, press-on nails, and brand & personal styling by NeNe — where clean code meets bold beauty." />
                <meta property="og:title" content="NeNe The Architect | Style. Code. Energy." />
                <meta
                    property="og:description"
                    content="From closet to code — shop nails, book styling, and launch digital dreams with NeNe The Architect."
                />
                <meta property="og:image" content="https://nenethearchitect.com/assets/og-home-preview.jpg" />
                <meta property="og:url" content="https://nenethearchitect.com" />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="home-wrapper">
                <section className="hero">
                    <span className="work-link" onClick={() => setShowModal(true)}>
                        Work With Me
                    </span>
                    <img src={heroImage} alt="NeNe Hero Collage" className="hero-image" />
                    <h2>⬇️ Choose your lane and let’s build something fire ⬇️</h2>
                </section>
                <section className="portal-grid">
                    {/* Tech Services */}
                    <Link to="/tech" className="portal-card">
                        <img src={techLogo} alt='StillTraNequa Logo' className='card-logo' />
                        <h2>🧠 Tech Services</h2>
                        <p className="card-description">Web design, development & mobile apps — built to scale and styled to sell.</p>
                        <button className="card-button">Let’s Build</button>
                    </Link>

                    {/* Nails */}
                    <Link to="/nails" className="portal-card">
                        <img src={nailsLogo} alt="NeNe Nail’d It Logo" className="card-logo" />
                        <h2>💅🏽 Press On Nails</h2>
                        <p className="card-description">Custom press-on sets that blend bold design, lasting wear, and your personal vibe.</p>
                        <button className="card-button">Shop Now</button>
                    </Link>

                    {/* Styling */}
                    <Link
                        to="/styling"
                        className="portal-card"
                        onClick={() =>
                            trackEvent({
                                category: 'Homepage',
                                action: 'Clicked Explore Styling',
                                label: 'Styling Link',
                            })
                        }
                    >
                        <img src={stylingLogo} alt="Styling and Branding Logo" className="card-logo" />
                        <h2>👗 Styling/ Branding</h2>
                        <p>
                            Where styling meets branding — because what you wear should align with what you stand for.
                        </p>
                        <button className="card-button">Get Branded</button>
                    </Link>

                </section>
            </div>
            {showModal && <ContactModal onClose={() => setShowModal(false)} />}
            <footer className="site-footer">
                <div className="footer-content">
                    <p>© {new Date().getFullYear()} NeNe The Architect. All rights reserved.</p>
                    <div className="social-links">
                        <a
                            href="https://www.instagram.com/nenethearchitect"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label='Instagram'
                        >
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@nenethearchitect"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label='TikTok'
                        >
                            <FontAwesomeIcon icon={faTiktok} size="lg" />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
