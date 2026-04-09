export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ marginBottom: 8 }}>SHOP.CO</div>
          <p>We have clothes that suits your style and which you&apos;re proud to wear. From women to men.</p>
          <div className="footer-socials">
            <span>𝕏</span><span>f</span><span>📷</span><span>◉</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a><a href="#">Features</a><a href="#">Works</a><a href="#">Career</a>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <a href="#">Customer Support</a><a href="#">Delivery Details</a><a href="#">Terms & Conditions</a><a href="#">Privacy Policy</a>
        </div>
        <div className="footer-col">
          <h4>FAQ</h4>
          <a href="#">Account</a><a href="#">Manage Deliveries</a><a href="#">Orders</a><a href="#">Payments</a>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#">Free eBooks</a><a href="#">Development Tutorial</a><a href="#">How to - Blog</a><a href="#">Youtube Playlist</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Shop.co © 2000-2025, All Rights Reserved</span>
        <div className="payment-icons">
          <span className="payment-icon">VISA</span>
          <span className="payment-icon">MC</span>
          <span className="payment-icon">PayPal</span>
          <span className="payment-icon">aPay</span>
          <span className="payment-icon">gPay</span>
        </div>
      </div>
    </footer>
  );
}
