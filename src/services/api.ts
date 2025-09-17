const API_BASE = 'http://127.0.0.1:3001/api';

export const api = {
  // Therapies
  getTherapies: async () => {
    const response = await fetch(`${API_BASE}/therapies`);
    return response.json();
  },

  // Practitioners
  getPractitioners: async () => {
    const response = await fetch(`${API_BASE}/practitioners`);
    return response.json();
  },

  // Bookings
  getBookings: async () => {
    const response = await fetch(`${API_BASE}/bookings`);
    return response.json();
  },

  createBooking: async (booking: any) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return response.json();
  },

  updateBookingProgress: async (bookingId: number, progress: string, day: number) => {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress, day })
    });
    return response.json();
  },

  // Notifications
  getNotifications: async () => {
    const response = await fetch(`${API_BASE}/notifications`);
    return response.json();
  },

  markNotificationAsRead: async (notificationId: number) => {
    const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    return response.json();
  },

  // Feedback
  getFeedback: async () => {
    const response = await fetch(`${API_BASE}/feedback`);
    return response.json();
  },

  createFeedback: async (feedback: any) => {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    return response.json();
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE}/dashboard-stats`);
    return response.json();
  }
};