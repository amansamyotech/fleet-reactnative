export interface ExpenseData { 
    bookingId: number; 
    amount: number; 
    description: string; 
  }
  
  export interface ExpenseResponse { 
    statusCode: number; 
    success: boolean; 
    data: { 
      id: number; 
      bookingId: number; 
      amount: number; 
      description: string; 
      createdAt: string; 
      updatedAt: string; 
      isDeleted: boolean; 
    }; 
    message: string; 
  }