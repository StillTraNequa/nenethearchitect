import React from 'react'
import { useNavigate } from 'react-router-dom'
import onHandProducts from '../data/onHandProducts'
import { useCart } from '../contexts/CartContext'

const OnHand = () => {
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const handleAddToCart = (product) => {
        addToCart(product)
        navigate('/nails/cart')
    }

    return (
        <div className="px-4 py-10 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">On Hand Nails</h1>
            <p className="text-center max-w-xl mx-auto mb-10 text-gray-600">
                These press-ons are already made and ready to ship! What you see is what you get.
                Add your favorites to your cart before they’re gone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {onHandProducts.map((product, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
                    >
                        <img
                            src={product.thumbnail}
                            alt={product.color}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex-grow flex flex-col">
                            <h2 className="text-lg font-semibold mb-1">
                                {product.color} • {product.style}
                            </h2>
                            <p className="text-sm text-gray-600 mb-2 capitalize">
                                {product.shape} • {product.length}
                            </p>
                            <button
                                onClick={() => {
                                    addToCart(product)
                                    navigate('/nails/cart')
                                }}
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
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OnHand
