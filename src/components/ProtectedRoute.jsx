import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component to guard routes that require authentication
export default function ProtectedRoute({ children }) {
  // Get the current user from the AuthContext (Fetching State)
  const { user } = useAuth();
  // If there is no user in the context, redirect to the login page
  if (!user) return <Navigate to="/login" />;
  // If there is a user, render the child components (the protected page)
  return children;
}