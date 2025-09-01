import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import STORAGE_KEYS from '../constants/authConstants';

export interface LoginData {
  id: string;
  name:string;
  phone: string;
  token: string;
}


const useLoginDataStorage = () => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("loginData",loginData)

  const STORAGE_KEY = STORAGE_KEYS.STORAGE_KEY

  useEffect(() => {
    const loadLoginData = async () => {
      try {
        const data = await SecureStore.getItemAsync(STORAGE_KEY);
        if (data) {
          setLoginData(JSON.parse(data));
        }
      } catch (e) {
        console.error('Failed to load login data', e);
      } finally {
        setLoading(false);
      }
    };

    loadLoginData();
  }, []);

  const storeLoginData = async (data: LoginData): Promise<void> => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
      setLoginData(data);
      console.log("Data stored successfully");
    } catch (error) {
      console.error('Error storing login data:', error);
    }
  };

  const getLoginData = async (): Promise<void> => {
    try {
      const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
      setLoginData(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (error) {
      console.error('Error getting login data:', error);
    }
  };

  const clearLoginData = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      setLoginData(null);
    } catch (error) {
      console.error('Error clearing login data:', error);
    }
  };

  const updateLoginData = async (data: LoginData): Promise<void> => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
      setLoginData(data);
    } catch (error) {
      console.error('Error updating login data:', error);
    }
  };

  // ✅ New logout function
  const logout = async (): Promise<void> => {
    await clearLoginData();
    console.log("Logged out successfully");
  };

  return {
    loginData,
    loading,
    storeLoginData,
    updateLoginData,
    clearLoginData,
    getLoginData,
    logout, // <-- exposed logout
  };
};

export default useLoginDataStorage;
