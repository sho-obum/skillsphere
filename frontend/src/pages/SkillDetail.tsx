import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Skill } from '../types';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { DollarSign, User, Calendar, Edit, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    start_time: '',
    duration_mins: 60,
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    price: 0,
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadSkill();
    }
  }, [id]);

  const loadSkill = async () => {
    try {
      setLoading(true);
      const skillData = await apiService.getSkillById(Number(id));
      setSkill(skillData);
      setEditData({
        title: skillData.title,
        description: skillData.description,
        price: skillData.price,
      });
    } catch (err: any) {
      setError('Failed to load skill details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !isAuthenticated) return;

    setBookingLoading(true);
    try {
      await apiService.createBooking({
        skill_id: skill.id,
        start_time: bookingData.start_time,
        duration_mins: bookingData.duration_mins,
        notes: bookingData.notes,
      });
      
      setShowBookingModal(false);
      navigate('/bookings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill) return;

    setEditLoading(true);
    try {
      const updatedSkill = await apiService.updateSkill(skill.id, editData);
      setSkill(updatedSkill);
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update skill');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skill) return;

    try {
      await apiService.deleteSkill(skill.id);
      navigate('/skills');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete skill');
    }
  };

  const canEdit = isAuthenticated && user && (user.id === skill?.user_id || user.role === 'admin');
  const canBook = isAuthenticated && user && user.id !== skill?.user_id;

  // Get minimum datetime for booking (current time + 1 hour)
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert type="error" message="Skill not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
          onClose={() => setError('')}
        />
      )}

      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/skills')}
          className="mb-4"
        >
          ← Back to Skills
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{skill.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {skill.owner_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(skill.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <div className="flex items-center text-2xl font-bold text-green-600">
                <DollarSign className="h-6 w-6" />
                {skill.price}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{skill.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {canBook && (
              <Button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 sm:flex-none"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Book This Skill
              </Button>
            )}
            
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book This Skill"
        size="md"
      >
        <form onSubmit={handleBooking} className="space-y-4">
          <Input
            label="Start Time"
            type="datetime-local"
            min={minDateTime}
            value={bookingData.start_time}
            onChange={(e) => setBookingData({ ...bookingData, start_time: e.target.value })}
            required
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            min="30"
            step="30"
            value={bookingData.duration_mins}
            onChange={(e) => setBookingData({ ...bookingData, duration_mins: Number(e.target.value) })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Any specific requirements or questions..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={bookingLoading}>
              Book Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Skill"
        size="md"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <Input
            label="Price ($)"
            type="number"
            min="0"
            step="0.01"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={editLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Skill"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this skill? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillDetail;
