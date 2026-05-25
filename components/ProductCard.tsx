"use client";

import { useCart } from "@/context/CartContext";

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[];
    stripePriceId?: string | null;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { add } = useCart();

  const handleAddToCart = () => {
    if (!product.stripePriceId) {
      alert("Sorry, this product cannot be added to the cart because it is not available for purchase.");
      return;
    }

    add({
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      images: product.images[0] || "", 
      stripePriceId: product.stripePriceId,
    });
    
    alert(`${product.title} added to cart! 🛒`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-64 w-full bg-gray-50 border-b border-gray-100">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-indigo-600 font-bold text-xl mb-6 mt-auto">
          {product.price} {product.currency}
        </p>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}