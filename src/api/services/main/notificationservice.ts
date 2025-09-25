// src/api/services/notificationService.ts
import apiClient from "../../config/apiConfig";
import endpoints from "../../config/endpoints";

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  sentAt: string;
}

const notificationService = {
  getNotifications: async (page = 1, limit = 20, driverId:any) => {
    const res = await apiClient.get(`${endpoints.notification.getNotification}/${driverId}?page=${page}&limit=${limit}`);
    return res.data;
  },
  getUnreadCount: async (driverId:any) => {
    const res = await apiClient.get(`${endpoints.notification.readCountNotification}/${driverId}`);
    return res.data;
  },
  markAsRead: async (ids: string[]) => {
    const res = await apiClient.patch(endpoints.notification.readNotification, { ids });
    return res.data;
  }
};

export default notificationService;
