'use client';
import Link from 'next/link';

const orders = [
  { product: 'T-shirt', orderId: '#25426', date: 'Nov 8th, 2023', customer: 'Kavin', status: 'Delivered', amount: '$200.00' },
  { product: 'Jeans', orderId: '#25425', date: 'Nov 7th, 2023', customer: 'Komael', status: 'Cancelled', amount: '$200.00' },
  { product: 'Shirt', orderId: '#25424', date: 'Nov 6th, 2023', customer: 'Nikhil', status: 'Delivered', amount: '$200.00' },
  { product: 'Shorts', orderId: '#25423', date: 'Nov 5th, 2023', customer: 'Shivam', status: 'Cancelled', amount: '$200.00' },
  { product: 'Polo', orderId: '#25422', date: 'Nov 4th, 2023', customer: 'Shadab', status: 'Delivered', amount: '$200.00' },
  { product: 'Graphic Tee', orderId: '#25421', date: 'Nov 2nd, 2023', customer: 'Yogesh', status: 'Delivered', amount: '$200.00' },
  { product: 'Bermuda', orderId: '#25423', date: 'Nov 1st, 2023', customer: 'Sunita', status: 'Cancelled', amount: '$200.00' },
  { product: 'Striped Shirt', orderId: '#25421', date: 'Nov 1st, 2023', customer: 'Priyanka', status: 'Delivered', amount: '$200.00' },
];

export default function AdminOrdersPage() {
  return (
    <>
      <div className="page-header">
        <h1>Orders List</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#666' }}>📅 Feb 16, 2022 - Feb 20, 2022</span>
          <select style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <option>Change Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>
      <div className="page-breadcrumb">Home &gt; Order List</div>

      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Recent Purchases</span>
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
            {orders.map((o, i) => (
              <tr key={i} style={{ cursor: 'pointer' }}>
                <td><input type="checkbox" /></td>
                <td><Link href={`/admin/orders/${o.orderId.replace('#', '')}`}>{o.product}</Link></td>
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

      <div className="pagination">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">4</button>
        <span>...</span>
        <button className="page-btn">10</button>
        <button className="page-btn">NEXT &gt;</button>
      </div>
    </>
  );
}
