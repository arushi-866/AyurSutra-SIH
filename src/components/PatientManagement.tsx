import { useState, useEffect } from 'react';
import { User, Plus, Search, Calendar, Phone, Mail, FileText, Activity, Heart, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import type { Booking, Feedback } from '../types';

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  constitution: 'Vata' | 'Pitta' | 'Kapha' | 'Mixed';
  allergies: string;
  currentMedications: string;
  emergencyContact: string;
  joinDate: string;
  totalSessions: number;
  completedSessions: number;
  lastVisit: string;
  nextAppointment: string;
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
    constitution: 'Mixed' as const,
    allergies: '',
    currentMedications: '',
    emergencyContact: ''
  });

  // Mock patient data for demo
  const mockPatients: Patient[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      phone: '+91-9876543210',
      email: 'john.doe@email.com',
      address: '123 Main St, Mumbai, Maharashtra',
      medicalHistory: 'Hypertension, Diabetes Type 2',
      constitution: 'Vata',
      allergies: 'Nuts, Shellfish',
      currentMedications: 'Metformin, Lisinopril',
      emergencyContact: '+91-9876543211',
      joinDate: '2024-01-15',
      totalSessions: 15,
      completedSessions: 12,
      lastVisit: '2025-01-10',
      nextAppointment: '2025-01-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      phone: '+91-9876543211',
      email: 'jane.smith@email.com',
      address: '456 Oak Ave, Delhi, Delhi',
      medicalHistory: 'Anxiety, Insomnia',
      constitution: 'Pitta',
      allergies: 'None',
      currentMedications: 'None',
      emergencyContact: '+91-9876543212',
      joinDate: '2024-02-20',
      totalSessions: 8,
      completedSessions: 6,
      lastVisit: '2025-01-12',
      nextAppointment: '2025-01-18'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      age: 55,
      phone: '+91-9876543212',
      email: 'robert.johnson@email.com',
      address: '789 Pine St, Bangalore, Karnataka',
      medicalHistory: 'Arthritis, High Cholesterol',
      constitution: 'Kapha',
      allergies: 'Dairy',
      currentMedications: 'Atorvastatin',
      emergencyContact: '+91-9876543213',
      joinDate: '2024-03-10',
      totalSessions: 21,
      completedSessions: 18,
      lastVisit: '2025-01-08',
      nextAppointment: '2025-01-22'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsData, feedbackData] = await Promise.all([
        api.getBookings(),
        api.getFeedback()
      ]);
      setBookings(bookingsData);
      setFeedback(feedbackData);
      setPatients(mockPatients);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: patients.length + 1,
      ...formData,
      age: parseInt(formData.age),
      joinDate: new Date().toISOString().split('T')[0],
      totalSessions: 0,
      completedSessions: 0,
      lastVisit: '',
      nextAppointment: ''
    };
    
    setPatients([...patients, newPatient]);
    setShowAddForm(false);
    setFormData({
      name: '',
      age: '',
      phone: '',
      email: '',
      address: '',
      medicalHistory: '',
      constitution: 'Mixed',
      allergies: '',
      currentMedications: '',
      emergencyContact: ''
    });
  };

  const getPatientBookings = (patientName: string) => {
    return bookings.filter(b => b.patientName === patientName);
  };

  const getPatientFeedback = (patientName: string) => {
    return feedback.filter(f => f.patientName === patientName);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConstitutionColor = (constitution: string) => {
    switch (constitution) {
      case 'Vata': return 'bg-blue-100 text-blue-800';
      case 'Pitta': return 'bg-red-100 text-red-800';
      case 'Kapha': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive patient records and treatment history</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Cards */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Patients ({filteredPatients.length})</h2>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPatient?.id === patient.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConstitutionColor(patient.constitution)}`}>
                      {patient.constitution}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Sessions: {patient.completedSessions}/{patient.totalSessions}
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${patient.totalSessions > 0 ? (patient.completedSessions / patient.totalSessions) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">Patient ID: #{selectedPatient.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5" />
                      <span>{selectedPatient.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Medical Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Constitution:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getConstitutionColor(selectedPatient.constitution)}`}>
                        {selectedPatient.constitution}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Medical History:</span>
                      <p className="mt-1">{selectedPatient.medicalHistory}</p>
                    </div>
                    <div>
                      <span className="font-medium">Allergies:</span>
                      <p className="mt-1">{selectedPatient.allergies || 'None'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Current Medications:</span>
                      <p className="mt-1">{selectedPatient.currentMedications || 'None'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Treatment Progress</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sessions Completed</span>
                      <span className="font-medium">{selectedPatient.completedSessions}/{selectedPatient.totalSessions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full"
                        style={{ width: `${selectedPatient.totalSessions > 0 ? (selectedPatient.completedSessions / selectedPatient.totalSessions) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Last Visit:</span>
                        <p className="font-medium">{selectedPatient.lastVisit || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Appointment:</span>
                        <p className="font-medium">{selectedPatient.nextAppointment || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Sessions</h4>
                  <div className="space-y-2">
                    {getPatientBookings(selectedPatient.name).slice(0, 3).map((booking) => (
                      <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{booking.therapy?.name}</span>
                          <span className="text-xs text-gray-500">{booking.date}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {booking.practitioner?.name} • {booking.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Feedback */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Feedback</h4>
                  <div className="space-y-2">
                    {getPatientFeedback(selectedPatient.name).slice(0, 2).map((fb) => (
                      <div key={fb.id} className="bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Heart
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= fb.rating ? 'text-red-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{fb.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{fb.improvements}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a patient to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Constitution (Prakriti)</label>
                <select
                  value={formData.constitution}
                  onChange={(e) => setFormData({ ...formData, constitution: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Previous conditions, surgeries, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Food, drug allergies"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  <input
                    type="text"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Current medications"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}