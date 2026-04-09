'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';

const detailColors = ['#4a4a3a', '#2e5a3a', '#3a3a5a'];
const detailSizes = ['Small', 'Medium', 'Large', 'X-Large'];

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const product = mockProducts.find(p => p._id === params.id) || mockProducts[0];
  const [selectedSize, setSelectedSize] = useState('Large');
  const [qty, setQty] = useState(1);
  const related = mockProducts.filter(p => p._id !== product._id).slice(0, 4);

  const emojis = ['👕', '👖', '👔', '🧥', '👗', '🩳'];
  const emoji = emojis[parseInt(product._id) % emojis.length];

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      isOnSale: product.isOnSale,
      image: product.images[0] || '',
      quantity: qty,
      paymentType: product.paymentType,
      pointsPrice: product.pointsPrice,
    });
  };

  const effectivePrice = product.isOnSale ? product.salePrice : product.price;

  return (
    <>
      <Header />
      <div className="breadcrumb">
        <a href="/">Home</a> &gt; <a href="/shop">Shop</a> &gt; <span>{product.name}</span>
      </div>
      <div className="product-detail">
        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="gallery-thumbs">
              {[0, 1, 2].map(i => (
                <div key={i} className={`thumb ${i === 0 ? 'active' : ''}`}>{emoji}</div>
              ))}
            </div>
            <div className="gallery-main">{emoji}</div>
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <div className="detail-rating">
              <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span className="rating-text">{product.rating}/5</span>
            </div>
            <div className="detail-price">
              <span className="detail-current">${Math.round(effectivePrice)}</span>
              {product.isOnSale && <span className="detail-original">${product.price}</span>}
              {product.isOnSale && <span className="detail-discount">-{product.discountPercentage}%</span>}
            </div>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-section">
              <label>Select Colors</label>
              <div className="detail-colors">
                {detailColors.map((c, i) => (
                  <span key={i} className={`detail-color ${i === 0 ? 'active' : ''}`} style={{ background: c }} />
                ))}
              </div>
            </div>

            <div className="detail-section">
              <label>Choose Size</label>
              <div className="detail-sizes">
                {detailSizes.map(s => (
                  <button key={s} className={`detail-size ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="add-to-cart-row">
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>

            {(product.paymentType === 'points' || product.paymentType === 'hybrid') && (
              <div className="detail-points-info">
                ⭐ This product can be purchased with <strong>{product.pointsPrice} loyalty points</strong>
                {product.paymentType === 'hybrid' && ' or with money.'}
                {product.paymentType === 'points' && '. Points only!'}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tabs-header">
            <button className="tab-btn">Product Details</button>
            <button className="tab-btn active">Rating & Reviews</button>
            <button className="tab-btn">FAQs</button>
          </div>
        </div>

        {/* Related */}
        <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>
        <div className="products-grid">
          {related.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
      </div>
      <Footer />
    </>
  );
}
