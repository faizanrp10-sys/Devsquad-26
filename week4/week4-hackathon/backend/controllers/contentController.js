export const getHomeContent = async (req, res) => {
  try {
    const plans = [
      { name: "Basic Plan", description: "Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.", price: "9.99" },
      { name: "Standard Plan", description: "Access to a wider selection of movies and shows, including most new releases and exclusive content", price: "12.99" },
      { name: "Premium Plan", description: "Access to a widest selection of movies and shows, including all new releases and Offline Viewing", price: "14.99" }
    ];

    const categories = [
      { title: "Action", images: ["/action1.png", "/action2.png", "/action3.png", "/action4.png"] },
      { title: "Adventure", images: ["/adventure1.png", "/adventure2.png", "/adventure3.png", "/adventure4.png"] },
      { title: "Comedy", images: ["/comedy1.png", "/comedy2.png", "/comedy3.png", "/comedy4.png"] },
      { title: "Drama", images: ["/Drama1.png", "/Drama2.png", "/Drama3.png", "/Drama4.png"] },
      { title: "Horror", images: ["/Horror1.png", "/Horror2.png", "/Horror3.png", "/Horror4.png"] },
      { title: "Sci-Fi", images: ["https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80", "https://images.unsplash.com/photo-1588691866405-b77da1795c47?w=400&q=80"] },
      { title: "Documentary", images: ["https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&q=80", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80", "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80"] }
    ];

    const devices = [
      { icon: "Smartphone", title: "Smartphones", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
      { icon: "Monitor", title: "Tablet", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
      { icon: "Tv", title: "Smart TV", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
      { icon: "Monitor", title: "Laptops", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
      { icon: "Gamepad2", title: "Gaming Consoles", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
      { icon: "Gamepad2", title: "VR Headsets", description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store" },
    ];

    const faqs = [
      { number: "01", question: "What is StreamVibe?", answer: "StreamVibe is a streaming service that allows you to watch movies and shows on demand." },
      { number: "02", question: "How much does StreamVibe cost?", answer: "StreamVibe offers multiple subscription plans starting from $9.99/month." },
      { number: "03", question: "What content is available?", answer: "StreamVibe has a massive library of classic movies, hit TV shows, documentaries, and exclusive originals across various genres." }
    ];

    res.json({ plans, categories, devices, faqs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMoviesShowsContent = async (req, res) => {
  try {
    const featuredItems = [
      {
        title: "Avengers : Endgame",
        description: "With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe...",
        backdrop: "/avengers.png"
      },
      {
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&q=80"
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80"
      }
    ];

    const categories = [
      { title: "Action", images: ["/action1.png", "/action2.png", "/action3.png", "/action4.png"] },
      { title: "Adventure", images: ["/adventure1.png", "/adventure2.png", "/adventure3.png", "/adventure4.png"] },
      { title: "Comedy", images: ["/comedy1.png", "/comedy2.png", "/comedy3.png", "/comedy4.png"] },
      { title: "Drama", images: ["/Drama1.png", "/Drama2.png", "/Drama3.png", "/Drama4.png"] },
      { title: "Horror", images: ["/Horror1.png", "/Horror2.png", "/Horror3.png", "/Horror4.png"] },
      { title: "Sci-Fi", images: ["https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80", "https://images.unsplash.com/photo-1588691866405-b77da1795c47?w=400&q=80"] },
      { title: "Romance", images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80", "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80"] }
    ];

    const movies = [
      { title: "Kantara", duration: "1h 57min", views: "20K", poster: "/trendingnowmovie1.png" },
      { title: "Pushpa", duration: "1h 30min", views: "20K", poster: "/trendingnowmovie2.png" },
      { title: "Blade Runner 2049", duration: "1h 42min", views: "20K", poster: "/trendingnowmovie3.png" },
      { title: "Adipurush", duration: "2h 10min", views: "20K", poster: "/trendingnowmovie4.png" },
      { title: "Pathan", duration: "2h 20min", views: "15K", poster: "/trendingnowmovie5.png" },
      { title: "Top Gun", duration: "2h 11min", views: "50K", poster: "/trendingnowmovie1.png" },
      { title: "Inception", duration: "2h 28min", views: "80K", poster: "/trendingnowmovie2.png" }
    ];

    const top10 = [
      { title: "Top Action 1", type: "top10", poster: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80" },
      { title: "Top Adventure 2", type: "top10", poster: "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?w=400&q=80" },
      { title: "Top Comedy 3", type: "top10", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80" },
      { title: "Top Drama 4", type: "top10", poster: "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80" },
      { title: "Top Horror 5", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" },
      { title: "Top Horror 6", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" },
      { title: "Top Horror 7", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" }
    ];

    const popularShowsList = [
      { id: "stranger-things", title: "Stranger Things", duration: "8h 20min", views: "32K", poster: "/trendingshows1.png" },
      { id: "money-heist", title: "Money Heist", duration: "12h 23min", views: "28K", poster: "/trendingshows2.png" },
      { id: "lucifer", title: "Lucifer", duration: "14h 30min", views: "25K", poster: "/trendingshows3.png" },
      { id: "the-gray-man", title: "The Gray Man", duration: "7h 40min", views: "18K", poster: "/trendingshows4.png" },
      { id: "the-gray-man-2", title: "The Gray Man 2", duration: "7h 40min", views: "18K", poster: "/trendingshows4.png" },
      { id: "the-gray-man-3", title: "The Gray Man 3", duration: "7h 40min", views: "18K", poster: "/trendingshows1.png" },
      { id: "the-gray-man-4", title: "The Gray Man 4", duration: "7h 40min", views: "18K", poster: "/trendingshows2.png" },
    ];

    res.json({ featuredItems, categories, movies, top10, popularShowsList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
