import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Public from '@mui/icons-material/Public';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchRelated();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const { data } = await api.get(`/products/${id}/related`);
      setRelated(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedVariant) return;
    try {
      await addToCart(product._id, selectedVariant._id, quantity);
      setToast({ open: true, message: 'Added to bag!', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: error || 'Failed to add', severity: 'error' });
    }
  };

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#1a1a1a' }} /></div>;
  if (!product) return <div style={{ padding: 48, textAlign: 'center' }}>Product not found</div>;

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
        <span style={{ fontSize: 11, color: '#999' }}>
          <Link to="/" style={{ color: '#999' }}>HOME</Link> / <Link to="/collections" style={{ color: '#999' }}>COLLECTIONS</Link> / <span style={{ color: '#999' }}>{product.category?.toUpperCase()}</span> / <span style={{ color: '#666' }}>{product.name.toUpperCase()}</span>
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          {/* Product Image */}
          <div style={{ flex: '0 0 300px', maxWidth: 360 }}>
            <div style={{ aspectRatio: '1', borderRadius: 4, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
              <img src={product.images[0] || ''} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Product Info */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{product.name}</h1>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>{product.description}</p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
              {product.origin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                  <Public style={{ fontSize: 14, color: '#999' }} />
                  Origin: {product.origin}
                </div>
              )}
              {product.organic && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                  <LocalFlorist style={{ fontSize: 14, color: '#4A6741' }} />
                  Organic
                </div>
              )}
              {product.vegan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                  🌱 Vegan
                </div>
              )}
            </div>

            {/* Price */}
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
              €{(selectedVariant?.price || product.basePrice).toFixed(2)}
            </div>

            {/* Variants */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: '#666' }}>Variants</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants.map(v => (
                  <button
                    key={v._id}
                    onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                    disabled={v.stock === 0}
                    style={{
                      padding: '12px 16px', borderRadius: 4, cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                      border: selectedVariant?._id === v._id ? '2px solid #1a1a1a' : '1px solid #e5e5e5',
                      backgroundColor: selectedVariant?._id === v._id ? '#fafafa' : '#fff',
                      opacity: v.stock === 0 ? 0.4 : 1, fontSize: 12, fontWeight: 500,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 70
                    }}
                  >
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Bag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 4 }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ border: 'none', background: 'none', padding: '8px 12px', cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} disabled={selectedVariant && quantity >= selectedVariant.stock} style={{ border: 'none', background: 'none', padding: '8px 12px', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                style={{
                  padding: '12px 32px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none',
                  fontSize: 12, fontWeight: 600, letterSpacing: '1px', cursor: 'pointer',
                  textTransform: 'uppercase', opacity: (!selectedVariant || selectedVariant.stock === 0) ? 0.4 : 1
                }}
              >
                {selectedVariant?.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
            </div>
          </div>
        </div>

        {/* Steeping Instructions */}
        {product.steepingInstructions && (
          <div style={{ marginTop: 48, borderTop: '1px solid #e5e5e5', paddingTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Steeping instructions</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
              {product.steepingInstructions.servingSize && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⚖️</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 4 }}>SERVING SIZE:</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{product.steepingInstructions.servingSize}</div>
                  </div>
                </div>
              )}
              {product.steepingInstructions.waterTemp && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🌡️</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 4 }}>WATER TEMPERATURE:</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{product.steepingInstructions.waterTemp}</div>
                  </div>
                </div>
              )}
              {product.steepingInstructions.steepingTime && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 4 }}>STEEPING TIME:</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{product.steepingInstructions.steepingTime}</div>
                  </div>
                </div>
              )}
              {product.steepingInstructions.colorTime && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🎨</span>
                  <div style={{ fontSize: 13, color: '#666' }}>{product.steepingInstructions.colorTime}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About This Tea */}
        <div style={{ marginTop: 48, borderTop: '1px solid #e5e5e5', paddingTop: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>About this tea</h2>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {product.flavor && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 6 }}>FLAVOR</div>
                <div style={{ fontSize: 13, color: '#666' }}>{product.flavor}</div>
              </div>
            )}
            {product.qualities && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 6 }}>QUALITIES</div>
                <div style={{ fontSize: 13, color: '#666' }}>{product.qualities}</div>
              </div>
            )}
            {product.caffeine && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 6 }}>CAFFEINE</div>
                <div style={{ fontSize: 13, color: '#666' }}>{product.caffeine}</div>
              </div>
            )}
            {product.allergens?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: 6 }}>ALLERGENS</div>
                <div style={{ fontSize: 13, color: '#666' }}>{product.allergens.join(', ')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        {product.ingredients?.length > 0 && (
          <div style={{ marginTop: 48, borderTop: '1px solid #e5e5e5', paddingTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Ingredient</h2>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
              {product.ingredients.join(', ')}
            </p>
          </div>
        )}

        {/* You may also like */}
        {related.length > 0 && (
          <div style={{ marginTop: 64, borderTop: '1px solid #e5e5e5', paddingTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, textAlign: 'center', marginBottom: 32 }}>You may also like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {related.map(p => (
                <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 4, backgroundColor: '#f9f9f9', marginBottom: 12 }}>
                    <img src={p.images[0] || ''} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{p.description?.substring(0, 30)}...</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>€{p.basePrice.toFixed(2)} / {p.variants?.[0]?.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetails;
