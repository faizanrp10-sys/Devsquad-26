'use client';

const stats = [
  { title: 'Total Orders', value: '$126,500', trend: '↑ 34.7%', icon: '📦' },
  { title: 'Active Orders', value: '$126,500', trend: '↑ 34.7%', icon: '📦' },
  { title: 'Completed Orders', value: '$126,500', trend: '↑ 34.7%', icon: '📦' },
  { title: 'Return Orders', value: '$126,500', trend: '↑ 34.7%', icon: '📦' },
];

const recentOrders = [
  { product: 'T-shirt', orderId: '#25426', date: 'Nov 8th, 2023', customer: 'Kavin', status: 'Delivered', amount: '$200.00' },
  { product: 'Jeans', orderId: '#25425', date: 'Nov 7th, 2023', customer: 'Komael', status: 'Cancelled', amount: '$200.00' },
  { product: 'Shirt', orderId: '#25424', date: 'Nov 6th, 2023', customer: 'Nikhil', status: 'Delivered', amount: '$200.00' },
  { product: 'Shorts', orderId: '#25423', date: 'Nov 5th, 2023', customer: 'Shivam', status: 'Cancelled', amount: '$200.00' },
  { product: 'Polo', orderId: '#25422', date: 'Nov 4th, 2023', customer: 'Shadab', status: 'Delivered', amount: '$200.00' },
  { product: 'Graphic Tee', orderId: '#25421', date: 'Nov 2nd, 2023', customer: 'Yogesh', status: 'Delivered', amount: '$200.00' },
];

const bestSellers = [
  { name: 'Skinny Fit Jeans', price: '$126.50', sales: '999 sales' },
  { name: 'Checkered Shirt', price: '$126.50', sales: '999 sales' },
  { name: 'Graphic T-shirt', price: '$126.50', sales: '999 sales' },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span style={{ fontSize: 14, color: '#666' }}>📅 Oct 11, 2023 - Nov 11, 2023</span>
      </div>
      <div className="page-breadcrumb">Home &gt; Dashboard</div>

      {/* Stats Cards */}
      <div className="dash-stats">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className="card-header">
              <span className="card-title">{s.title}</span>
              <span>⋮</span>
            </div>
            <div className="card-value">
              <span className="card-icon">{s.icon}</span>
              {s.value}
            </div>
            <div className="card-trend">{s.trend}</div>
            <div className="card-compared">Compared to Oct 2023</div>
          </div>
        ))}
      </div>

      {/* Sales Chart + Best Sellers */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Sale Graph</span>
            <div className="tab-pills">
              <button className="tab-pill">WEEKLY</button>
              <button className="tab-pill active">MONTHLY</button>
              <button className="tab-pill">YEARLY</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-line" />
            <svg viewBox="0 0 600 200" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '200px' }}>
              <polyline
                points="0,180 100,170 200,160 300,140 400,80 500,30 600,50"
                fill="none" stroke="#2a7d8e" strokeWidth="3"
              />
              <polyline
                points="0,180 100,170 200,160 300,140 400,80 500,30 600,50"
                fill="rgba(42,125,142,0.1)" stroke="none"
              />
            </svg>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Best Sellers</span>
            <span>⋮</span>
          </div>
          {bestSellers.map((b, i) => (
            <div key={i} className="best-seller-item">
              <div className="best-seller-img">📦</div>
              <div className="best-seller-info">
                <h4>{b.name}</h4>
                <p>${b.price}</p>
              </div>
              <div className="best-seller-stats">
                <div className="price">{b.price}</div>
                <div className="sales">{b.sales}</div>
              </div>
            </div>
          ))}
          <button className="report-btn">REPORT</button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Recent Orders</span>
          <span>⋮</span>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Product</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o, i) => (
              <tr key={i}>
                <td><input type="checkbox" /></td>
                <td>{o.product}</td>
                <td>{o.orderId}</td>
                <td>{o.date}</td>
                <td>
                  <div className="customer-cell">
                    <span className="customer-avatar">👤</span>
                    {o.customer}
                  </div>
                </td>
                <td>
                  <span className={`status-dot ${o.status.toLowerCase()}`}></span>
                  {o.status}
                </td>
                <td>{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
