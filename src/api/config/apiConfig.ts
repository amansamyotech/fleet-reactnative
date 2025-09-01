import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store'; // Assuming you'll use SecureStore

// Constants
const TOKEN_KEY = 'auth_token';


const getBaseUrl = () => {
  const baseURL = Constants.expoConfig?.extra?.API_URL;
  console.log("baseURL",baseURL)

  if (!baseURL) {
    console.warn('API_URL is not defined in app.config.ts or .env');
    return 'http://localhost:3000'; // fallback
  }

  return baseURL;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Save tokens to secure storage
export const saveTokens = async (accessToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);

  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Get token from secure storage
export const getTokenFromStorage = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};



// Clear tokens from storage (for logout)
export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Add token to request if available
apiClient.interceptors.request.use(
  async (config) => {
    // Skip authentication for login endpoint
    if (config.url && (
        config.url.includes('/login') || 
        config.url.includes('/register') ||
        config.url.includes('/refresh-token')
    )) {
      return config;
    }
    
    // For all other requests, add the token
    const token = await getTokenFromStorage();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors by attempting to refresh the token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {

        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;