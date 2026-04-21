'use client';

import React, { useState } from 'react';
import axiosInstance from '../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Upload } from 'lucide-react';

export default function SellCarPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [partyType, setPartyType] = useState('Dealer');
  const [modified, setModified] = useState('Completely stock');
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    vin: '', year: '', make: '', model: '',
    mileage: '', engineSize: '', paint: '', gccSpecs: '',
    features: '', accidentHistory: '', serviceHistory: '',
    maxBid: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push('/login');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('make', formData.make);
      fd.append('model', formData.model);
      fd.append('year', formData.year);
      fd.append('price', formData.maxBid);
      fd.append('mileage', formData.mileage);
      fd.append('description', formData.features);
      fd.append('bodyType', 'Sedan');
      if (user?._id) {
        fd.append('userId', user._id);
      }
      images.forEach((img) => fd.append('images', img));

      await axiosInstance.post('/cars', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/profile');
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1>Sell Your Car</h1>
        <div className="divider" />
        <p>Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium">Sell Your Car</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text-dark mb-4">Tell us about your car</h2>
          <p className="text-sm text-text-body leading-relaxed">
            Please give us some basics about yourself and car you'd like to sell. We'll also need details about the car's title status as well as 50 photos that highlight the car's exterior and interior condition.
          </p>
          <p className="text-sm text-text-body leading-relaxed mt-3">
            We'll respond to your application within a business day, and we work with you to build a custom and professional listing and get the auction live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Your Info Section */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-base font-bold text-primary mb-1">Your Info</h3>
            <div className="w-8 h-0.5 bg-accent mb-6" />

            <div className="mb-5">
              <p className="text-sm font-medium text-text-dark mb-3">Dealer or Private party?</p>
              <div className="flex space-x-3">
                {['Dealer', 'Private party'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPartyType(type)}
                    className={`px-6 py-2.5 rounded border text-sm font-medium transition-colors ${
                      partyType === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-dark border-border hover:border-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">First name*</label>
                <input name="firstName" onChange={handleChange} type="text" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Last name*</label>
                <input name="lastName" onChange={handleChange} type="text" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Email*</label>
                <input name="email" onChange={handleChange} type="email" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Phone number*</label>
                <div className="relative">
                  <input name="phone" onChange={handleChange} type="tel" placeholder="PK (92)" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Car Details Section */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-base font-bold text-primary mb-1">Car Details</h3>
            <div className="w-8 h-0.5 bg-accent mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">VIN*</label>
                <input name="vin" onChange={handleChange} type="text" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Year*</label>
                <div className="relative">
                  <select name="year" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => 2025 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Make*</label>
                <div className="relative">
                  <select name="make" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select Make</option>
                    {['Audi', 'BMW', 'Mercedes', 'Toyota', 'Honda', 'Ferrari', 'Porsche', 'Lamborghini'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Model*</label>
                <div className="relative">
                  <select name="model" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">All Models</option>
                    <option value="">No Models</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Mileage (in miles)</label>
                <input name="mileage" onChange={handleChange} type="text" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Engine size</label>
                <div className="relative">
                  <select name="engineSize" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="4">4 Cylinder</option>
                    <option value="6">6 Cylinder</option>
                    <option value="8">8 Cylinder</option>
                    <option value="10">10 Cylinder</option>
                    <option value="12">12 Cylinder</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Paint*</label>
                <div className="relative">
                  <select name="paint" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="original">Original paint</option>
                    <option value="partial">Partially Repainted</option>
                    <option value="total">Totally Repainted</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Has GCC Specs</label>
                <div className="relative">
                  <select name="gccSpecs" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Features textarea */}
            <div className="mt-4">
              <label className="text-sm font-medium text-text-dark mb-1.5 block">Noteworthy options/features</label>
              <textarea
                name="features"
                onChange={handleChange}
                rows={4}
                className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Accident History</label>
                <div className="relative">
                  <select name="accidentHistory" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Full Service History</label>
                <div className="relative">
                  <select name="serviceHistory" onChange={handleChange} className="w-full border border-border rounded px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modified */}
            <div className="mt-4">
              <p className="text-sm font-medium text-text-dark mb-3">Has the car been modified?</p>
              <div className="flex space-x-3">
                {['Completely stock', 'Modified'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setModified(type)}
                    className={`px-6 py-2.5 rounded border text-sm font-medium transition-colors ${
                      modified === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-dark border-border hover:border-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Bid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1.5 block">Max Bid*</label>
                <input name="maxBid" onChange={handleChange} type="text" placeholder="$" className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>

            {/* Upload Photos */}
            <div className="mt-4">
              <p className="text-sm font-medium text-text-dark mb-3">Upload Photos</p>
              <label className="inline-flex items-center space-x-2 px-6 py-2.5 border border-border rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={16} className="text-text-light" />
                <span className="text-sm text-text-dark">Add Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                />
              </label>
              {images.length > 0 && (
                <p className="text-xs text-text-light mt-2">{images.length} file(s) selected</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary-dark text-white px-12 py-3 rounded text-sm font-bold transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
