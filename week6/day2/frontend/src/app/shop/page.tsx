'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mockData';

const categories = ['T-shirts', 'Shorts', 'Shirts', 'Jeans'];
const colors = ['#00c12b', '#f00', '#ff0', '#f90', '#00bfff', '#0000ff', '#800080', '#ff69b4', '#fff', '#000'];
const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large'];

export default function ShopPage() {
  return (
    <>
      <Header />
      <div className="breadcrumb">
        <a href="/">Home</a> &gt; <span>Casual</span>
      </div>
      <div className="category-page">
        {/* Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <span>Filters</span>
            <span>☰</span>
          </div>

          <div className="filter-section">
            <div className="filter-list">
              {categories.map(c => (
                <a href="#" key={c}>{c} &rsaquo;</a>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price <span>^</span></h4>
            <div style={{ padding: '10px 0' }}>
              <input type="range" min="50" max="500" style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                <span>$50</span><span>$200</span>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Colors <span>^</span></h4>
            <div className="filter-colors">
              {colors.map((c, i) => (
                <span key={i} className={`color-dot ${i === 0 ? 'active' : ''}`} style={{ background: c }} />
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Size <span>^</span></h4>
            <div className="filter-sizes">
              {sizes.map(s => (
                <button key={s} className={`size-btn ${s === 'Large' ? 'active' : ''}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Dress Style <span>^</span></h4>
            <div className="filter-list">
              <a href="#">Casual &rsaquo;</a>
              <a href="#">Formal &rsaquo;</a>
              <a href="#">Party &rsaquo;</a>
              <a href="#">Gym &rsaquo;</a>
            </div>
          </div>

          <button className="apply-filter-btn">Apply Filter</button>
        </aside>

        {/* Products */}
        <div className="category-content">
          <div className="category-header">
            <h1>Casual</h1>
            <span className="category-meta">Showing 1-{mockProducts.length} of {mockProducts.length} Products | Sort by: <strong>Most Popular</strong></span>
          </div>
          <div className="products-grid-3">
            {mockProducts.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
          <div className="pagination">
            <button className="page-btn">&larr; Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span>...</span>
            <button className="page-btn">10</button>
            <button className="page-btn">Next &rarr;</button>
          </div>
        </div>
      </div>

      <div className="newsletter-section">
        <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
        <div className="newsletter-form">
          <input type="email" className="newsletter-input" placeholder="Enter your email address" />
          <button className="newsletter-btn">Subscribe to Newsletter</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
