export interface Therapy {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  benefits: string[];
  category: string;
}

export interface Practitioner {
  id: number;
  name: string;
  specialization: string;
  experience: string;
}

export interface Booking {
  id: number;
  patientName: string;
  therapyId: number;
  practitionerId: number;
  date: string;
  time: string;
  status: string;
  progress: string;
  day: number;
  totalDays: number;
  therapy?: Therapy;
  practitioner?: Practitioner;
}

export interface Notification {
  id: number;
  bookingId: number;
  type: 'pre-procedure' | 'post-procedure' | 'reminder' | 'alert' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('in-app' | 'email' | 'sms')[];
  patientName: string;
  therapyName: string;
}

export interface Feedback {
  id: number;
  bookingId: number;
  patientName: string;
  rating: number;
  symptoms: string;
  sideEffects: string;
  improvements: string;
  date: string;
}

export interface DashboardStats {
  totalBookings: number;
  completedSessions: number;
  upcomingSessions: number;
  unreadNotifications: number;
  weeklyProgress: Array<{ day: string; sessions: number }>;
  therapyDistribution: Array<{ name: string; value: number }>;
}