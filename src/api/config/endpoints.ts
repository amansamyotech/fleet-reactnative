

// src/api/config/endpoints.js
export default {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
    },
    rideTimeLine:{
      getTodaysRide:'booking/todayBookings',
      addExpenses:'tripExpense/save',
      getRideData:'booking/allBookings',
      getCheckpoints:'booking/checkpoints',
      updateCheckpoint:'booking/checkpoints',
      updateTripStatus: 'booking/updateStatus'
    },
    profile:{
      driverInfo:'driver/getById',
      updateDriverInfo:'driver/update',
      changePassword:'driver/change-password'
    }
  };