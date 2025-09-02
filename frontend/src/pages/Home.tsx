import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { BookOpen, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Learn New Skills',
      description: 'Discover amazing skills from talented providers in various fields.',
    },
    {
      icon: Users,
      title: 'Share Your Expertise',
      description: 'Become a provider and teach others what you know best.',
    },
    {
      icon: Star,
      title: 'Quality Sessions',
      description: 'Book personalized one-on-one sessions tailored to your needs.',
    },
  ];

  const benefits = [
    'Personalized learning experience',
    'Flexible scheduling',
    'Direct communication with experts',
    'Affordable pricing',
    'Secure booking system',
    'Progress tracking',
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="bg-gradient-purple bg-clip-text text-transparent">SkillSphere</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Connect with experts, learn new skills, and share your knowledge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/skills')}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Browse Skills
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/skills')}
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Browse Skills
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How SkillSphere Works
            </h2>
            <p className="text-xl text-gray-300">
              Simple, secure, and effective way to learn and teach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-transform">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-purple text-white rounded-full mb-6 glow-purple-sm">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-purple-400 mb-6">
          Why Choose SkillSphere?
        </h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide a comprehensive platform that connects learners with experts, 
                making skill sharing accessible, affordable, and effective.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full mb-6">
                      <Users className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-4">
                      Join Our Community
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Connect with thousands of learners and experts from around the world.
                    </p>
                    {!isAuthenticated && (
                      <div className="space-y-3">
                        <Button
                          onClick={() => navigate('/signup')}
                          className="w-full"
                        >
                          Sign Up Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/login')}
                          className="w-full"
                        >
                          Already have an account?
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse our marketplace and find the perfect skill to learn today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/skills')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Explore Skills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
