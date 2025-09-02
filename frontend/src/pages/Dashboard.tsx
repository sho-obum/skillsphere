import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Skill, Booking } from '../types';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load bookings for all users
      const bookingsData = await apiService.getMyBookings();
      setBookings(bookingsData);
      
      // Load skills if user is a provider
      if (user?.role === 'provider' || user?.role === 'admin') {
        const skillsResponse = await apiService.getSkills(100, 0); // Get more skills for providers
        // Filter to show only user's skills for providers (admin sees all)
        const userSkills = user.role === 'admin' 
          ? skillsResponse.data 
          : skillsResponse.data.filter(skill => skill.user_id === user.id);
        setSkills(userSkills);
      }
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.start_time) > new Date() && 
    (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
  );

  const recentBookings = bookings
    .filter(booking => booking.status === 'COMPLETED')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const pendingBookings = bookings.filter(booking => 
    booking.status === 'PENDING' && user?.id === booking.provider_id
  );

  const totalEarnings = bookings
    .filter(booking => booking.status === 'COMPLETED' && user?.id === booking.provider_id)
    .reduce((sum, booking) => sum + booking.price_snapshot, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-400">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          {user?.role === 'provider' && "Manage your skills and bookings"}
          {user?.role === 'customer' && "Discover new skills and manage your bookings"}
          {user?.role === 'admin' && "Platform overview and management"}
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
          onClose={() => setError('')}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(user?.role === 'provider' || user?.role === 'admin') && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Skills</p>
                    <p className="text-2xl font-bold text-white">{skills.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">${totalEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-white">{upcomingBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Bookings (for providers) */}
        {pendingBookings.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-yellow-600" />
                  Pending Bookings
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/bookings')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Booking #{booking.id}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(booking.start_time), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/bookings')}>
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Upcoming Sessions
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/bookings')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Booking #{booking.id}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(booking.start_time), 'MMM d, h:mm a')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.duration_mins} minutes • ${booking.price_snapshot}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Skills (for providers) */}
        {(user?.role === 'provider' || user?.role === 'admin') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-green-600" />
                  My Skills
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/skills')}
                  >
                    View All
                  </Button>
                  {user?.role === 'provider' && (
                    <Button
                      size="sm"
                      onClick={() => navigate('/skills/create')}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">No skills created yet</p>
                  {user?.role === 'provider' && (
                    <Button
                      size="sm"
                      onClick={() => navigate('/skills/create')}
                      className="mt-3"
                    >
                      Create Your First Skill
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {skills.slice(0, 3).map((skill) => (
                    <div 
                      key={skill.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`/skills/${skill.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{skill.title}</p>
                        <p className="text-xs text-gray-600 truncate">{skill.description}</p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-medium text-sm text-green-600">${skill.price}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(skill.created_at), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {recentBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Session Completed</p>
                      <p className="text-xs text-gray-600">
                        Booking #{booking.id} • {format(new Date(booking.start_time), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-green-600">+${booking.price_snapshot}</p>
                      <p className="text-xs text-gray-500">{booking.duration_mins}min</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/skills')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Skills
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/bookings')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
              
              {user?.role === 'provider' && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/skills/create')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Skill
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
