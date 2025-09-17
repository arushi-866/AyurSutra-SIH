import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, CheckCircle, Zap, Search, Repeat, X } from 'lucide-react';
import { api } from '../services/api';
import type { Therapy, Practitioner, Booking } from '../types';

export default function Schedule() {
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [, setSelectedTherapy] = useState<Therapy | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'timeline'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    therapyId: 0,
    practitionerId: 0,
    date: '',
    time: '',
    totalDays: 1
  });

  // Auto-schedule form state
  const [autoScheduleData, setAutoScheduleData] = useState({
    patientName: '',
    therapyId: 0,
    practitionerId: 0,
    startDate: '',
    preferredTime: '',
    totalDays: 1,
    frequency: 'daily', // daily, weekly, bi-weekly
    autoReschedule: true,
    bufferTime: 30 // minutes
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [therapiesData, practitionersData, bookingsData] = await Promise.all([
        api.getTherapies(),
        api.getPractitioners(),
        api.getBookings()
      ]);
      setTherapies(therapiesData);
      setPractitioners(practitionersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBooking(formData);
      await fetchData(); // Refresh data
      setShowBookingForm(false);
      setFormData({
        patientName: '',
        therapyId: 0,
        practitionerId: 0,
        date: '',
        time: '',
        totalDays: 1
      });
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking');
    }
  };

  const updateProgress = async (bookingId: number, progress: string, day: number) => {
    try {
      await api.updateBookingProgress(bookingId, progress, day);
      await fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleAutoSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate auto-scheduling logic
      const sessions = [];
      const startDate = new Date(autoScheduleData.startDate);
      
      for (let i = 0; i < autoScheduleData.totalDays; i++) {
        const sessionDate = new Date(startDate);
        sessionDate.setDate(startDate.getDate() + (i * (autoScheduleData.frequency === 'daily' ? 1 : 7)));
        
        sessions.push({
          patientName: autoScheduleData.patientName,
          therapyId: autoScheduleData.therapyId,
          practitionerId: autoScheduleData.practitionerId,
          date: sessionDate.toISOString().split('T')[0],
          time: autoScheduleData.preferredTime,
          totalDays: autoScheduleData.totalDays
        });
      }

      // Create all sessions
      for (const session of sessions) {
        await api.createBooking(session);
      }
      
      await fetchData();
      setShowAutoSchedule(false);
      setAutoScheduleData({
        patientName: '',
        therapyId: 0,
        practitionerId: 0,
        startDate: '',
        preferredTime: '',
        totalDays: 1,
        frequency: 'daily',
        autoReschedule: true,
        bufferTime: 30
      });
      alert('Auto-schedule completed successfully!');
    } catch (error) {
      console.error('Error auto-scheduling:', error);
      alert('Error creating auto-schedule');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.progress === filterStatus;
    const searchMatch = searchTerm === '' || 
      booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.therapy?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.practitioner?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Therapy Schedule</h1>
            <p className="text-gray-600 mt-1">Manage bookings and track therapy progress with automated scheduling</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAutoSchedule(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Zap className="h-4 w-4" />
              <span>Auto Schedule</span>
            </button>
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Book Therapy</span>
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
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* View Mode */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Available Therapies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Therapies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapies.map((therapy) => (
            <div key={therapy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{therapy.name}</h3>
              <p className="text-gray-600 mb-4">{therapy.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{therapy.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">₹{therapy.price}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Benefits:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {therapy.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-emerald-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedTherapy(therapy);
                  setFormData({ ...formData, therapyId: therapy.id });
                  setShowBookingForm(true);
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Current Bookings</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
          </div>
        </div>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.therapy?.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.progress)}`}>
                        {booking.progress.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{booking.patientName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress: Day {booking.day} of {booking.totalDays}</span>
                        <span>{Math.round((booking.day / booking.totalDays) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(booking.day / booking.totalDays) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {booking.progress !== 'completed' && (
                    <div className="flex space-x-2">
                      {booking.progress === 'scheduled' && (
                        <button
                          onClick={() => updateProgress(booking.id, 'in-progress', 1)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Start Session
                        </button>
                      )}
                      {booking.progress === 'in-progress' && booking.day < booking.totalDays && (
                        <button
                          onClick={() => updateProgress(booking.id, 'in-progress', booking.day + 1)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Complete Day {booking.day + 1}
                        </button>
                      )}
                      {booking.progress === 'in-progress' && booking.day >= booking.totalDays && (
                        <button
                          onClick={() => updateProgress(booking.id, 'completed', booking.totalDays)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Therapy Session</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapy</label>
                <select
                  required
                  value={formData.therapyId}
                  onChange={(e) => setFormData({ ...formData, therapyId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>Select Therapy</option>
                  {therapies.map((therapy) => (
                    <option key={therapy.id} value={therapy.id}>
                      {therapy.name} - ₹{therapy.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practitioner</label>
                <select
                  required
                  value={formData.practitionerId}
                  onChange={(e) => setFormData({ ...formData, practitionerId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>Select Practitioner</option>
                  {practitioners.map((practitioner) => (
                    <option key={practitioner.id} value={practitioner.id}>
                      {practitioner.name} - {practitioner.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="21"
                  required
                  value={formData.totalDays}
                  onChange={(e) => setFormData({ ...formData, totalDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto-Schedule Modal */}
      {showAutoSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 text-blue-600 mr-2" />
                Automated Therapy Scheduling
              </h3>
              <button
                onClick={() => setShowAutoSchedule(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAutoSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={autoScheduleData.patientName}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Therapy</label>
                  <select
                    required
                    value={autoScheduleData.therapyId}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, therapyId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Select Therapy</option>
                    {therapies.map((therapy) => (
                      <option key={therapy.id} value={therapy.id}>
                        {therapy.name} - ₹{therapy.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Practitioner</label>
                  <select
                    required
                    value={autoScheduleData.practitionerId}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, practitionerId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Select Practitioner</option>
                    {practitioners.map((practitioner) => (
                      <option key={practitioner.id} value={practitioner.id}>
                        {practitioner.name} - {practitioner.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={autoScheduleData.startDate}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={autoScheduleData.preferredTime}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Sessions</label>
                  <input
                    type="number"
                    min="1"
                    max="21"
                    required
                    value={autoScheduleData.totalDays}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, totalDays: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={autoScheduleData.frequency}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoScheduleData.autoReschedule}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, autoReschedule: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable auto-rescheduling for conflicts</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={autoScheduleData.bufferTime}
                    onChange={(e) => setAutoScheduleData({ ...autoScheduleData, bufferTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Repeat className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Auto-Schedule Preview</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      This will create {autoScheduleData.totalDays} sessions starting from {autoScheduleData.startDate} 
                      at {autoScheduleData.preferredTime} with {autoScheduleData.frequency} frequency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAutoSchedule(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Auto-Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}