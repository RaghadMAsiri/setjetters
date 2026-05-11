import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  // Hook to get the current URL path for active link styling
  const { pathname } = useLocation();
  
  // Hook for programmatic navigation (used when submitting the search form)
  const navigate = useNavigate();
  
  // Accessing user state and logout function from our custom AuthContext
  const { user, logout } = useAuth();
  
  // State to manage the search input value
  const [query, setQuery] = useState('');
  
  // State to track if the user has scrolled down the page (for navbar styling)
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle the scroll event listener
  useEffect(() => {
    // Toggle the 'scrolled' state if the user scrolls past 40px
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    
    // Cleanup function to remove the listener when the component unmounts
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handler for the search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default page reload behavior
    
    if (query.trim()) { 
      // Navigate to the search results page with the encoded query to handle special characters
      navigate(`/search?q=${encodeURIComponent(query.trim())}`); 
      setQuery(''); // Clear the input field after searching
    }
  };

  return (
    // Dynamically apply the 'scrolled' class if the page has been scrolled down
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        
        {/* Brand logo that links back to the home page */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">SetJetters</span>
        </Link>

        {/* Search form with an inline SVG icon and a controlled input */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Search movies, shows..." 
          />
        </form>

        {/* Navigation links container */}
        <div className="navbar-links">
          {/* Links dynamically receive the 'active' class based on the current URL pathname */}
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Discover</Link>
          <Link to="/itinerary" className={pathname === '/itinerary' ? 'active' : ''}>My Trips</Link>
          <Link to="/profile" className={pathname === '/profile' ? 'active' : ''}>Profile</Link>
          
          {/* Conditional rendering based on user authentication status */}
          {user ? (
            // Show the logout button if the user is currently logged in
            <button className="navbar-logout" onClick={logout}>Logout</button>
          ) : (
            // Show the login link if the user is a guest
            <Link to="/login" className={pathname === '/login' ? 'active' : ''}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}