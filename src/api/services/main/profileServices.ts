import { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import apiClient, { getTokenFromStorage } from '../../config/apiConfig';
import endpoints from '../../config/endpoints';
import STORAGE_KEYS from '@/src/constants/authConstants';

export interface DriverApiResponse {
    statusCode: number;
    success: boolean;
    data: any;
    message: string;
}

interface PasswordChangeData {
    oldPassword: string;
    newPassword: string;
}


interface ApiError {
    message: string;
    code?: string;
}

const handleApiError = (error: AxiosError<any>): Error => {
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    return new Error(message);
};

const DRIVER_DATA = STORAGE_KEYS.DRIVERDATA;

export const profileService = {

    saveDriverData: async (data: any): Promise<void> => {
        try {
            await SecureStore.setItemAsync(DRIVER_DATA, JSON.stringify(data));
            console.log("Driver data saved successfully in service");
        } catch (error) {
            console.error("Error in saveDriverData:", error);
        }
    },

    getDriverData: async (): Promise<any | null> => {
        try {
            const jsonValue = await SecureStore.getItemAsync(DRIVER_DATA);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error("Error in getDriverData:", error);
            return null;
        }
    },

    getDriverById: async (driverId: string): Promise<DriverApiResponse> => {
        const token = await getTokenFromStorage();
        console.log("token",token)
        console.log("driverId---",`${endpoints.profile.driverInfo}/${driverId}`)

        try {
            if (!token) {
                throw new Error("Authentication token not found");
            }

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response: AxiosResponse<DriverApiResponse> = await apiClient.get(
                `${endpoints.profile.driverInfo}/${driverId}`
            );
   console.log(response)
            if (response.data.success) {

                await profileService.saveDriverData(response.data.data);
            }

            return response.data;
        } catch (error) {
            console.error("Error fetching driver data:", error);

            const cachedData = await profileService.getDriverData();

            if (cachedData) {

                return {
                    statusCode: 200,
                    success: true,
                    data: cachedData,
                    message: "Using cached data. Unable to connect to server."
                };
            }

            throw handleApiError(error as AxiosError);
        }
    },

    updateDriverProfile: async (driverId: number, updateData: any): Promise<DriverApiResponse> => {
        try {
            const token = await getTokenFromStorage();

            if (!token) {
                throw new Error("Authentication token not found");
            }

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response: AxiosResponse<DriverApiResponse> = await apiClient.patch(
                `${endpoints.profile.updateDriverInfo}/${driverId}`,
                updateData
            );

            // Update cached data if request was successful
            if (response.data.success) {
                console.log(response.data.data)

                await profileService.saveDriverData(response.data.data);

            }

            return response.data;
        } catch (error) {
            throw handleApiError(error as AxiosError);
        }
    },
  
    changePassword: async (driverId: string, passwordData: PasswordChangeData): Promise<DriverApiResponse> => {
        try {
            // 1. Check token validity and format
            const token = await getTokenFromStorage();
            console.log("Token exists:", !!token);
            console.log(passwordData,"pass")
            // If no token exists, try to refresh or redirect to login
            if (!token) {
                console.error("No authentication token found");
                // Consider redirecting to login here
                throw new Error("Authentication token not found");
            }
            
            // 2. Set authorization header properly
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 3. Add debugging for request details
            console.log("Request URL:", `${endpoints.profile.changePassword}/${driverId}`);
            console.log("Password data structure:", Object.keys(passwordData));
            
            // 4. Make the API call with proper error handling
            const response: AxiosResponse<DriverApiResponse> = await apiClient.patch(
                `${endpoints.profile.changePassword}/${driverId}`,
                passwordData
            );
            
            console.log("Password change response:", response.status);
            return response.data;
        } catch (error) {
            // 5. Enhanced error handling with more details
            const axiosError = error as AxiosError;
            console.error("Error changing password:", {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data
            });
            
            // Handle specific error cases
            if (axiosError.response?.status === 401) {
                console.error("Authentication failed. Token may be invalid or expired.");
                // Consider refreshing token or redirecting to login
            }
            
            throw handleApiError(axiosError);
        }
    }
};

export default profileService;