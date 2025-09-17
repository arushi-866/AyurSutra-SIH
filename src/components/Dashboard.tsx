import { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Users, Activity, Bell, TrendingUp, Clock, Heart, Target, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardStats, Booking } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const getDemoStats = (): DashboardStats => ({
    totalBookings: 12,
    completedSessions: 7,
    upcomingSessions: 4,
    unreadNotifications: 2,
    weeklyProgress: [
      { day: 'Mon', sessions: 3 },
      { day: 'Tue', sessions: 4 },
      { day: 'Wed', sessions: 2 },
      { day: 'Thu', sessions: 5 },
      { day: 'Fri', sessions: 3 },
      { day: 'Sat', sessions: 6 },
      { day: 'Sun', sessions: 2 }
    ],
    therapyDistribution: [
      { name: 'Abhyanga', value: 35 },
      { name: 'Shirodhara', value: 25 },
      { name: 'Panchakarma', value: 20 },
      { name: 'Udvartana', value: 20 }
    ]
  });

  const getDemoBookings = (): Booking[] => [
    {
      id: 101,
      patientName: 'Demo Patient 1',
      therapyId: 1,
      practitionerId: 1,
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      status: 'confirmed',
      progress: 'in-progress',
      day: 2,
      totalDays: 5,
      therapy: { id: 1, name: 'Abhyanga', description: '', duration: '60 minutes', price: 120, benefits: [], category: 'Massage Therapy' },
      practitioner: { id: 1, name: 'Dr. Priya Sharma', specialization: 'Panchakarma Expert', experience: '15 years' }
    },
    {
      id: 102,
      patientName: 'Demo Patient 2',
      therapyId: 2,
      practitionerId: 2,
      date: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0, 10),
      time: '14:30',
      status: 'confirmed',
      progress: 'scheduled',
      day: 0,
      totalDays: 1,
      therapy: { id: 2, name: 'Shirodhara', description: '', duration: '45 minutes', price: 150, benefits: [], category: 'Head Therapy' },
      practitioner: { id: 2, name: 'Dr. Raj Kumar', specialization: 'Ayurvedic Physician', experience: '10 years' }
    },
    {
      id: 103,
      patientName: 'Demo Patient 3',
      therapyId: 3,
      practitionerId: 1,
      date: new Date(Date.now() + 2*24*60*60*1000).toISOString().slice(0, 10),
      time: '09:00',
      status: 'confirmed',
      progress: 'scheduled',
      day: 0,
      totalDays: 5,
      therapy: { id: 3, name: 'Panchakarma Detox', description: '', duration: '5 days', price: 800, benefits: [], category: 'Detox Program' },
      practitioner: { id: 1, name: 'Dr. Priya Sharma', specialization: 'Panchakarma Expert', experience: '15 years' }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          api.getDashboardStats(),
          api.getBookings()
        ]);
        setStats(statsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to demo content so the dashboard is not empty
        setStats(getDemoStats());
        setBookings(getDemoBookings());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = ['#059669', '#0d9488', '#f59e0b', '#ef4444'];

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions,
      icon: Activity,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Active Therapies',
      value: bookings.filter(b => b.progress === 'in-progress').length,
      icon: Heart,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Success Rate',
      value: `${Math.round((stats.completedSessions / Math.max(stats.totalBookings, 1)) * 100)}%`,
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Unread Notifications',
      value: stats.unreadNotifications,
      icon: Bell,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      trend: '-1',
      trendUp: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to AyurSutra</h1>
        <p className="text-emerald-100">Your comprehensive Panchakarma management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center text-xs font-medium ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${stat.trendUp ? '' : 'rotate-180'}`} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Therapy Tracking */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Real-Time Therapy Tracking</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.filter(b => b.progress === 'in-progress').map((booking) => (
            <div key={booking.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{booking.therapy?.name}</h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  Day {booking.day}/{booking.totalDays}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{booking.patientName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{booking.time}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((booking.day / booking.totalDays) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(booking.day / booking.totalDays) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Weekly Session Progress</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#059669" 
                fill="url(#colorGradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Therapy Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <Users className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Therapy Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.therapyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.therapyDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient Progress Tracking */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <Award className="h-5 w-5 text-emerald-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Patient Progress Milestones</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookings.filter(b => b.progress === 'completed').slice(0, 4).map((booking) => (
            <div key={booking.id} className="text-center">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{booking.patientName}</h4>
              <p className="text-sm text-gray-600 mb-2">{booking.therapy?.name}</p>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Heart 
                    key={star} 
                    className={`h-4 w-4 ${
                      star <= Math.floor(Math.random() * 3) + 3 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Panchakarma */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">About Panchakarma</h3>
        <p className="text-sm text-gray-600 mb-6">
          Panchakarma is a classical Ayurvedic detox and rejuvenation protocol designed to balance the doshas and remove deep-seated toxins. 
          The five core actions help cleanse, nourish, and restore the body and mind, often used for chronic conditions and preventive care.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <h4 className="font-semibold text-emerald-800 mb-1">Vamana</h4>
            <p className="text-xs text-emerald-700">Therapeutic emesis to expel aggravated Kapha; supports respiratory and metabolic health.</p>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <h4 className="font-semibold text-emerald-800 mb-1">Virechana</h4>
            <p className="text-xs text-emerald-700">Therapeutic purgation to eliminate Pitta toxins; beneficial for skin, liver, and digestion.</p>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <h4 className="font-semibold text-emerald-800 mb-1">Basti</h4>
            <p className="text-xs text-emerald-700">Medicated enema for Vata balance; improves elimination, joint health, and nervous system tone.</p>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <h4 className="font-semibold text-emerald-800 mb-1">Nasya</h4>
            <p className="text-xs text-emerald-700">Nasal administration of medicated oils; supports sinus, head, and cognition.</p>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <h4 className="font-semibold text-emerald-800 mb-1">Raktamokshana</h4>
            <p className="text-xs text-emerald-700">Targeted bloodletting techniques to purify blood and alleviate inflammatory conditions.</p>
          </div>
        </div>
      </div>

      {/* Panchakarma Therapies Gallery */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Panchakarma Therapies</h3>
        <p className="text-sm text-gray-600 mb-6">Explore signature therapies that restore balance and vitality.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
            <img alt="Abhyanga therapy" src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Abhyanga</h4>
              <p className="text-sm text-gray-600 mt-1">Full-body warm oil massage to nourish tissues and calm the nervous system.</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
            <img alt="Shirodhara therapy" src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Shirodhara</h4>
              <p className="text-sm text-gray-600 mt-1">Stream of warm oil over the forehead to ease stress and improve sleep.</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
            <img alt="Panchakarma detox" src="https://images.unsplash.com/photo-1556228724-4c1f4f6a42a2?q=80&w=1200&auto=format&fit=crop" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Panchakarma Detox</h4>
              <p className="text-sm text-gray-600 mt-1">Comprehensive cleansing protocol tailored to your constitution and needs.</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
            <img alt="Udvartana therapy" src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Udvartana</h4>
              <p className="text-sm text-gray-600 mt-1">Herbal powder massage supporting circulation, metabolism, and skin health.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h3>
          <span className="text-xs text-gray-500">Next 5</span>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings
            .filter(b => b.progress === 'scheduled' || b.progress === 'in-progress')
            .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
            .slice(0, 5)
            .map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.therapy?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{b.patientName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(b.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{b.time}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${
                    b.progress === 'in-progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {b.progress.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          {bookings.filter(b => b.progress === 'scheduled' || b.progress === 'in-progress').length === 0 && (
            <div className="py-6 text-center text-sm text-gray-500">No upcoming sessions</div>
          )}
        </div>
      </div>

      {/* Panchakarma Care Tips */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Panchakarma Care Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div className="space-y-2">
            <p className="font-medium text-amber-700">Before Session</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Avoid heavy meals 2–3 hours prior</li>
              <li>Stay hydrated; avoid excess caffeine</li>
              <li>Wear comfortable, loose-fitting clothes</li>
              <li>Inform about allergies/medications</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-emerald-700">After Session</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Rest for 30–60 minutes</li>
              <li>Prefer warm, light meals and fluids</li>
              <li>Avoid cold exposure and strenuous activity</li>
              <li>Follow practitioner’s specific advice</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/schedule" className="flex items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors duration-200">
            <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-emerald-700 font-medium">Schedule Therapy</span>
          </Link>
          <Link to="/notifications" className="flex items-center justify-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors duration-200">
            <Bell className="h-5 w-5 text-teal-600 mr-2" />
            <span className="text-teal-700 font-medium">View Notifications</span>
          </Link>
          <Link to="/feedback" className="flex items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors duration-200">
            <Activity className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-amber-700 font-medium">Track Progress</span>
          </Link>
        </div>
      </div>
    </div>
  );
}