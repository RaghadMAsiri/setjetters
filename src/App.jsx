import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Context Providers
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

//Main Component
export default function App() {
  //start returning component
  return (
    // Wrap the entire app with AuthProvider and AppProvider for global state management
    <AuthProvider>
      <AppProvider>
        // examine the url
        <BrowserRouter>
          <Navbar />
          // Define routes for the application, using ProtectedRoute to guard certain pages
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute><Search /></ProtectedRoute>
            } />
            <Route path="/movie/:id" element={
              <ProtectedRoute><MovieDetail /></ProtectedRoute>
            } />
            <Route path="/tv/:id" element={
              <ProtectedRoute><MovieDetail /></ProtectedRoute>
            } />
            <Route path="/itinerary" element={
              <ProtectedRoute><Itinerary /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}