// src/component/RideTimeLine/RideTypes.ts
export interface Vehicle {
    id: number;
    vehicleName: string;
    registrationNo:string
  }
  
  export interface Customer {
    id: number;
    name: string;
    email: string;
    mobileNo: string
  }
  
  export interface Booking {
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
    customer: Customer;
  }
  
  export interface BookingApiResponse {
    statusCode: number;
    success: boolean;
    data: Booking[];
    message: string;
  }
  
  export interface CheckpointData {
    id: number;
    bookingId: number;
    cityName: string;
    locationUrl: string | null;
    isActive: boolean;
    isDeleted: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    data: T;
    message: string;
  }
  
  export interface UpdateLocationResponse {
    success: boolean;
    message?: string;
    error?: string;
  }