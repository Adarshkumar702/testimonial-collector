import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, Sparkles } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      addToast('Invalid or missing password reset token', 'error');
      return;
    }

    if (!newPassword || !confirmPassword) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, newPassword });
      addToast('Password reset successfully! Please sign in with your new password.', 'success');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Password reset failed or token expired.';
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
          <h2 className="text-xl font-bold text-slate-900">Reset your password</h2>
          <p className="text-sm text-slate-500">Choose a new secure password for your account</p>
        </div>

        <Card className="shadow-lg border-slate-200">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                helperText="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Update Password
              </Button>
              <div className="text-center text-sm text-slate-600">
                Back to{' '}
                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
