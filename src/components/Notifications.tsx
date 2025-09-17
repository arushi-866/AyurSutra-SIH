import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, X, Mail, MessageSquare, Settings, Search } from 'lucide-react';
import { api } from '../services/api';
import type { Notification } from '../types';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pre-procedure' | 'post-procedure' | 'reminder' | 'alert' | 'milestone'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    inApp: true,
    preProcedure: true,
    postProcedure: true,
    reminders: true,
    alerts: true,
    milestones: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filter === 'all' || notification.type === filter;
    const priorityMatch = priorityFilter === 'all' || notification.priority === priorityFilter;
    const searchMatch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && priorityMatch && searchMatch;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pre-procedure':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'post-procedure':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'milestone':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'in-app':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? 'bg-opacity-30' : 'bg-opacity-60';
    switch (type) {
      case 'pre-procedure':
        return `bg-amber-50 border-amber-200 ${opacity}`;
      case 'post-procedure':
        return `bg-emerald-50 border-emerald-200 ${opacity}`;
      default:
        return `bg-blue-50 border-blue-200 ${opacity}`;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your therapy instructions and reminders
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
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
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pre-procedure')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'pre-procedure'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pre-Procedure
            </button>
            <button
              onClick={() => setFilter('post-procedure')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'post-procedure'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Post-Procedure
            </button>
            <button
              onClick={() => setFilter('reminder')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'reminder'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reminders
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-xl p-6 transition-all duration-200 ${getNotificationBg(
                notification.type,
                notification.read
              )} ${!notification.read ? 'ring-2 ring-opacity-50' : ''} ${
                notification.priority === 'urgent' ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      {!notification.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.type === 'pre-procedure'
                          ? 'bg-amber-100 text-amber-800'
                          : notification.type === 'post-procedure'
                          ? 'bg-emerald-100 text-emerald-800'
                          : notification.type === 'reminder'
                          ? 'bg-blue-100 text-blue-800'
                          : notification.type === 'alert'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type.replace('-', ' ').toUpperCase()}
                      </span>

                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      notification.read ? 'text-gray-600' : 'text-gray-800'
                    }`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Patient:</span>
                          <span className="ml-1">{notification.patientName}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Therapy:</span>
                          <span className="ml-1">{notification.therapyName}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {notification.channels.map((channel, index) => (
                          <div key={index} className="flex items-center text-gray-400" title={channel}>
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title="Mark as read"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sample Instructions for Demo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-amber-700 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pre-Procedure Instructions
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Avoid heavy meals 2-3 hours before the session</li>
              <li>• Wear comfortable, loose-fitting clothes</li>
              <li>• Arrive 15 minutes early for preparation</li>
              <li>• Inform about any allergies or medical conditions</li>
              <li>• Stay hydrated but avoid excess water intake</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-emerald-700 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Post-Procedure Care
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Rest for at least 30 minutes after treatment</li>
              <li>• Avoid cold water or beverages</li>
              <li>• Take warm shower only after 2-3 hours</li>
              <li>• Eat light, warm meals</li>
              <li>• Follow prescribed dietary restrictions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Channel Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={(e) => setNotificationSettings({...notificationSettings, email: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms}
                      onChange={(e) => setNotificationSettings({...notificationSettings, sms: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">In-App Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.inApp}
                      onChange={(e) => setNotificationSettings({...notificationSettings, inApp: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Pre-Procedure Instructions</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.preProcedure}
                      onChange={(e) => setNotificationSettings({...notificationSettings, preProcedure: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Post-Procedure Care</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.postProcedure}
                      onChange={(e) => setNotificationSettings({...notificationSettings, postProcedure: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Session Reminders</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.reminders}
                      onChange={(e) => setNotificationSettings({...notificationSettings, reminders: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Important Alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.alerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, alerts: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Progress Milestones</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.milestones}
                      onChange={(e) => setNotificationSettings({...notificationSettings, milestones: e.target.checked})}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save settings logic here
                    setShowSettings(false);
                    alert('Notification settings saved!');
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}