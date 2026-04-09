'use client';

const orderProducts = [
  { name: 'Skinny Fit Jeans', orderId: '#25421', qty: 2, total: '$800.40' },
  { name: 'Checkered Shirt', orderId: '#25421', qty: 2, total: '$800.40' },
  { name: 'Graphic T-shirt', orderId: '#25421', qty: 2, total: '$800.40' },
  { name: 'Bermuda Shorts', orderId: '#25421', qty: 2, total: '$800.40' },
];

export default function OrderDetailPage() {
  return (
    <>
      <div className="page-header">
        <h1>Orders Details</h1>
      </div>
      <div className="page-breadcrumb">Home &gt; Order List &gt; Order Details</div>

      {/* Order Top */}
      <div className="dash-card" style={{ marginBottom: 20 }}>
        <div className="order-top-bar">
          <div className="order-id-tag">
            Orders ID: #6743
            <span className="order-status status-pending">Pending</span>
          </div>
          <div className="order-actions-row">
            <span style={{ fontSize: 14, color: '#666' }}>📅 Feb 16, 2022 - Feb 20, 2022</span>
            <select style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <option>Change Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <button style={{ fontSize: 20 }}>🖨️</button>
            <button className="btn-save">Save</button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="order-detail-grid">
          <div className="info-card">
            <div className="info-card-icon">👤</div>
            <div>
              <h4>Customer</h4>
              <p>Full Name: Shristi Singh</p>
              <p>Email: shristi@gmail.com</p>
              <p>Phone: +91 904 231 1212</p>
              <button className="info-card-btn">View profile</button>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📦</div>
            <div>
              <h4>Order Info</h4>
              <p>Shipping: Next express</p>
              <p>Payment Method: Paypal</p>
              <p>Status: Pending</p>
              <button className="info-card-btn">Download info</button>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📍</div>
            <div>
              <h4>Deliver to</h4>
              <p>Address: Dharam Colony, Palam Vihar, Gurgaon, Haryana</p>
              <button className="info-card-btn">View profile</button>
            </div>
          </div>
        </div>

        {/* Payment + Note */}
        <div className="payment-note-grid">
          <div className="info-card" style={{ flexDirection: 'column' }}>
            <h4>Payment Info</h4>
            <p>💳 Master Card **** **** 6557</p>
            <p>Business name: Shristi Singh</p>
            <p>Phone: +91 904 231 1212</p>
          </div>
          <div className="info-card" style={{ flexDirection: 'column' }}>
            <h4>Note</h4>
            <textarea placeholder="Type some notes" rows={3} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, resize: 'none' }} />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Products</span>
          <span>⋮</span>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Order ID</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderProducts.map((p, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" />
                    <span style={{ width: 40, height: 40, background: '#f0f0f0', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>📦</span>
                    {p.name}
                  </div>
                </td>
                <td>{p.orderId}</td>
                <td>{p.qty}</td>
                <td>{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', padding: '16px 0', borderTop: '1px solid #e2e8f0', marginTop: 16, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 60, padding: '6px 0' }}><span>Subtotal</span><span>$3,201.60</span></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 60, padding: '6px 0' }}><span>Tax (20%)</span><span>$640.32</span></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 60, padding: '6px 0' }}><span>Discount</span><span>$0</span></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 60, padding: '6px 0' }}><span>Shipping Rate</span><span>$0</span></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 60, padding: '10px 0', fontWeight: 800, fontSize: 18, borderTop: '1px solid #e2e8f0' }}><span>Total</span><span>$3,841.92</span></div>
        </div>
      </div>
    </>
  );
}
