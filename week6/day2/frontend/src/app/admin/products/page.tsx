'use client';
import Link from 'next/link';
import { mockProducts } from '@/lib/mockData';

const categories = [
  { name: 'T-shirts', count: 21 },
  { name: 'Jeans', count: 32 },
  { name: 'Shirts', count: 13 },
  { name: 'Shorts', count: 14 },
  { name: 'Formal', count: 6 },
  { name: 'Hoodies', count: 11 },
];

export default function AdminProductsPage() {
  return (
    <>
      <div className="page-header">
        <h1>All Products</h1>
        <Link href="/admin/products/new" className="add-product-btn">
          ⊕ ADD NEW PRODUCT
        </Link>
      </div>
      <div className="page-breadcrumb">Home &gt; All Products</div>

      <div style={{ display: 'flex', gap: 30 }}>
        {/* Categories sidebar */}
        <div style={{ minWidth: 200 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Categories</h3>
          {categories.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
              <span>{c.name}</span>
              <span style={{ background: '#e2e8f0', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{c.count}</span>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          <div className="admin-products-grid">
            {mockProducts.map(p => {
              const emojis = ['👕', '👖', '👔', '🧥', '👗', '🩳'];
              const emoji = emojis[parseInt(p._id) % emojis.length];
              return (
                <div key={p._id} className="admin-product-card">
                  <div className="admin-product-top">
                    <div className="admin-product-img">{emoji}</div>
                    <div className="admin-product-meta">
                      <h3>{p.name}</h3>
                      <p>{p.category}</p>
                      <span className="product-admin-price">${p.price}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>⋯</span>
                  </div>
                  <div className="admin-product-summary">
                    {p.description.substring(0, 80)}...
                  </div>
                  <div className="admin-product-stats">
                    <span>↑ Sales: {Math.floor(Math.random() * 2000)}</span>
                    <span style={{ color: '#f59e0b' }}>— Remaining: {p.stock}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <span>...</span>
            <button className="page-btn">10</button>
            <button className="page-btn">NEXT &gt;</button>
          </div>
        </div>
      </div>
    </>
  );
}
