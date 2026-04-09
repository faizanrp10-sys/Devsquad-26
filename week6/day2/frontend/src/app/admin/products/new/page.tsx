'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', category: '', brand: '', sku: '',
    stock: 0, price: 0, salePrice: 0, paymentType: 'money', pointsPrice: 0,
    discountPercentage: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock),
          price: Number(form.price),
          salePrice: Number(form.salePrice),
          pointsPrice: Number(form.pointsPrice),
          images: [],
        }),
      });
      if (res.ok) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create product');
      }
    } catch {
      alert('Could not connect to server');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Product Details</h1>
      </div>
      <div className="page-breadcrumb">Home &gt; All Products &gt; Add New Product</div>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-section">
          <div className="form-group-admin">
            <label>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Type name here" required />
          </div>
          <div className="form-group-admin">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Type Description here" rows={5} required />
          </div>
          <div className="form-group-admin">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Type Category here" required />
          </div>
          <div className="form-group-admin">
            <label>Brand Name</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Type brand name here" />
          </div>
          <div className="form-row">
            <div className="form-group-admin">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="Fox-3983" />
            </div>
            <div className="form-group-admin">
              <label>Stock Quantity</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="1258" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-admin">
              <label>Regular Price</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="$1000" required />
            </div>
            <div className="form-group-admin">
              <label>Sale Price</label>
              <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="$450" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-admin">
              <label>Payment Type</label>
              <select name="paymentType" value={form.paymentType} onChange={handleChange}>
                <option value="money">Money Only</option>
                <option value="points">Points Only</option>
                <option value="hybrid">Hybrid (Money or Points)</option>
              </select>
            </div>
            <div className="form-group-admin">
              <label>Points Price</label>
              <input name="pointsPrice" type="number" value={form.pointsPrice} onChange={handleChange} placeholder="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div style={{ background: '#e2e8f0', borderRadius: 12, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 80 }}>🖼️</span>
          </div>
          <h3>Product Gallery</h3>
          <div className="image-upload-area">
            <div className="upload-icon">🖼️</div>
            <p>Drop your image here, or browse</p>
            <p style={{ fontSize: 12 }}>Jpeg, png are allowed</p>
          </div>
          <div className="form-actions" style={{ marginTop: 24 }}>
            <button type="submit" className="btn-save">SAVE</button>
            <button type="button" className="btn-cancel" onClick={() => router.back()}>CANCEL</button>
          </div>
        </div>
      </form>
    </>
  );
}
