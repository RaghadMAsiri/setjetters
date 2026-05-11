import React, { createContext, useContext, useState } from 'react';
import bcrypt from 'bcryptjs';//Hashing library for password encryption

// Create the AuthContext to manage authentication state and functions
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide authentication state and functions
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    //lazy initialization to get the user from local storage, with error handling in case of invalid JSON
    try { return JSON.parse(localStorage.getItem('sj_user')) || null; } catch { return null; }
  });

// Register function to create a new user
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('sj_users') || '[]');
    if (users.find(u => u.email === email)) return { error: 'Email already exists' };
    
    //encrypt the password before storing it in local storage
    const salt = bcrypt.genSaltSync(10);//complexity of 10
    const hashedPassword = bcrypt.hashSync(password, salt);//join password with salt and hash it
    
    //create a new user object with a unique id, name, email, and hashed password, then store it in local storage
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    users.push(newUser);//add to the array of users
    localStorage.setItem('sj_users', JSON.stringify(users));//store
    
    //Destructuring to exclude the password from the user object(safeUser)
    const { password: _, ...safeUser } = newUser;
    //save the current session with only the safe user data (without password) in local storage and update the user state
    localStorage.setItem('sj_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  };

  // Login function to authenticate a user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('sj_users') || '[]');
    //find the user with the matching email and compare the hashed password
    const found = users.find(u => u.email === email && bcrypt.compareSync(password, u.password));
    
    if (!found) return { error: 'Invalid email or password' };
    
    //Destructuring to exclude the password from the user object(safeUser)
    const { password: _, ...safeUser } = found;
    localStorage.setItem('sj_user', JSON.stringify(safeUser));//store the current session with only the safe user data 
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('sj_user');
    setUser(null);
  };

  return (
    //Exporting 
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);