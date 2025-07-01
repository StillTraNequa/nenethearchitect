import React from 'react';
import './NailPreview.css';

const NailPreview = ({ color, shape, length }) => {
  if (!color || !shape || !length) return null;

  const shapeClass = shape.toLowerCase().replace(/\s/g, '-');
  const lengthClass = length.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="nail-preview-wrapper">
      <div
        className={`nail-visual ${shapeClass} ${lengthClass}`}
        style={{ backgroundColor: color.hex }}
        title={`${length} ${shape} in ${color.name}`}
      ></div>
    </div>
  );
};

export default NailPreview;
