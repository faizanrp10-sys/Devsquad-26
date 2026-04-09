import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import PlanCard from '../components/PlanCard';
import CategoryCard from '../components/CategoryCard';
import DeviceCard from '../components/DeviceCard';
import FAQItem from '../components/FAQItem';
import MovieSlider from '../components/MovieSlider';
import { contentApi } from '../services/contentApi';
import { Smartphone, Monitor, Tv, Gamepad2 } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '').replace(/\/$/, '');

const Home = () => {
  const [content, setContent] = useState({
    plans: [],
    categories: [],
    devices: [],
    faqs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await contentApi.getHomeContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch home content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Normalize path
    let normalizedPath = path.startsWith('./') ? path.substring(1) : path;
    if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;

    // If it's a backend upload, prefix with API_BASE_URL
    if (normalizedPath.startsWith('/uploads')) {
      const prefix = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      return `${prefix}${normalizedPath}`;
    }
    
    // Otherwise, treat as a local asset served by Vite
    return normalizedPath;
  };

  if (loading) {
    return <div className="min-h-screen bg-brandDark flex items-center justify-center text-white">Loading...</div>;
  }

  const { 
    plans: apiPlans, 
    categories: apiCategories, 
    devices: apiDevices, 
    faqs: apiFaqs 
  } = content;

  const getDeviceIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Monitor': return Monitor;
      case 'Tv': return Tv;
      case 'Gamepad2': return Gamepad2;
      default: return Monitor;
    }
  };

  const plans = apiPlans.length > 0 ? apiPlans : [
    {
      name: "Basic Plan",
      description: "Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.",
      price: "9.99"
    },
    {
      name: "Standard Plan",
      description: "Access to a wider selection of movies and shows, including most new releases and exclusive content",
      price: "12.99"
    },
    {
      name: "Premium Plan",
      description: "Access to a widest selection of movies and shows, including all new releases and Offline Viewing",
      price: "14.99"
    }
  ];

  const categoriesList = apiCategories?.length > 0 ? apiCategories : [
    { title: "Action", images: ["/action1.png", "/action2.png", "/action3.png", "/action4.png"] },
    { title: "Adventure", images: ["/adventure1.png", "/adventure2.png", "/adventure3.png", "/adventure4.png"] },
    { title: "Comedy", images: ["/comedy1.png", "/comedy2.png", "/comedy3.png", "/comedy4.png"] },
    { title: "Drama", images: ["/Drama1.png", "/Drama2.png", "/Drama3.png", "/Drama4.png"] },
    { title: "Horror", images: ["/Horror1.png", "/Horror2.png", "/Horror3.png", "/Horror4.png"] },
    { title: "Sci-Fi", images: ["https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80", "https://images.unsplash.com/photo-1588691866405-b77da1795c47?w=400&q=80"] },
    { title: "Documentary", images: ["https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&q=80", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80", "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80"] }
  ];

  const devicesList = apiDevices.length > 0 ? apiDevices : [
    { icon: Smartphone, title: "Smartphones", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    { icon: Monitor, title: "Tablet", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    { icon: Tv, title: "Smart TV", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    { icon: Monitor, title: "Laptops", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    { icon: Gamepad2, title: "Gaming Consoles", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    { icon: Gamepad2, title: "VR Headsets", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
  ];

  const faqsList = apiFaqs.length > 0 ? apiFaqs : [
    { number: "01", question: "What is StreamVibe?", answer: "StreamVibe is a streaming service that allows you to watch movies and shows on demand." },
    { number: "02", question: "How much does StreamVibe cost?", answer: "StreamVibe offers multiple subscription plans starting from $9.99/month. You can select the plan that best fits your viewing needs." },
    { number: "03", question: "What content is available on StreamVibe?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." },
    { number: "04", question: "What do i sign up for StreamVibe?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." },
    { number: "05", question: "What is StreamVibe free trail?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." },
    { number: "06", question: "How do I contact StreamVibe customer support?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." },
    { number: "07", question: "How can I watch StreamVibe?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." },
    { number: "08", question: "What are the StreanVibe payment methods?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." }
  ];

  return (
    <div className="min-h-screen bg-brandDark ">
      <HeroBanner />
      
      {/* Categories Section */}
      <section className="px-8 md:px-16 pt-[150px] max-w-[1600px] mx-auto overflow-x-hidden">
        <MovieSlider title="Explore our wide variety of categories">
          {categoriesList.map((cat, i) => <CategoryCard key={i} title={cat.title} images={cat.images.map(getImageUrl)} />)}
        </MovieSlider>
      </section>

      {/* Devices Section */}
      <section className="px-8 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">We Provide you streaming experience across various devices.</h2>
          <p className="text-gray-400">With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devicesList.map((dev, i) => <DeviceCard key={i} {...dev} icon={getDeviceIcon(dev.icon)} />)}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400">Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.</p>
          </div>
          <button className="bg-brandPrimary text-white px-6 py-2 rounded font-medium hover:bg-red-700">Ask a Question</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
          {faqsList.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="px-8 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Choose the plan that's right for you</h2>
            <p className="text-gray-400">Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!</p>
          </div>
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-1 rounded flex">
            <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded">Monthly</button>
            <button className="text-gray-400 hover:text-white px-4 py-2 rounded">Yearly</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="px-8 md:px-16 pb-16 max-w-7xl mx-auto">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 flex justify-between items-center bg-cover bg-center mix-blend-screen"
             style={{ backgroundImage: `linear-gradient(to right, #141414 0%, rgba(20,20,20,0.8) 50%, rgba(229, 9, 20, 0.2) 100%), url("${getImageUrl('/free-trail-bgimg.png')}")` }}>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Start your free trial today!</h2>
            <p className="text-gray-400">This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.</p>
          </div>
          <button className="bg-brandPrimary text-white font-medium py-3 px-8 rounded hover:bg-red-700 transition">
            Start a Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
