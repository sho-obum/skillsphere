import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import ProtectedRoute from '../components/ProtectedRoute';

const CreateSkill: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative');
      return;
    }

    setLoading(true);

    try {
      const newSkill = await apiService.createSkill(formData);
      navigate(`/skills/${newSkill.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="provider">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <CardTitle>Create New Skill</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Share your expertise and help others learn something new
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                type="error"
                message={error}
                className="mb-4"
                onClose={() => setError('')}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Skill Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Python Programming for Beginners"
                helperText="Choose a clear, descriptive title for your skill"
              />

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe what you'll teach, what students will learn, and any prerequisites..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide details about what you'll cover, the learning outcomes, and any requirements
                </p>
              </div>

              <Input
                label="Price per Session ($)"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                helperText="Set your hourly rate or session price"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for a great skill listing:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about what you'll teach</li>
                  <li>• Mention your experience and qualifications</li>
                  <li>• Include what materials or tools are needed</li>
                  <li>• Set a fair price based on your expertise level</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/skills')}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create Skill
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default CreateSkill;
