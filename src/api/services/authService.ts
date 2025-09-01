import { AxiosError, AxiosResponse } from 'axios';
import apiClient, { clearTokens, saveTokens } from '../config/apiConfig';
import endpoints from '../config/endpoints';

// Define your types to match the actual API response structure
interface Driver {
  id: number;
  name: string;
  mobileNo: string;
  address: string;
  licenseNo: string;
  dateOfJoining: string;
  status: string;
}

interface LoginResponseData {
  access_token: string;
  driver: Driver;
}

interface LoginResponse {
  statusCode: number;
  success: boolean;
  data: LoginResponseData;
  message: string;
}

interface ApiError {
  message: string;
  code?: string;
}

const handleApiError = (error: AxiosError<any>): Error => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred';
  return new Error(message);
};

export const authService = {
  login: async (phone: string, password: string): Promise<LoginResponse> => {
    try {
      console.log(endpoints.auth.login)
      const response: AxiosResponse<LoginResponse> = await apiClient.post(
        endpoints.auth.login, 
        { mobileNo:phone, password:password }
      );
      console.log("response",response)
      // Save tokens when login is successful
      if (response.data.success && response.data.data.access_token) {
        // Since there's no refresh_token in the response, we'll use the access_token for both
        await saveTokens(response.data.data.access_token);
      }
      console.log("response.data",response.data)
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(endpoints.auth.logout);
      // Clear tokens on logout
      await clearTokens();
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
  
  // Add other auth-related functions as needed
};

export default authService;