import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar, Star, Activity, Target, Award, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { Booking, Feedback, Therapy, Practitioner } from '../types';

interface AnalyticsData {
  therapyEffectiveness: Array<{ name: string; effectiveness: number; sessions: number }>;
  practitionerPerformance: Array<{ name: string; rating: number; patients: number; revenue: number }>;
  monthlyTrends: Array<{ month: string; bookings: number; revenue: number; satisfaction: number }>;
  patientSatisfaction: Array<{ rating: number; count: number; percentage: number }>;
  therapyPopularity: Array<{ name: string; bookings: number; revenue: number }>;
  recoveryMetrics: Array<{ week: string; improvement: number; symptoms: number }>;
}

export default function Analytics() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && feedback.length > 0) {
      generateAnalytics();
    }
  }, [bookings, feedback, therapies, practitioners, timeRange]);

  const fetchData = async () => {
    try {
      const [bookingsData, feedbackData, therapiesData, practitionersData] = await Promise.all([
        api.getBookings(),
        api.getFeedback(),
        api.getTherapies(),
        api.getPractitioners()
      ]);
      setBookings(bookingsData);
      setFeedback(feedbackData);
      setTherapies(therapiesData);
      setPractitioners(practitionersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Generate mock data for demo
      generateMockAnalytics();
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const mockData: AnalyticsData = {
      therapyEffectiveness: [
        { name: 'Abhyanga', effectiveness: 92, sessions: 45 },
        { name: 'Shirodhara', effectiveness: 88, sessions: 32 },
        { name: 'Panchakarma', effectiveness: 95, sessions: 28 },
        { name: 'Udvartana', effectiveness: 85, sessions: 38 },
        { name: 'Basti', effectiveness: 90, sessions: 22 },
        { name: 'Nasya', effectiveness: 87, sessions: 18 }
      ],
      practitionerPerformance: [
        { name: 'Dr. Priya Sharma', rating: 4.9, patients: 45, revenue: 125000 },
        { name: 'Dr. Raj Kumar', rating: 4.7, patients: 38, revenue: 98000 },
        { name: 'Dr. Meera Patel', rating: 4.8, patients: 42, revenue: 110000 },
        { name: 'Dr. Anil Gupta', rating: 4.6, patients: 35, revenue: 89000 }
      ],
      monthlyTrends: [
        { month: 'Jan', bookings: 45, revenue: 125000, satisfaction: 4.8 },
        { month: 'Feb', bookings: 52, revenue: 142000, satisfaction: 4.7 },
        { month: 'Mar', bookings: 48, revenue: 135000, satisfaction: 4.9 },
        { month: 'Apr', bookings: 58, revenue: 165000, satisfaction: 4.8 },
        { month: 'May', bookings: 62, revenue: 178000, satisfaction: 4.9 },
        { month: 'Jun', bookings: 55, revenue: 158000, satisfaction: 4.8 }
      ],
      patientSatisfaction: [
        { rating: 5, count: 85, percentage: 68 },
        { rating: 4, count: 28, percentage: 22 },
        { rating: 3, count: 8, percentage: 6 },
        { rating: 2, count: 3, percentage: 2 },
        { rating: 1, count: 1, percentage: 1 }
      ],
      therapyPopularity: [
        { name: 'Abhyanga', bookings: 45, revenue: 54000 },
        { name: 'Shirodhara', bookings: 32, revenue: 48000 },
        { name: 'Panchakarma', bookings: 28, revenue: 224000 },
        { name: 'Udvartana', bookings: 38, revenue: 38000 },
        { name: 'Basti', bookings: 22, revenue: 44000 },
        { name: 'Nasya', bookings: 18, revenue: 14400 }
      ],
      recoveryMetrics: [
        { week: 'Week 1', improvement: 15, symptoms: 85 },
        { week: 'Week 2', improvement: 35, symptoms: 65 },
        { week: 'Week 3', improvement: 55, symptoms: 45 },
        { week: 'Week 4', improvement: 75, symptoms: 25 },
        { week: 'Week 5', improvement: 85, symptoms: 15 },
        { week: 'Week 6', improvement: 92, symptoms: 8 }
      ]
    };
    setAnalyticsData(mockData);
  };

  const generateAnalytics = () => {
    // Generate real analytics from data
    generateMockAnalytics(); // For now, use mock data
  };

  const COLORS = ['#059669', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const totalRevenue = analyticsData?.monthlyTrends.reduce((sum, month) => sum + month.revenue, 0) || 0;
  const totalBookings = analyticsData?.monthlyTrends.reduce((sum, month) => sum + month.bookings, 0) || 0;
  const averageSatisfaction = analyticsData?.monthlyTrends.reduce((sum, month) => sum + month.satisfaction, 0) / (analyticsData?.monthlyTrends.length || 1) || 0;
  const topTherapy = analyticsData?.therapyPopularity.reduce((max, therapy) => therapy.bookings > max.bookings ? therapy : max, analyticsData.therapyPopularity[0]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of therapy effectiveness and patient outcomes</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">₹{(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-emerald-200 text-xs mt-1">+12% from last period</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold">{totalBookings}</p>
              <p className="text-blue-200 text-xs mt-1">+8% from last period</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Avg Satisfaction</p>
              <p className="text-3xl font-bold">{averageSatisfaction.toFixed(1)}</p>
              <p className="text-amber-200 text-xs mt-1">+0.2 from last period</p>
            </div>
            <Star className="h-8 w-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Top Therapy</p>
              <p className="text-xl font-bold">{topTherapy?.name}</p>
              <p className="text-purple-200 text-xs mt-1">{topTherapy?.bookings} bookings</p>
            </div>
            <Award className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
            Monthly Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData?.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} />
              <Area type="monotone" dataKey="satisfaction" stackId="2" stroke="#0d9488" fill="#0d9488" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Therapy Effectiveness */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 text-emerald-600 mr-2" />
            Therapy Effectiveness
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.therapyEffectiveness}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="effectiveness" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Satisfaction Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Star className="h-5 w-5 text-emerald-600 mr-2" />
            Patient Satisfaction Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData?.patientSatisfaction}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rating, percentage }) => `${rating}★ (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData?.patientSatisfaction.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recovery Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 text-emerald-600 mr-2" />
            Average Recovery Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.recoveryMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="improvement" stroke="#059669" strokeWidth={3} />
              <Line type="monotone" dataKey="symptoms" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Practitioner Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="h-5 w-5 text-emerald-600 mr-2" />
          Practitioner Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Practitioner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Patients</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.practitionerPerformance.map((practitioner, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-2 rounded-full mr-3">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-900">{practitioner.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{practitioner.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{practitioner.patients}</td>
                  <td className="py-3 px-4">₹{(practitioner.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${(practitioner.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{Math.round((practitioner.rating / 5) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Therapy Popularity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="h-5 w-5 text-emerald-600 mr-2" />
          Therapy Popularity & Revenue
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData?.therapyPopularity} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#059669" />
            <Bar dataKey="revenue" fill="#0d9488" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-emerald-900">Growth Trend</h4>
            </div>
            <p className="text-sm text-emerald-700">
              Bookings have increased by 12% this month, with Panchakarma showing the highest demand.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Patient Satisfaction</h4>
            </div>
            <p className="text-sm text-blue-700">
              90% of patients rate their experience 4 stars or above, indicating excellent service quality.
            </p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-amber-900">Therapy Effectiveness</h4>
            </div>
            <p className="text-sm text-amber-700">
              Panchakarma shows 95% effectiveness rate, making it the most successful treatment option.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}