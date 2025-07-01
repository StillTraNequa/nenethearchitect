import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './ThankYou.css'; // Create this file for styling

const ThankYou = () => {
    return (
        <div className="thank-you-page">
            <Helmet>
                <title>Thank You for Your Order | NeNeNail’dIt</title>
                <meta name="description" content="Your order has been received and is being processed with love and care." />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Thank You | NeNeNail’dIt" />
                <meta property="og:description" content="Your custom nails are being prepped and packed!" />
            </Helmet>

            <div className="thank-you-content">
                <h1>✨ Thank You, Babe! ✨</h1>
                <p>Your order has been received and we’re getting started on your custom nails.</p>
                <p>Check your email for confirmation and shipping updates.</p>
                <Link to="/nails" className="shop-more-btn">← Shop More Sets</Link>
            </div>

            <Footer />
        </div>
    );
};

export default ThankYou;
