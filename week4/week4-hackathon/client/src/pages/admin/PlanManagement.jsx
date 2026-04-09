import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { adminService, planService } from '../../services/api';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    monthlyPrice: '',
    yearlyPrice: '',
    description: '',
    resolution: '1080p',
    devices: 1,
    adFree: false,
    downloads: false,
    HDStreaming: false,
    features: [],
    isActive: true
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data } = await planService.getPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const openModal = (plan = null) => {
    if (plan) {
      setIsEditing(true);
      setCurrentPlanId(plan._id);
      setFormData({
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        description: plan.description,
        resolution: plan.resolution,
        devices: plan.devices,
        adFree: plan.adFree || false,
        downloads: plan.downloads || false,
        HDStreaming: plan.HDStreaming || false,
        features: plan.features || [],
        isActive: plan.isActive
      });
    } else {
      setIsEditing(false);
      setCurrentPlanId(null);
      setFormData({
        name: '',
        monthlyPrice: '',
        yearlyPrice: '',
        description: '',
        resolution: '1080p',
        devices: 1,
        adFree: false,
        downloads: false,
        HDStreaming: false,
        features: [],
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        monthlyPrice: parseFloat(formData.monthlyPrice),
        yearlyPrice: parseFloat(formData.yearlyPrice),
        devices: parseInt(formData.devices)
      };

      if (isEditing) {
        await adminService.updatePlan(currentPlanId, payload);
        alert('Plan updated successfully');
      } else {
        await adminService.createPlan(payload);
        alert('Plan created successfully');
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await adminService.deletePlan(id);
        fetchPlans();
        alert('Plan deleted successfully');
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan');
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Plan Management</h1>
        <button 
          onClick={() => openModal()}
          className="bg-brandPrimary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
        >
          <Plus size={20} /> Add Plan
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading plans...</div>
      ) : (
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#141414] border-b border-[#262626]">
                <th className="p-4 text-gray-400 font-medium">Name</th>
                <th className="p-4 text-gray-400 font-medium">Monthly Price</th>
                <th className="p-4 text-gray-400 font-medium">Yearly Price</th>
                <th className="p-4 text-gray-400 font-medium">Quality</th>
                <th className="p-4 text-gray-400 font-medium">Devices</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
                <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map(plan => (
                  <tr key={plan._id} className="border-b border-[#1A1A1A] hover:bg-[#141414] transition-colors text-white">
                    <td className="p-4 font-medium">{plan.name}</td>
                    <td className="p-4 text-gray-300">${plan.monthlyPrice.toFixed(2)}</td>
                    <td className="p-4 text-gray-300">${plan.yearlyPrice.toFixed(2)}</td>
                    <td className="p-4 text-gray-300">{plan.resolution}</td>
                    <td className="p-4 text-gray-300">{plan.devices}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${plan.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(plan)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(plan._id)} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 italic">No plans found. Create your first plan!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center sticky top-0 bg-[#0F0F0F] z-10">
              <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Plan' : 'Create New Plan'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Plan Name</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    placeholder="e.g. Premium Plan"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Resolution</label>
                  <select name="resolution" value={formData.resolution} onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors">
                    <option>720p</option>
                    <option>1080p</option>
                    <option>4K</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Monthly Price ($)</label>
                  <input 
                    type="number" step="0.01" name="monthlyPrice" value={formData.monthlyPrice} onChange={handleInputChange} required
                    placeholder="9.99"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Yearly Price ($)</label>
                  <input 
                    type="number" step="0.01" name="yearlyPrice" value={formData.yearlyPrice} onChange={handleInputChange} required
                    placeholder="99.99"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Number of Devices</label>
                  <input 
                    type="number" name="devices" value={formData.devices} onChange={handleInputChange} required min="1"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange} required
                  placeholder="Plan description"
                  rows="3"
                  className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors resize-none"
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Features</label>
                <div className="flex gap-2">
                  <input 
                    type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature and press Add"
                    className="flex-1 bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                  <button 
                    type="button" onClick={handleAddFeature}
                    className="bg-brandPrimary hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, idx) => (
                    <span key={idx} className="bg-brandPrimary/20 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                      {feature}
                      <button type="button" onClick={() => handleRemoveFeature(idx)} className="hover:text-red-500">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Additional Features</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="adFree" checked={formData.adFree} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-white">Ad-Free</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="downloads" checked={formData.downloads} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-white">Downloads Allowed</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="HDStreaming" checked={formData.HDStreaming} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-white">HD Streaming</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-white">Active</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brandPrimary hover:bg-red-700 text-white py-3 rounded font-medium transition-colors"
              >
                {isEditing ? 'Update Plan' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
