import React from 'react';
import './Footer.css'; // Create this file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="nail-footer">
            <div className="nail-footer-content">
                <p>&copy; {new Date().getFullYear()} NeNeNail’dIt</p>

                <nav className="nail-footer-links">
                    <a href="/nails">Home</a>
                    <a href="mailto:nails@nenethearchitect.com">Contact</a>
                </nav>
                <div className="nail-socials">
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
    );
};

export default Footer;
