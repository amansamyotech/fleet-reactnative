

// src/api/config/endpoints.js
export default {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      clearFcm:'/driver/update-fcmtoken'
    },
    location: {
    create: "/location/create",
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
    },
    notification:{
      getNotification:'notifications/driver',
      readNotification:'notifications/mark-read',
      readCountNotification:'notifications/driver/unread-count'
    }
  };