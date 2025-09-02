import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                                 <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-gray-800 text-gray-300">Demo Accounts</span>
                 </div>
              </div>

                             <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
                 <div className="p-2 bg-gray-800/50 rounded border border-gray-700 text-gray-300">
                   <strong className="text-white">Customer:</strong> customer@test.com / password123
                 </div>
                 <div className="p-2 bg-gray-800/50 rounded border border-gray-700 text-gray-300">
                   <strong className="text-white">Provider:</strong> provider@test.com / password123
                 </div>
                 <div className="p-2 bg-gray-800/50 rounded border border-gray-700 text-gray-300">
                   <strong className="text-white">Admin:</strong> admin@test.com / password123
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
