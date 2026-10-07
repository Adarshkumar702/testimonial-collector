import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      addToast('Welcome back! Login successful.', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900 tracking-tight">
            <div className="p-2 bg-brand-600 text-white rounded-xl shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <span>SocialProof</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500">Manage your spaces, moderate reviews & embed widgets</p>
        </div>

        <Card className="shadow-lg border-slate-200">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end pt-1">
                  <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Sign In
              </Button>
              <div className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
