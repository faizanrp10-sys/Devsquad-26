import React from 'react';
import { Link } from 'react-router-dom';
import LocationOn from '@mui/icons-material/LocationOn';
import Email from '@mui/icons-material/Email';
import Phone from '@mui/icons-material/Phone';

const Footer = () => {
  const collections = ['Black teas', 'Green teas', 'White teas', 'Herbal teas', 'Matcha', 'Chai', 'Oolong', 'Rooibos', 'Teaware'];
  const learn = ['About us', 'About our teas', 'Tea academy'];
  const customerService = ['Ordering and payment', 'Delivery', 'Privacy and policy', 'Terms & Conditions'];

  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e5e5', padding: '48px 0 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          {/* Collections */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, color: '#1a1a1a' }}>Collections</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {collections.map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <Link to={`/collections?category=${item.replace(' teas', ' Tea')}`} style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, color: '#1a1a1a' }}>Learn</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {learn.map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, color: '#1a1a1a' }}>Customer Service</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {customerService.map(item => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, color: '#1a1a1a' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#666' }}>
                <LocationOn style={{ fontSize: 16, marginTop: 2, color: '#999' }} />
                <span>3 Falahi, Falahi St, Pasdaran Ave,<br />Shiraz, Fars Province,<br />Iran</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#666' }}>
                <Email style={{ fontSize: 16, color: '#999' }} />
                <span>Email: store@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#666' }}>
                <Phone style={{ fontSize: 16, color: '#999' }} />
                <span>Tel: +98 9170389406</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
