'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mockData';

const reviews = [
  { name: 'Sarah M.', rating: 5, text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: 'Alex K.', rating: 5, text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
  { name: 'James L.', rating: 5, text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends." },
];

export default function Home() {
  const newArrivals = mockProducts.slice(0, 4);
  const topSelling = mockProducts.slice(4, 8);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
            <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
            <a href="/shop" className="shop-now-btn">Shop Now</a>
            <div className="stats-row">
              <div className="stat"><span className="stat-value">200+</span><span className="stat-label">International Brands</span></div>
              <div className="stat"><span className="stat-value">2,000+</span><span className="stat-label">High-Quality Products</span></div>
              <div className="stat"><span className="stat-value">30,000+</span><span className="stat-label">Happy Customers</span></div>
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="brands-bar">
          <span>VERSACE</span><span>ZARA</span><span>GUCCI</span><span>PRADA</span><span>Calvin Klein</span>
        </section>

        {/* New Arrivals */}
        <h2 className="section-title">NEW ARRIVALS</h2>
        <div className="products-grid">
          {newArrivals.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
        <a href="/shop" className="view-all-btn">View All</a>

        {/* Top Selling */}
        <h2 className="section-title">TOP SELLING</h2>
        <div className="products-grid">
          {topSelling.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
        <a href="/shop" className="view-all-btn">View All</a>

        {/* Browse by Style */}
        <h2 className="section-title">BROWSE BY DRESS STYLE</h2>
        <div className="browse-style-section">
          <div className="style-rows">
            <div className="style-row">
              <div className="style-card"><h3>Casual</h3></div>
              <div className="style-card"><h3>Formal</h3></div>
            </div>
            <div className="style-row">
              <div className="style-card"><h3>Party</h3></div>
              <div className="style-card"><h3>Gym</h3></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <h2 className="section-title">OUR HAPPY CUSTOMERS</h2>
        <div className="reviews-section">
          <div className="reviews-carousel">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">{'★'.repeat(r.rating)}</div>
                <div className="reviewer-name">{r.name} ✅</div>
                <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
          <div className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Enter your email address" />
            <button className="newsletter-btn">Subscribe to Newsletter</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
