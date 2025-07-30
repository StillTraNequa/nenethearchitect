import React, { useState } from 'react'
import recreatableSets from '../data/recreatableSets'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

const NailItAgain = () => {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [options, setOptions] = useState({})

  const handleOptionChange = (setId, field, value) => {
    setOptions(prev => ({
      ...prev,
      [setId]: { ...prev[setId], [field]: value }
    }))
  }

  const handleReorder = (setId, title) => {
    const selection = options[setId]
    if (!selection?.shape || !selection?.length || !selection?.color) return

    const product = {
      id: `reorder-${setId}-${Date.now()}`,
      title,
      type: 'reorder',
      ...selection,
      quantity: 1,
      price: 55, // or whatever custom pricing
    }

    addToCart(product)
    navigate('/nails/cart')
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-4 text-center">I Can Nail It Again</h2>
      <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">Reorder any of these past sets with your own shape, length, and color twist!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {recreatableSets.map((set) => (
          <div key={set.id} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
            <img src={set.thumbnail} alt={set.title} className="w-full h-48 object-cover rounded-lg mb-3" />
            <h3 className="font-semibold mb-2">{set.title}</h3>
            
            <select className="mb-1 w-full p-2 border rounded"
              onChange={(e) => handleOptionChange(set.id, 'shape', e.target.value)}>
              <option value="">Choose Shape</option>
              <option>Square</option>
              <option>Coffin</option>
              <option>Almond</option>
              <option>Stiletto</option>
            </select>

            <select className="mb-1 w-full p-2 border rounded"
              onChange={(e) => handleOptionChange(set.id, 'length', e.target.value)}>
              <option value="">Choose Length</option>
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
              <option>XL</option>
            </select>

            <select className="mb-3 w-full p-2 border rounded"
              onChange={(e) => handleOptionChange(set.id, 'color', e.target.value)}>
              <option value="">Choose Color</option>
              <option>Clear/Nude Base</option>
              <option>Pastel</option>
              <option>Chrome</option>
              <option>Neon</option>
              {/* Add your palette */}
            </select>

            <button
              onClick={() => handleReorder(set.id, set.title)}
              style={{
                backgroundColor: '#e7e9b1',
                color: '#e86ba5',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#decbef'
                e.target.style.color = 'white'
                e.target.style.boxShadow = '0 0 8px #decbef, 0 0 12px #decbef'
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = '#e7e9b1'
                e.target.style.color = '#e86ba5'
                e.target.style.boxShadow = 'none'
              }}
            >
              Reorder This
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NailItAgain
