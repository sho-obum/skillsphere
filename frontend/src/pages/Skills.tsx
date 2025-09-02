import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Skill } from '../types';
import Button from '../components/ui/Button';
import Card, { CardContent, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { Plus, Search, DollarSign, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadSkills = async (reset: boolean = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const response = await apiService.getSkills(limit, currentOffset);
      
      if (reset) {
        setSkills(response.data);
        setOffset(limit);
      } else {
        setSkills(prev => [...prev, ...response.data]);
        setOffset(prev => prev + limit);
      }
      
      setHasMore(response.has_more);
    } catch (err: any) {
      setError('Failed to load skills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills(true);
  }, []);

  const filteredSkills = skills.filter(skill =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkillClick = (skillId: number) => {
    navigate(`/skills/${skillId}`);
  };

  const handleCreateSkill = () => {
    navigate('/skills/create');
  };

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Skills Marketplace</h1>
            <p className="mt-2 text-gray-300">
              Discover and book amazing skills from talented providers
            </p>
          </div>
          {isAuthenticated && user?.role === 'provider' && (
            <div className="mt-4 sm:mt-0">
              <Button onClick={handleCreateSkill}>
                <Plus className="mr-2 h-4 w-4" />
                Create Skill
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search skills, descriptions, or providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
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

      {filteredSkills.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-white">No skills found</h3>
          <p className="mt-1 text-sm text-gray-300">
            {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to create a skill!'}
          </p>
          {isAuthenticated && user?.role === 'provider' && !searchTerm && (
            <div className="mt-6">
              <Button onClick={handleCreateSkill}>
                <Plus className="mr-2 h-4 w-4" />
                Create Skill
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card
                key={skill.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleSkillClick(skill.id)}
              >
                <CardContent>
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {skill.title}
                    </CardTitle>
                    <div className="flex items-center text-green-600 font-semibold ml-2">
                      <DollarSign className="h-4 w-4" />
                      {skill.price}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {skill.owner_name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(skill.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => loadSkills(false)}
                loading={loading}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Skills;
