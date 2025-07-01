import React, { useState } from 'react';
import './ColorSwatch.css'; // CSS file we'll define below

const colorSwatches = [
  { name: 'Royal Blue', hex: '#1B2DB7' },
  { name: 'Sky Blue', hex: '#2FB6E3' },
  { name: 'Cherry Red', hex: '#DA1C2D' },
  { name: 'Forest Green', hex: '#165E36' },
  { name: 'Wine', hex: '#7A3A39' },
  { name: 'Rose Petal', hex: '#E6A8AD' },
  { name: 'Lavender Mist', hex: '#B9ACDE' },
  { name: 'Bubblegum', hex: '#FAD4E5' },
  { name: 'Cotton Candy', hex: '#F8A9C1' },
  { name: 'Lemon Drop', hex: '#FCE23C' },
  { name: 'Orange Pop', hex: '#F79228' },
  { name: 'Fuchsia Flame', hex: '#EF3E9F' },
  { name: 'Crimson Kiss', hex: '#8A1020' },
  { name: 'Taupe Beige', hex: '#A49A8F' },
  { name: 'Espresso', hex: '#4A2D1A' },
  { name: 'Plum', hex: '#5D286A' },
  { name: 'Hot Pink', hex: '#F63198' },
  { name: 'Jet Black', hex: '#111111' },
  { name: 'Lime Sherbet', hex: '#B6EB6E' },
  { name: 'Sage Gray', hex: '#BBC8B1' },
  { name: 'Peachy Keen', hex: '#F7B078' },
  { name: 'Cream Puff', hex: '#FEEFC1' },
  { name: 'Mint Mojito', hex: '#91EBC7' },
  { name: 'Baby Blue', hex: '#9CD3E5' },
  { name: 'Snow White', hex: '#FFFFFF' },
];


const ColorSwatch = ({ onSelect }) => {
  const [selectedHex, setSelectedHex] = useState(null);

  const handleClick = (hex, name) => {
    setSelectedHex(hex);
    onSelect?.({hex, name});
  };

  return (
    <div className="swatch-grid">
      {colorSwatches.map(({ hex, name }) => (
        <div
          key={hex}
          className={`swatch ${selectedHex === hex ? 'selected' : ''}`}
          style={{ backgroundColor: hex }}
          onClick={() => handleClick(hex, name)}
          title={hex}
        />
      ))}
    </div>
  );
};

export default ColorSwatch;
