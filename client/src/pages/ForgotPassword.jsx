import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Sparkles, KeyRound } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      addToast('Password reset link generated (Simulation Mode)', 'success');
      setResult(response.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to process request.';
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
          <h2 className="text-xl font-bold text-slate-900">Forgot your password?</h2>
          <p className="text-sm text-slate-500">Enter your email and we'll send reset instructions</p>
        </div>

        {result && result.simulationResetUrl ? (
          <Card className="shadow-lg border-brand-200 bg-brand-50/50">
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Password Reset Simulation</h3>
              <p className="text-sm text-slate-600">
                In a real email service, a reset link would be sent to <strong>{email}</strong>.
              </p>
              <div className="p-3 bg-white rounded-lg border text-left text-xs font-mono break-all space-y-1">
                <div className="text-slate-500 font-sans font-semibold">Simulated Reset Link:</div>
                <Link
                  to={result.simulationResetUrl}
                  className="text-brand-600 underline font-mono hover:text-brand-700"
                >
                  {window.location.origin}{result.simulationResetUrl}
                </Link>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => navigate(result.simulationResetUrl)}
              >
                Click to Reset Password Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <Input
                  label="Registered Email address"
                  type="email"
                  icon={Mail}
                  placeholder="owner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                  Send Reset Instructions
                </Button>
                <div className="text-center text-sm text-slate-600">
                  Remembered your password?{' '}
                  <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
