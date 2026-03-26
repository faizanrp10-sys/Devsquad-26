import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Verified from '@mui/icons-material/Verified';
import Inventory from '@mui/icons-material/Inventory';
import Redeem from '@mui/icons-material/Redeem';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=9');
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'BLACK TEA', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400' },
    { name: 'GREEN TEA', image: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6?auto=format&fit=crop&q=80&w=400' },
    { name: 'WHITE TEA', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400' },
    { name: 'MATCHA', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=400' },
    { name: 'HERBAL TEA', image: 'https://images.unsplash.com/photo-1544787210-221370baff0c?auto=format&fit=crop&q=80&w=400' },
    { name: 'CHAI', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=400' },
    { name: 'OOLONG', image: 'https://images.unsplash.com/photo-1523906630133-f113565a4d5d?auto=format&fit=crop&q=80&w=400' },
    { name: 'ROOIBOS', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=400' },
    { name: 'TEAWARE', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=400' },
  ];

  const features = [
    { icon: <Inventory style={{ fontSize: 20, color: '#666' }} />, text: '100+ KIND OF LOOSER TEA' },
    { icon: <Verified style={{ fontSize: 20, color: '#666' }} />, text: 'CERTIFICATED ORGANIC TEAS' },
    { icon: <LocalShipping style={{ fontSize: 20, color: '#666' }} />, text: 'FREE DELIVERY' },
    { icon: <Redeem style={{ fontSize: 20, color: '#666' }} />, text: 'SAMPLE FOR ALL TEAS' },
  ];

  return (
    <div>
      {/* Hero Section — matching Landing-page.JPG */}
      <section style={{ display: 'flex', flexWrap: 'wrap', minHeight: 400 }}>
        {/* Left — Image */}
        <div style={{ flex: '1 1 50%', minWidth: 300, position: 'relative', paddingBottom: 10 }}>
          <img
            src="./Hero-section.jpg"
            alt="Tea"
            style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 628 }}
          />
        </div>
        {/* Right — Text */}
        <div style={{ flex: '1 1 50%', minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px 48px 60px', backgroundColor: '#fff' }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 20, color: '#1a1a1a' }}>
            Every day is unique,<br />just like our tea
          </h1>
          <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7, marginBottom: 12, maxWidth: 400 }}>
            Lorem ipsum dolor sit amet consectetur. Cras nibh rutrum duis adipiscing dolor, sapien fusce nisl ac...
          </p>
          <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
            Lorem ipsum dolor sit amet consectetur. Cras nibh rutrum duis adipiscing odio. Varius fusce nisl quis id...
          </p>
          <Link to="/collections">
            <button style={{
              padding: '12px 32px', border: '1px solid #1a1a1a', backgroundColor: '#fff',
              color: '#1a1a1a', fontSize: 12, fontWeight: 600, letterSpacing: '1px',
              cursor: 'pointer', textTransform: 'uppercase'
            }}>
              BROWSE TEAS
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Icons Row */}
      <section style={{ borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {f.icon}
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', color: '#666' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Learn More */}
      <section style={{ textAlign: 'center', padding: '32px 24px' }}>
        <Link to="/collections">
          <button style={{
            padding: '10px 32px', border: '1px solid #1a1a1a', backgroundColor: '#fff',
            color: '#1a1a1a', fontSize: 12, fontWeight: 600, letterSpacing: '1px',
            cursor: 'pointer', textTransform: 'uppercase'
          }}>
            LEARN MORE
          </button>
        </Link>
      </section>

      {/* Our Collections Grid */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 400, marginBottom: 40, color: '#1a1a1a' }}>Our Collections</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {categories.map((cat) => (
              <Link to={`/collections?category=${cat.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}`} key={cat.name}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1', cursor: 'pointer' }}>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', backgroundColor: 'rgba(255,255,255,0.85)' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', color: '#1a1a1a' }}>{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
