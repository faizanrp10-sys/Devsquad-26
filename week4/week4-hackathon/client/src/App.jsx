import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviesAndShows from './pages/MoviesAndShows';
import MovieDetails from './pages/MovieDetails';
import Subscription from './pages/Subscription';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brandDark font-sans text-white flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movies-shows" element={<MoviesAndShows />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
