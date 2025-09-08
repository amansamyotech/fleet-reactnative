import { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import apiClient, { getTokenFromStorage } from '../../config/apiConfig';
import endpoints from '../../config/endpoints';
import STORAGE_KEYS from '@/src/constants/authConstants';
import { RideApiResponse } from '@/src/component/RideTimeLine/RideTypes';
import { ApiResponse, Booking, BookingApiResponse, CheckpointData } from '@/src/component/dashboard/RideTypes';
import { ExpenseData, ExpenseResponse } from '@/src/component/dashboard/expenseTypes';



interface ApiError {
  message: string;
  code?: string;
}

// In-memory cache for bookings
let cachedTodayBookings: Booking[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const handleApiError = (error: AxiosError<any>): Error => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred';
  return new Error(message);
};



export const rideTimelineServices = {
  


  getDriverRides: async (driverId: string): Promise<RideApiResponse> => {
    try {
      const token = await getTokenFromStorage();
     console.log(driverId)
      if (!token) {
        throw new Error("Authentication token not found");
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response: AxiosResponse<RideApiResponse> = await apiClient.get(
        `${endpoints.rideTimeLine.getRideData}/${driverId}`
      );

    
      return response.data;
    } catch (error) {
      console.error("Error fetching driver rides:", error);

      throw handleApiError(error as AxiosError);
    }
  },

  getTodayBookings: async (driverId: string): Promise<Booking[]> => {
    try {
      console.log(driverId,"---------")
      const currentTime = Date.now();
      if (

        cachedTodayBookings.length > 0 && 
        currentTime - lastFetchTime < CACHE_DURATION
      ) {
        console.log('Returning cached bookings data');
        return cachedTodayBookings;
      }
      
      const token = await getTokenFromStorage();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response: AxiosResponse<BookingApiResponse> = await apiClient.get(
        `${endpoints.rideTimeLine.getTodaysRide}/${driverId}`
      );
    
      if (response.data.success) {
        // Update cache
        cachedTodayBookings = response.data.data;
        lastFetchTime = currentTime;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      throw handleApiError(error as AxiosError);
    }
  },

  getTodayCheckpoints: async (bookingId: string): Promise<CheckpointData[]> => {
    try {
      
      const token = await getTokenFromStorage();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response: AxiosResponse<ApiResponse<CheckpointData[]>> = await apiClient.get(
        `${endpoints.rideTimeLine.getCheckpoints}/${bookingId}`
      );
      
      if (response.data.success) {
        console.log("res in checkpoints", response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch checkpoints');
      }
    } catch (error) {
      console.error("Error fetching checkpoints:", error);
      throw handleApiError(error as AxiosError);
    }
  },

  

  updateCheckpointLocation: async (checkpointId: number): Promise<ApiResponse<{ data: CheckpointData }>> => {
    try {
      const token = await getTokenFromStorage();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      console.log(`${endpoints.rideTimeLine.updateCheckpoint}/${checkpointId}`)
      const payload = { isActive: true };

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response: AxiosResponse<ApiResponse<{ data: CheckpointData }>> = await apiClient.patch(
        `${endpoints.rideTimeLine.updateCheckpoint}/${checkpointId}`,
        payload
      );
      
      if (response.data.success) {
        console.log("Checkpoint update response:", response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to update checkpoint');
      }
    } catch (error) {
      console.error("Error updating checkpoint:", error);
      throw handleApiError(error as AxiosError);
    }
  },

  updateTripStatus: async (bookingId: string,payload:object): Promise<Booking[]> => {
    try {
      
      const token = await getTokenFromStorage();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       
     
      const response: AxiosResponse<BookingApiResponse> = await apiClient.put(
        `${endpoints.rideTimeLine.updateTripStatus}/${bookingId}`,
        payload
      );
    
      if (response.data.success) {
        rideTimelineServices.clearBookingsCache();
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      throw handleApiError(error as AxiosError);
    }
  },



  saveExpense: async (expenseData: ExpenseData): Promise<ExpenseResponse> => {
    try {
      const token = await getTokenFromStorage();
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response: AxiosResponse<ExpenseResponse> = await apiClient.post(
        endpoints.rideTimeLine.addExpenses,
        expenseData
      );
      
      console.log('Expense added successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error saving expense:", error);
      throw handleApiError(error as AxiosError);
    }
  },
  saveLocation: async (bookingId: string, latitude: number, longitude: number) => {
  try {
    const token = await getTokenFromStorage();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const payload = {
      bookingId: Number(bookingId),
      latitude,
      longitude,
    };

    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post(
      endpoints.location.create, 
      payload
    );

    if (response.data.success) {
      console.log("Location saved successfully:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to save location");
    }
  } catch (error) {
    console.error("Error saving location:", error);
    throw handleApiError(error as AxiosError);
  }
},

  
  // Clear the cache
  clearBookingsCache: () => {
    cachedTodayBookings = [];
    lastFetchTime = 0;
  },
  
  // Get current cached bookings without fetching
  getCachedBookings: (): Booking[] => {
    return cachedTodayBookings;
  },
  
  // Check if we have valid cached data
  hasCachedBookings: (): boolean => {
    const currentTime = Date.now();
    return cachedTodayBookings.length > 0 && 
           currentTime - lastFetchTime < CACHE_DURATION;
  }
};

export default rideTimelineServices;



