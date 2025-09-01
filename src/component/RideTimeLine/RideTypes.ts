// src/types/rideTypes.ts

export interface Vehicle {
    id: number;
    vehicleName: string;
  }
  
  export interface Driver {
    id: number;
    name: string;
  }
  
  export interface Customer {
    id: number;
    name: string;
    email: string;
  }
  
  export interface TripExpense {
    id: number;
    amount: number;
    description: string;
    // Add other expense fields as needed
  }
  
  export interface Ride {
    id: number;
    customerId: number;
    vehicleId: number;
    driverId: number;
    tripType: string;
    tripStartDate: string;
    tripEndDate: string;
    tripStartPincode: string;
    tripEndPincode: string;
    tripStartLoc: string;
    tripEndLoc: string;
    totalKm: number;
    totalAmt: number;
    tripStatus: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    invoiceNo: string;
    vehicle: Vehicle;
    driver: Driver;
    customer: Customer;
    tripExpenses: TripExpense[];
  }
  
  export interface RideApiResponse {
    statusCode: number;
    success: boolean;
    data: Ride[];  
    message: string;
  }
  
  export interface ApiError {
    message: string;
    code?: string;
  }