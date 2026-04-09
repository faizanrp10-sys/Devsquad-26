import React, { useState, useEffect } from 'react';
import PlanCard from '../components/PlanCard';
import { planService } from '../services/api';

const Subscription = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      // Fallback to default plans if API fails
      setPlans([
        { 
          _id: 1, 
          name: "Basic Plan", 
          description: "Enjoy an extensive library of movies and shows...", 
          monthlyPrice: 9.99,
          yearlyPrice: 99.99,
          resolution: "720p",
          devices: 1,
          features: ["HD Quality", "1 Device", "Standard Definition"]
        },
        { 
          _id: 2, 
          name: "Standard Plan", 
          description: "Access to a wider selection of movies and shows...", 
          monthlyPrice: 12.99,
          yearlyPrice: 129.99,
          resolution: "1080p",
          devices: 2,
          features: ["Full HD Quality", "2 Devices", "No Ads"]
        },
        { 
          _id: 3, 
          name: "Premium Plan", 
          description: "Access to the widest selection of movies and shows...", 
          monthlyPrice: 14.99,
          yearlyPrice: 149.99,
          resolution: "4K",
          devices: 4,
          features: ["4K Quality", "4 Devices", "No Ads", "Downloads"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    const selectedWithPeriod = {
      ...plan,
      billingPeriod,
      price: billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
    };
    setSelectedPlan(selectedWithPeriod);
    setShowPayment(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const period = selectedPlan.billingPeriod === 'monthly' ? 'monthly' : 'yearly';
    alert(`Mock Payment Successful! Activated ${selectedPlan.name} (${period})`);
    // Ideally this redirects to home or profile
  };

  if (loading) {
    return <div className="pt-[120px] pb-[80px] min-h-screen bg-brandDark flex items-center justify-center"><div className="text-white text-xl">Loading plans...</div></div>;
  }

  return (
    <div className="pt-[120px] pb-[80px] min-h-screen bg-brandDark px-8 md:px-16 max-w-7xl mx-auto">
      {!showPayment ? (
        <>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Choose the plan that's right for you</h1>
            <p className="text-gray-400">Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!</p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#1A1A1A] rounded-lg p-1 flex gap-1 inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-8 py-3 rounded transition-colors font-medium ${
                  billingPeriod === 'monthly'
                    ? 'bg-brandPrimary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-8 py-3 rounded transition-colors font-medium relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-brandPrimary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="absolute -top-3 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const displayPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const savingsPercent = billingPeriod === 'yearly' ? Math.round((1 - displayPrice / (plan.monthlyPrice * 12)) * 100) : 0;
              
              return (
                <div key={plan._id} className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-8 flex flex-col hover:border-brandPrimary transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{plan.description}</p>
                  
                  {/* Resolution */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Resolution: <span className="text-white font-semibold">{plan.resolution}</span></p>
                  </div>

                  {/* Features List */}
                  <div className="mb-6 space-y-2">
                    {plan.features && plan.features.map((feature, idx) => (
                      <p key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                        <span className="text-brandPrimary">✓</span> {feature}
                      </p>
                    ))}
                    {plan.devices && (
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        <span className="text-brandPrimary">✓</span> {plan.devices} Device{plan.devices > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-white mb-6">
                    <span className="text-4xl font-bold">${displayPrice.toFixed(2)}</span>
                    <span className="text-gray-400 text-sm">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                    {savingsPercent > 0 && (
                      <p className="text-green-500 text-sm mt-2">Save {savingsPercent}% vs monthly!</p>
                    )}
                  </div>

                  <button 
                    onClick={() => handlePlanSelect(plan)} 
                    className="w-full bg-brandPrimary hover:bg-red-700 text-white py-3 rounded transition-colors font-medium"
                  >
                    Activate Plan
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>
          <div className="bg-[#141414] border border-brandPrimary/30 rounded p-4 mb-6">
             <p className="text-sm text-brandPrimary mb-1">Selected Plan</p>
             <p className="text-xl text-white font-bold">{selectedPlan.name} - ${selectedPlan.price}/mo</p>
          </div>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" required maxLength={16} className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
                <input type="text" placeholder="MM/YY" required className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">CVV</label>
                <input type="password" placeholder="123" required maxLength={3} className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary" />
              </div>
            </div>
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setShowPayment(false)} className="flex-1 bg-[#1A1A1A] text-white py-3 rounded hover:bg-[#222]">Back</button>
               <button type="submit" className="flex-1 bg-brandPrimary text-white py-3 rounded hover:bg-red-700 font-medium">Pay Now</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Subscription;
