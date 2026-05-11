import React, { createContext, useContext, useState } from 'react';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sj_user')) || null; } catch { return null; }
  });

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('sj_users') || '[]');
    if (users.find(u => u.email === email)) return { error: 'Email already exists' };
    
    //encrypt the password before storing it in local storage
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem('sj_users', JSON.stringify(users));
    
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('sj_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('sj_users') || '[]');
    //find the user with the matching email and compare the hashed password
    const found = users.find(u => u.email === email && bcrypt.compareSync(password, u.password));
    
    if (!found) return { error: 'Invalid email or password' };
    
    const { password: _, ...safeUser } = found;
    localStorage.setItem('sj_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('sj_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);