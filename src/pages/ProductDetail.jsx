import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ColorSwatch from '../components/ColorSwatch';
import Footer from '../components/Footer';
// import NailPreview from '../components/NailPreview';
import { Helmet } from 'react-helmet';
import './ProductDetail.css';

const productDetails = {
  classic: {
    title: 'Classic NeNe',
    price: '$22',
    description: 'Solid color press-ons in your favorite shade. Simple, sleek, and timeless.',
    fields: ['Color', 'Shape', 'Length'],
  },
  frenchie: {
    title: 'Frenchie & Friends',
    price: '$33',
    description: 'French tips, 1 3D element, or a full chrome set. Intermediate but bold.',
    fields: ['Color', 'Shape', 'Length', 'Add-Ons', 'Inspo Image', 'Custom Notes'],
  },
  museum: {
    title: 'The Museum',
    price: '$44',
    description: 'Statement sets with layered gel, chrome, & designs. For main character energy.',
    fields: ['Color', 'Shape', 'Length', 'Add-Ons', 'Inspo Image', 'Custom Notes'],
  },
  custom: {
    title: 'Custom Set',
    price: '$55+',
    description: 'Let’s build from scratch — inspired by your vision, occasion, or mood.',
    fields: ['Color', 'Shape', 'Length', 'Add-Ons', 'Inspo Image', 'Custom Notes'],
    isCustom: true,
  },
};

const ProductDetail = () => {
  const { slug } = useParams();
  const data = productDetails[slug];
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    color: '',
    shape: '',
    length: '',
    addons: '',
    inspo: null,
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      slug,
      title: data.title,
      price: data.price,
      color: formState.color,
      shape: selectedShape,
      length: selectedLength,
      addons: formState.addons,
      inspo: formState.inspo,
      notes: formState.notes,
      quantity: 1,
    };

    addToCart(product);
    navigate('/nails/cart');
  };

  if (!data) return <div className="not-found">Product not found.</div>;

  const renderField = (field) => {
    switch (field) {
      case 'Color':
        return (
          <div className="form-group color-group" key={field}>
            <label>Color</label>
            <ColorSwatch
              onSelect={({ name, hex }) =>
                setFormState((prev) => ({
                  ...prev,
                  color: { name, hex }
                }))
              }
            />
            {formState.color?.name && (
              <p className="selected-color-note">
                Selected Color: <strong>{formState.color.name}</strong>
              </p>
            )}
          </div>
        );

      case 'Shape':
        return (
          <div className="form-group">
            <label>Shape</label>
            <div className="shape-options">
              {['Square', 'Almondetto', 'Coffin'].map((shape) => (
                <button
                  key={shape}
                  type="button"
                  className={`shape-btn ${selectedShape === shape ? 'active' : ''}`}
                  onClick={() => setSelectedShape(shape)}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        );

      case 'Length':
        return (
          <div className="form-group">
            <label>Length</label>
            <div className="length-options">
              {['Extra Short', 'Short', 'Medium', 'Long'].map((length) => (
                <button
                  key={length}
                  type="button"
                  className={`length-btn ${selectedLength === length ? 'active' : ''}`}
                  onClick={() => setSelectedLength(length)}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>
        );

      case 'Add-Ons':
        return (
          <div className="form-group" key={field}>
            <label>Add-Ons (Optional)</label>
            <input
              name="addons"
              placeholder="Chrome, gems, 3D, etc."
              value={formState.addons}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, addons: e.target.value }))
              }
            />
          </div>
        );

      case 'Inspo Image':
        return (
          <div className="form-group" key={field}>
            <label>Inspo Image</label>
            <input
              type="file"
              name="inspo"
              accept="image/*"
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, inspo: e.target.files[0] }))
              }
            />
          </div>
        );

      case 'Custom Notes':
        return (
          <div className="form-group" key={field}>
            <label>Custom Notes</label>
            <textarea
              name="notes"
              placeholder="Tell me what you’re envisioning..."
              value={formState.notes}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{data.title} | NeNeNail’dIt</title>
        <meta
          name="description"
          content={`Customize your ${data.title} set. ${data.description}`}
        />
        <meta
          name="keywords"
          content={`custom nails, ${data.title.toLowerCase()}, press-on nails, handmade nails`}
        />
        <meta property="og:title" content={`${data.title} | NeNeNail’dIt`} />
        <meta
          property="og:description"
          content={`Create your ${data.title} set with NeNe. Choose your shape, length, color, and more.`}
        />
        <meta property="og:url" content={`https://nenethearchitect.com/nails/${slug}`} />
        <meta property="og:image" content="https://nenethearchitect.com/preview.png" />
      </Helmet>

      <div className="product-detail-wrapper">
        <Link to="/nails" className="back-button">
          ← Back to Shop
        </Link>
        <div className="product-detail-page">
          <h1>{data.title}</h1>
          <p className="price">{data.price}</p>
          <p className="description">{data.description}</p>

          <form className="product-form" onSubmit={handleSubmit}>
            {data.fields.map((field, idx) => renderField(field))}
            {(formState.color || selectedShape || selectedLength) && (
              <div className="preview-box">
                <h4>Your Choices:</h4>
                {/* <NailPreview
                color={formState.color}
                shape={selectedShape}
                length={selectedLength}
              /> */}
                <ul>
                  {formState.color && (
                    <li>
                      <strong>Color:</strong>{' '}
                      <span
                        style={{
                          display: 'inline-block',
                          width: '1rem',
                          height: '1rem',
                          backgroundColor: formState.color.hex,
                          borderRadius: '50%',
                          marginRight: '0.5rem',
                          verticalAlign: 'middle',
                          border: '1px solid #ccc'
                        }}
                      ></span>
                      <span>{formState.color.name}</span>
                    </li>
                  )}
                  {selectedShape && <li><strong>Shape:</strong> {selectedShape}</li>}
                  {selectedLength && <li><strong>Length:</strong> {selectedLength}</li>}
                </ul>
              </div>
            )}

            <button type="submit">Add to Cart</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
