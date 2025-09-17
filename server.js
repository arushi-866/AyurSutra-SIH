import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Mock Data
const therapies = [
  {
    id: 1,
    name: 'Abhyanga',
    description: 'Full body oil massage with warm herbal oils to improve circulation and reduce stress',
    duration: '60 minutes',
    price: 120,
    benefits: ['Improves circulation', 'Reduces stress', 'Nourishes skin', 'Detoxifies body', 'Improves sleep'],
    category: 'Massage Therapy',
    difficulty: 'Easy',
    contraindications: ['Open wounds', 'Fever', 'Pregnancy (first trimester)'],
    preparation: 'Avoid heavy meals 2 hours before',
    aftercare: 'Rest for 30 minutes, avoid cold water'
  },
  {
    id: 2,
    name: 'Shirodhara',
    description: 'Continuous stream of warm oil over the forehead to calm the mind and nervous system',
    duration: '45 minutes',
    price: 150,
    benefits: ['Calms mind', 'Improves sleep', 'Reduces anxiety', 'Enhances concentration', 'Balances doshas'],
    category: 'Head Therapy',
    difficulty: 'Easy',
    contraindications: ['Head injuries', 'Severe migraines', 'High blood pressure'],
    preparation: 'Empty stomach preferred',
    aftercare: 'Avoid cold water on head for 24 hours'
  },
  {
    id: 3,
    name: 'Panchakarma Detox',
    description: '5-day comprehensive detoxification program for complete body purification',
    duration: '5 days',
    price: 800,
    benefits: ['Complete detox', 'Balances doshas', 'Rejuvenates body', 'Boosts immunity', 'Mental clarity'],
    category: 'Detox Program',
    difficulty: 'Moderate',
    contraindications: ['Chronic diseases', 'Pregnancy', 'Elderly patients'],
    preparation: 'Special diet 3 days before',
    aftercare: 'Gradual return to normal diet'
  },
  {
    id: 4,
    name: 'Udvartana',
    description: 'Herbal powder massage for weight management and skin improvement',
    duration: '45 minutes',
    price: 100,
    benefits: ['Weight loss', 'Improves skin texture', 'Reduces cellulite', 'Tones muscles', 'Improves circulation'],
    category: 'Massage Therapy',
    difficulty: 'Easy',
    contraindications: ['Skin allergies', 'Open wounds', 'Sensitive skin'],
    preparation: 'Clean skin, avoid lotions',
    aftercare: 'Warm shower after 2 hours'
  },
  {
    id: 5,
    name: 'Basti',
    description: 'Medicated enema therapy for colon cleansing and dosha balancing',
    duration: '30 minutes',
    price: 200,
    benefits: ['Colon cleansing', 'Balances Vata dosha', 'Improves digestion', 'Detoxifies colon'],
    category: 'Detox Program',
    difficulty: 'Moderate',
    contraindications: ['Severe constipation', 'Colon diseases', 'Pregnancy'],
    preparation: 'Empty stomach, special diet',
    aftercare: 'Rest, light diet for 24 hours'
  },
  {
    id: 6,
    name: 'Nasya',
    description: 'Nasal administration of medicated oils for head and neck disorders',
    duration: '20 minutes',
    price: 80,
    benefits: ['Clears sinuses', 'Improves voice', 'Enhances memory', 'Relieves headaches'],
    category: 'Head Therapy',
    difficulty: 'Easy',
    contraindications: ['Nasal bleeding', 'Severe cold', 'Sinusitis'],
    preparation: 'Clean nasal passages',
    aftercare: 'Avoid cold exposure'
  }
];

const practitioners = [
  { 
    id: 1, 
    name: 'Dr. Priya Sharma', 
    specialization: 'Panchakarma Expert', 
    experience: '15 years',
    qualifications: ['BAMS', 'MD Ayurveda', 'Panchakarma Specialist'],
    rating: 4.9,
    patientsTreated: 1200,
    availability: 'Mon-Fri 9AM-6PM',
    languages: ['Hindi', 'English', 'Sanskrit'],
    bio: 'Expert in traditional Panchakarma therapies with 15 years of experience'
  },
  { 
    id: 2, 
    name: 'Dr. Raj Kumar', 
    specialization: 'Ayurvedic Physician', 
    experience: '10 years',
    qualifications: ['BAMS', 'MD Ayurveda', 'Herbal Medicine'],
    rating: 4.7,
    patientsTreated: 800,
    availability: 'Mon-Sat 8AM-7PM',
    languages: ['Hindi', 'English', 'Tamil'],
    bio: 'Specialized in herbal medicine and constitutional analysis'
  },
  { 
    id: 3, 
    name: 'Dr. Meera Patel', 
    specialization: 'Massage Therapist', 
    experience: '8 years',
    qualifications: ['Diploma in Ayurvedic Massage', 'Certified Therapist'],
    rating: 4.8,
    patientsTreated: 600,
    availability: 'Tue-Sun 10AM-8PM',
    languages: ['Hindi', 'English', 'Gujarati'],
    bio: 'Expert in therapeutic massage and bodywork techniques'
  },
  {
    id: 4,
    name: 'Dr. Anil Gupta',
    specialization: 'Detox Specialist',
    experience: '12 years',
    qualifications: ['BAMS', 'Detox Therapy Certification'],
    rating: 4.6,
    patientsTreated: 900,
    availability: 'Mon-Fri 7AM-5PM',
    languages: ['Hindi', 'English', 'Punjabi'],
    bio: 'Specialized in detoxification and cleansing therapies'
  }
];

let bookings = [
  {
    id: 1,
    patientName: 'John Doe',
    therapyId: 1,
    practitionerId: 1,
    date: '2025-01-15',
    time: '10:00',
    status: 'confirmed',
    progress: 'completed',
    day: 3,
    totalDays: 5,
    patientAge: 45,
    patientPhone: '+91-9876543210',
    patientEmail: 'john.doe@email.com',
    notes: 'Patient responded well to treatment',
    cost: 600,
    paymentStatus: 'paid'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    therapyId: 2,
    practitionerId: 2,
    date: '2025-01-16',
    time: '14:00',
    status: 'confirmed',
    progress: 'in-progress',
    day: 1,
    totalDays: 1,
    patientAge: 32,
    patientPhone: '+91-9876543211',
    patientEmail: 'jane.smith@email.com',
    notes: 'First session, patient comfortable',
    cost: 150,
    paymentStatus: 'pending'
  },
  {
    id: 3,
    patientName: 'Robert Johnson',
    therapyId: 3,
    practitionerId: 1,
    date: '2025-01-17',
    time: '09:00',
    status: 'confirmed',
    progress: 'scheduled',
    day: 0,
    totalDays: 5,
    patientAge: 55,
    patientPhone: '+91-9876543212',
    patientEmail: 'robert.johnson@email.com',
    notes: 'Comprehensive detox program',
    cost: 800,
    paymentStatus: 'paid'
  },
  {
    id: 4,
    patientName: 'Sarah Wilson',
    therapyId: 4,
    practitionerId: 3,
    date: '2025-01-18',
    time: '11:00',
    status: 'confirmed',
    progress: 'in-progress',
    day: 2,
    totalDays: 3,
    patientAge: 28,
    patientPhone: '+91-9876543213',
    patientEmail: 'sarah.wilson@email.com',
    notes: 'Weight management therapy',
    cost: 300,
    paymentStatus: 'paid'
  }
];

let notifications = [
  {
    id: 1,
    bookingId: 1,
    type: 'pre-procedure',
    title: 'Abhyanga Session Tomorrow',
    message: 'Please avoid heavy meals 2 hours before your session. Wear comfortable clothing.',
    read: false,
    timestamp: new Date().toISOString(),
    priority: 'high',
    channels: ['in-app', 'email'],
    patientName: 'John Doe',
    therapyName: 'Abhyanga'
  },
  {
    id: 2,
    bookingId: 2,
    type: 'post-procedure',
    title: 'Post-Shirodhara Care',
    message: 'Avoid cold water on head for 24 hours. Rest for at least 30 minutes.',
    read: false,
    timestamp: new Date().toISOString(),
    priority: 'medium',
    channels: ['in-app', 'email'],
    patientName: 'Jane Smith',
    therapyName: 'Shirodhara'
  },
  {
    id: 3,
    bookingId: 1,
    type: 'reminder',
    title: 'Session Reminder - 1 Hour',
    message: 'Your Abhyanga session starts in 1 hour. Please arrive 15 minutes early.',
    read: false,
    timestamp: new Date().toISOString(),
    priority: 'urgent',
    channels: ['in-app', 'email', 'sms'],
    patientName: 'John Doe',
    therapyName: 'Abhyanga'
  },
  {
    id: 4,
    bookingId: 2,
    type: 'milestone',
    title: 'Therapy Progress Milestone',
    message: 'Congratulations! You have completed 50% of your Shirodhara treatment.',
    read: true,
    timestamp: new Date().toISOString(),
    priority: 'low',
    channels: ['in-app'],
    patientName: 'Jane Smith',
    therapyName: 'Shirodhara'
  },
  {
    id: 5,
    bookingId: 1,
    type: 'alert',
    title: 'Important: Dietary Restrictions',
    message: 'Please follow the prescribed diet strictly for the next 3 days to maximize treatment benefits.',
    read: false,
    timestamp: new Date().toISOString(),
    priority: 'high',
    channels: ['in-app', 'email'],
    patientName: 'John Doe',
    therapyName: 'Abhyanga'
  }
];

let feedback = [
  {
    id: 1,
    bookingId: 1,
    patientName: 'John Doe',
    rating: 5,
    symptoms: 'Joint pain reduced significantly, stiffness improved',
    sideEffects: 'None',
    improvements: 'Better sleep, increased energy, reduced stress levels',
    date: '2025-01-10',
    therapyEffectiveness: 'Excellent',
    wouldRecommend: true,
    followUpNeeded: false
  },
  {
    id: 2,
    bookingId: 2,
    patientName: 'Jane Smith',
    rating: 4,
    symptoms: 'Mild headache after session',
    sideEffects: 'Slight dizziness for 30 minutes',
    improvements: 'Better focus, reduced anxiety',
    date: '2025-01-11',
    therapyEffectiveness: 'Good',
    wouldRecommend: true,
    followUpNeeded: true
  },
  {
    id: 3,
    bookingId: 4,
    patientName: 'Sarah Wilson',
    rating: 5,
    symptoms: 'Weight loss of 2kg in 2 weeks',
    sideEffects: 'None',
    improvements: 'Improved skin texture, better circulation',
    date: '2025-01-12',
    therapyEffectiveness: 'Excellent',
    wouldRecommend: true,
    followUpNeeded: false
  }
];

// API Routes
app.get('/api/therapies', (req, res) => {
  res.json(therapies);
});

app.get('/api/practitioners', (req, res) => {
  res.json(practitioners);
});

app.get('/api/bookings', (req, res) => {
  const bookingsWithDetails = bookings.map(booking => ({
    ...booking,
    therapy: therapies.find(t => t.id === booking.therapyId),
    practitioner: practitioners.find(p => p.id === booking.practitionerId)
  }));
  res.json(bookingsWithDetails);
});

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    ...req.body,
    status: 'confirmed',
    progress: 'scheduled',
    day: 0,
    totalDays: req.body.totalDays || 1
  };
  bookings.push(newBooking);
  
  // Create notification
  const newNotification = {
    id: notifications.length + 1,
    bookingId: newBooking.id,
    type: 'pre-procedure',
    title: `Upcoming ${therapies.find(t => t.id === newBooking.therapyId)?.name} Session`,
    message: 'Please prepare for your upcoming therapy session. Check pre-procedure instructions.',
    read: false,
    timestamp: new Date().toISOString()
  };
  notifications.push(newNotification);
  
  res.json(newBooking);
});

app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id));
  if (notification) {
    notification.read = true;
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.get('/api/feedback', (req, res) => {
  res.json(feedback);
});

app.post('/api/feedback', (req, res) => {
  const newFeedback = {
    id: feedback.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  feedback.push(newFeedback);
  res.json(newFeedback);
});

app.put('/api/bookings/:id/progress', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (booking) {
    booking.progress = req.body.progress;
    booking.day = req.body.day;
    res.json(booking);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.get('/api/dashboard-stats', (req, res) => {
  const stats = {
    totalBookings: bookings.length,
    completedSessions: bookings.filter(b => b.progress === 'completed').length,
    upcomingSessions: bookings.filter(b => b.progress === 'scheduled').length,
    unreadNotifications: notifications.filter(n => !n.read).length,
    weeklyProgress: [
      { day: 'Mon', sessions: 3 },
      { day: 'Tue', sessions: 5 },
      { day: 'Wed', sessions: 4 },
      { day: 'Thu', sessions: 6 },
      { day: 'Fri', sessions: 4 },
      { day: 'Sat', sessions: 7 },
      { day: 'Sun', sessions: 2 }
    ],
    therapyDistribution: [
      { name: 'Abhyanga', value: 35 },
      { name: 'Shirodhara', value: 25 },
      { name: 'Panchakarma', value: 20 },
      { name: 'Udvartana', value: 20 }
    ]
  };
  res.json(stats);
});

// New API endpoints for enhanced functionality

// Get therapy details by ID
app.get('/api/therapies/:id', (req, res) => {
  const therapy = therapies.find(t => t.id === parseInt(req.params.id));
  if (therapy) {
    res.json(therapy);
  } else {
    res.status(404).json({ error: 'Therapy not found' });
  }
});

// Get practitioner details by ID
app.get('/api/practitioners/:id', (req, res) => {
  const practitioner = practitioners.find(p => p.id === parseInt(req.params.id));
  if (practitioner) {
    res.json(practitioner);
  } else {
    res.status(404).json({ error: 'Practitioner not found' });
  }
});

// Get booking details by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (booking) {
    const bookingWithDetails = {
      ...booking,
      therapy: therapies.find(t => t.id === booking.therapyId),
      practitioner: practitioners.find(p => p.id === booking.practitionerId)
    };
    res.json(bookingWithDetails);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Get feedback analytics
app.get('/api/feedback/analytics', (req, res) => {
  const analytics = {
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0,
    ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: feedback.filter(f => f.rating === rating).length,
      percentage: feedback.length > 0 ? (feedback.filter(f => f.rating === rating).length / feedback.length) * 100 : 0
    })),
    positiveFeedback: feedback.filter(f => f.rating >= 4).length,
    negativeFeedback: feedback.filter(f => f.rating <= 2).length,
    neutralFeedback: feedback.filter(f => f.rating === 3).length,
    recommendationRate: feedback.length > 0 ? (feedback.filter(f => f.wouldRecommend).length / feedback.length) * 100 : 0,
    followUpNeeded: feedback.filter(f => f.followUpNeeded).length
  };
  res.json(analytics);
});

// Get patient history
app.get('/api/patients/:name/history', (req, res) => {
  const patientName = decodeURIComponent(req.params.name);
  const patientBookings = bookings.filter(b => b.patientName === patientName);
  const patientFeedback = feedback.filter(f => f.patientName === patientName);
  
  res.json({
    bookings: patientBookings.map(booking => ({
      ...booking,
      therapy: therapies.find(t => t.id === booking.therapyId),
      practitioner: practitioners.find(p => p.id === booking.practitionerId)
    })),
    feedback: patientFeedback
  });
});

// Get practitioner performance
app.get('/api/practitioners/:id/performance', (req, res) => {
  const practitionerId = parseInt(req.params.id);
  const practitionerBookings = bookings.filter(b => b.practitionerId === practitionerId);
  const practitionerFeedback = feedback.filter(f => 
    practitionerBookings.some(b => b.id === f.bookingId)
  );
  
  const performance = {
    totalPatients: practitionerBookings.length,
    completedSessions: practitionerBookings.filter(b => b.progress === 'completed').length,
    averageRating: practitionerFeedback.length > 0 ? 
      practitionerFeedback.reduce((sum, f) => sum + f.rating, 0) / practitionerFeedback.length : 0,
    patientSatisfaction: practitionerFeedback.length > 0 ? 
      (practitionerFeedback.filter(f => f.rating >= 4).length / practitionerFeedback.length) * 100 : 0,
    revenue: practitionerBookings.reduce((sum, b) => sum + b.cost, 0)
  };
  
  res.json(performance);
});

// Get therapy effectiveness
app.get('/api/therapies/:id/effectiveness', (req, res) => {
  const therapyId = parseInt(req.params.id);
  const therapyBookings = bookings.filter(b => b.therapyId === therapyId);
  const therapyFeedback = feedback.filter(f => 
    therapyBookings.some(b => b.id === f.bookingId)
  );
  
  const effectiveness = {
    totalSessions: therapyBookings.length,
    completionRate: therapyBookings.length > 0 ? 
      (therapyBookings.filter(b => b.progress === 'completed').length / therapyBookings.length) * 100 : 0,
    averageRating: therapyFeedback.length > 0 ? 
      therapyFeedback.reduce((sum, f) => sum + f.rating, 0) / therapyFeedback.length : 0,
    commonImprovements: therapyFeedback.map(f => f.improvements).join(' '),
    sideEffects: therapyFeedback.map(f => f.sideEffects).filter(s => s && s !== 'None'),
    recommendationRate: therapyFeedback.length > 0 ? 
      (therapyFeedback.filter(f => f.wouldRecommend).length / therapyFeedback.length) * 100 : 0
  };
  
  res.json(effectiveness);
});

app.listen(PORT, () => {
  console.log(`AyurSutra backend running on port ${PORT}`);
});