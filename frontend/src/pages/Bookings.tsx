import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Booking } from '../types';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { Calendar, Clock, DollarSign, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Pass the user's role to get the correct bookings
      const role = user?.role === 'provider' ? 'provider' : 'customer';
      console.log('Loading bookings for role:', role, 'User ID:', user?.id);
      const bookingsData = await apiService.getMyBookings(role);
      console.log('Bookings loaded:', bookingsData);
      setBookings(bookingsData);
    } catch (err: any) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: number, action: 'confirm' | 'cancel' | 'complete') => {
    setActionLoading(bookingId);
    try {
      switch (action) {
        case 'confirm':
          await apiService.confirmBooking(bookingId);
          break;
        case 'cancel':
          await apiService.cancelBooking(bookingId);
          break;
        case 'complete':
          await apiService.completeBooking(bookingId);
          break;
      }
      await loadBookings(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
    }
  };

  const canConfirm = (booking: Booking) => {
    return user?.id === booking.provider_id && booking.status === 'PENDING';
  };

  const canCancel = (booking: Booking) => {
    return (user?.id === booking.customer_id || user?.id === booking.provider_id || user?.role === 'admin') && 
           (booking.status === 'PENDING' || booking.status === 'CONFIRMED');
  };

  const canComplete = (booking: Booking) => {
    return user?.id === booking.provider_id && booking.status === 'CONFIRMED';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <p className="mt-2 text-gray-300">
          Manage your skill bookings and sessions
        </p>
        {/* Debug info */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm border border-gray-700/50">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
          onClose={() => setError('')}
        />
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-white">No bookings yet</h3>
          <p className="mt-1 text-sm text-gray-300">
            Start by booking a skill or creating one to offer.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Booking #{booking.id}
                  </CardTitle>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-white">Date:</span>
                      <span className="ml-2 text-gray-300">
                        {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-white">Time:</span>
                      <span className="ml-2 text-gray-300">
                        {format(new Date(booking.start_time), 'h:mm a')} - {' '}
                        {format(addMinutes(new Date(booking.start_time), booking.duration_mins), 'h:mm a')}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-white">Duration:</span>
                      <span className="ml-2 text-gray-300">{booking.duration_mins} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-white">Price:</span>
                      <span className="ml-2 text-gray-300">${booking.price_snapshot}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-white">
                        {user?.id === booking.customer_id ? 'Provider:' : 'Customer:'}
                      </span>
                      <span className="ml-2 text-gray-300">
                        {user?.id === booking.customer_id 
                          ? `Provider ID: ${booking.provider_id}` 
                          : `Customer ID: ${booking.customer_id}`}
                      </span>
                    </div>
                    
                    {booking.notes && (
                      <div className="flex items-start text-sm">
                        <MessageSquare className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                                                   <span className="font-medium text-white">Notes:</span>
                         <p className="mt-1 text-gray-300">{booking.notes}</p>
                        </div>
                      </div>
                    )}
                    
                                         <div className="flex items-center text-sm text-gray-400">
                       <span className="font-medium text-white">Booked:</span>
                       <span className="ml-2 text-gray-300">
                         {format(new Date(booking.created_at), 'MMM d, yyyy')}
                       </span>
                     </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {canConfirm(booking) && (
                    <Button
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'confirm')}
                      loading={actionLoading === booking.id}
                    >
                      Confirm Booking
                    </Button>
                  )}
                  
                  {canComplete(booking) && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleBookingAction(booking.id, 'complete')}
                      loading={actionLoading === booking.id}
                    >
                      Mark Complete
                    </Button>
                  )}
                  
                  {canCancel(booking) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBookingAction(booking.id, 'cancel')}
                      loading={actionLoading === booking.id}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
