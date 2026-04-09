'use client';
import Link from 'next/link';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  salePrice: number;
  isOnSale: boolean;
  discountPercentage: number;
  rating: number;
  images: string[];
  paymentType: string;
  pointsPrice: number;
}

export default function ProductCard({ _id, name, price, salePrice, isOnSale, discountPercentage, rating, paymentType, pointsPrice }: ProductCardProps) {
  const renderStars = (r: number) => {
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    let stars = '★'.repeat(full);
    if (half) stars += '½';
    stars += '☆'.repeat(5 - full - (half ? 1 : 0));
    return stars;
  };

  const emojis = ['👕', '👖', '👔', '🧥', '👗', '🩳'];
  const emoji = emojis[parseInt(_id) % emojis.length];

  return (
    <Link href={`/product/${_id}`} className="product-card">
      <div className="product-image">
        <div className="product-image-placeholder">{emoji}</div>
        {isOnSale && <span className="sale-badge">-{discountPercentage}%</span>}
        {paymentType === 'points' && <span className="points-badge">Points Only</span>}
        {paymentType === 'hybrid' && <span className="points-badge">💰/⭐</span>}
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <div className="product-rating">
          <span className="stars">{renderStars(rating)}</span>
          <span className="rating-text">{rating}/5</span>
        </div>
        <div className="product-price">
          <span className="current-price">${isOnSale ? Math.round(salePrice) : price}</span>
          {isOnSale && <span className="original-price">${price}</span>}
          {isOnSale && <span className="discount-badge">-{discountPercentage}%</span>}
        </div>
        {(paymentType === 'points' || paymentType === 'hybrid') && (
          <div className="points-price">⭐ {pointsPrice} pts</div>
        )}
      </div>
    </Link>
  );
}
