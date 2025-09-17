import { useState, useEffect } from 'react';
import { MessageSquare, Star, Plus, TrendingUp, Calendar, User, BarChart3, Search, Award, Target, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { Feedback as FeedbackType, Booking } from '../types';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid');

  // Form state
  const [formData, setFormData] = useState({
    bookingId: 0,
    patientName: '',
    rating: 5,
    symptoms: '',
    sideEffects: '',
    improvements: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbackData, bookingsData] = await Promise.all([
        api.getFeedback(),
        api.getBookings()
      ]);
      setFeedbacks(feedbackData);
      setBookings(bookingsData.filter((b: Booking) => b.progress === 'completed'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFeedback(formData);
      await fetchData(); // Refresh data
      setShowFeedbackForm(false);
      setFormData({
        bookingId: 0,
        patientName: '',
        rating: 5,
        symptoms: '',
        sideEffects: '',
        improvements: ''
      });
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length 
    : 0;

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const ratingMatch = filterRating === 'all' || feedback.rating.toString() === filterRating;
    const searchMatch = searchTerm === '' || 
      feedback.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.improvements.toLowerCase().includes(searchTerm.toLowerCase());
    
    return ratingMatch && searchMatch;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: feedbacks.length > 0 ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100 : 0
  }));

  const positiveFeedbackCount = feedbacks.filter(f => f.rating >= 4).length;
  const negativeFeedbackCount = feedbacks.filter(f => f.rating <= 2).length;
  const neutralFeedbackCount = feedbacks.filter(f => f.rating === 3).length;

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
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Feedback & Analytics</h1>
            <p className="text-gray-600 mt-1">Track patient experiences, treatment outcomes, and therapy effectiveness</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Feedback
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Analytics
              </button>
            </div>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Feedback</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Feedbacks</p>
              <p className="text-3xl font-bold">{feedbacks.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Average Rating</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                <Star className="h-6 w-6 text-amber-200 fill-current" />
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Positive Reviews</p>
              <p className="text-3xl font-bold">{positiveFeedbackCount}</p>
              <p className="text-green-200 text-xs mt-1">
                {feedbacks.length > 0 ? Math.round((positiveFeedbackCount / feedbacks.length) * 100) : 0}% of total
              </p>
            </div>
            <Award className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Needs Attention</p>
              <p className="text-3xl font-bold">{negativeFeedbackCount}</p>
              <p className="text-red-200 text-xs mt-1">
                {feedbacks.length > 0 ? Math.round((negativeFeedbackCount / feedbacks.length) * 100) : 0}% of total
              </p>
            </div>
            <Target className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 text-emerald-600 mr-2" />
              Rating Distribution
            </h3>
            <div className="space-y-4">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Sentiment Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="h-5 w-5 text-emerald-600 mr-2" />
              Sentiment Analysis
            </h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {feedbacks.length > 0 ? Math.round((positiveFeedbackCount / feedbacks.length) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">Positive Sentiment</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{positiveFeedbackCount}</div>
                  <div className="text-xs text-green-600">Positive</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{neutralFeedbackCount}</div>
                  <div className="text-xs text-yellow-600">Neutral</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{negativeFeedbackCount}</div>
                  <div className="text-xs text-red-600">Negative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'analytics' ? 'All Feedback' : 'Recent Feedback'}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks</span>
          </div>
        </div>
        
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No feedback found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.patientName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{feedback.date}</span>
                      </div>
                    </div>
                  </div>
                  {renderStars(feedback.rating)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {feedback.symptoms || 'No symptoms reported'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Side Effects</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {feedback.sideEffects || 'No side effects reported'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Improvements</h4>
                    <p className="text-sm text-gray-600 bg-emerald-50 p-3 rounded-lg">
                      {feedback.improvements || 'No improvements noted'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Feedback</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completed Session
                  </label>
                  <select
                    required
                    value={formData.bookingId}
                    onChange={(e) => {
                      const selectedBooking = bookings.find(b => b.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        bookingId: parseInt(e.target.value),
                        patientName: selectedBooking?.patientName || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>Select Completed Session</option>
                    {bookings.map((booking) => (
                      <option key={booking.id} value={booking.id}>
                        {booking.therapy?.name} - {booking.patientName} ({booking.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                {renderStars(formData.rating, true, (rating) => 
                  setFormData({ ...formData, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms Experienced
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe any symptoms or reactions during treatment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Side Effects
                </label>
                <textarea
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Any side effects or discomfort experienced..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Improvements Noticed
                </label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="What improvements have you noticed in your health..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}