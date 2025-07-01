import React from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/nails-hero.png';
import Footer from '../components/Footer';
import './NailShop.css';

const tiers = [
  {
    id: 'classic',
    title: 'Classic NeNe',
    price: '$22',
    description: 'Solid color sets, simple and timeless.',
  },
  {
    id: 'frenchie',
    title: 'Frenchie & Friends',
    price: '$33',
    description: 'French tips, chrome, or one 3D element.',
  },
  {
    id: 'museum',
    title: 'The Museum',
    price: '$44',
    description: 'Art-forward, embellished designs with chrome and gel.',
  },
  {
    id: 'custom',
    title: 'Custom Set',
    price: '$55',
    description: 'Fully custom. You send inspo, I bring it to life.',
  },
];

const NailShop = () => {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    navigate(`/nails/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>NeNeNail’dIt | Custom Press-On Nails by NeNe</title>
        <meta name="description" content="Shop custom press-on nails designed by NeNe. Choose your shape, length, and vibe. Bold, soft, or fully custom — we’ve got your hands covered." />
        <meta name="keywords" content="custom press-on nails, almond nails, square nails, gel press-ons, NeNe Nails, handmade nails, nail art" />
        <meta name="author" content="NeNe The Architect" />
        <link rel="canonical" href="https://nenethearchitect.com/nails" />
        <meta property="og:title" content="NeNeNail’dIt | Press-On Nail Sets" />
        <meta property="og:description" content="Fully customizable, press-on nails designed to fit your style. Shop sets or build your own." />
        <meta property="og:url" content="https://nenethearchitect.com/nails" />
        <script type="application/ld+json">
          {`
    {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "NeNeNail’dIt",
      "url": "https://nenethearchitect.com/nails",
      "logo": "https://nenethearchitect.com/logo.png",
      "description": "Custom press-on nail sets by NeNe. Choose your color, shape, and length and design.",
      "sameAs": [
        "https://www.instagram.com/nenethearchitect",
        "https://www.tiktok.com/@nenethearchitect"
      ]
    }
    `}
        </script>
      </Helmet>

      <div className="nailshop-wrapper">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <section className="nailshop-hero">
          <img src={heroImage} alt="Nail Shop Hero" className="nailshop-hero-image" />
          <h2 className="nailshop-subheadline">Premium press-ons for bold babes who keep it cute and creative.</h2>
        </section>
        <section className="nailshop-grid">
          {tiers.map(tier => (
            <div key={tier.id} className="nailshop-card">
              <h2>{tier.title}</h2>
              <p className="price">{tier.price}</p>
              <p>{tier.description}</p>
              <button className="card-button" onClick={() => handleSelect(tier.id)}>
                Select
              </button>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </>
  )
}

export default NailShop