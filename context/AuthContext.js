

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(); 

export const useAuth = () => useContext(AuthContext); 

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser)); 
        }
      } catch (error) {
        console.error('Failed to load user from AsyncStorage:', error);
      } finally {
        setLoading(false); 
      }
    };

    loadUser();
  }, []);

   const login = async (userData) => {
  
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user to AsyncStorage:', error);
    }
  };


  const logout = async () => {
    try {
    
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing user from AsyncStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser:login , logout ,loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 


