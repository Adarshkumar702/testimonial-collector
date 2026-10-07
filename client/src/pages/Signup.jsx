import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup({ name, email, password });
      addToast('Registration successful! Please verify your email.', 'success');
      setVerificationResult(response.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
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
          <h2 className="text-xl font-bold text-slate-900">Create your owner account</h2>
          <p className="text-sm text-slate-500">Start collecting customer testimonials in minutes</p>
        </div>

        {verificationResult ? (
          <Card className="shadow-lg border-emerald-200 bg-emerald-50/50">
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Email Verification Simulation</h3>
              <p className="text-sm text-slate-600">
                An email verification token has been generated for <strong>{email}</strong>.
              </p>
              <div className="p-3 bg-white rounded-lg border text-left text-xs font-mono break-all space-y-1">
                <div className="text-slate-500 font-sans font-semibold">Simulated Link:</div>
                <Link
                  to={verificationResult.simulationVerificationUrl}
                  className="text-brand-600 underline font-mono hover:text-brand-700"
                >
                  {window.location.origin}{verificationResult.simulationVerificationUrl}
                </Link>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => navigate(verificationResult.simulationVerificationUrl)}
              >
                Simulate Email Click & Verify Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <Input
                  label="Full Name"
                  type="text"
                  icon={User}
                  placeholder="Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Business Email"
                  type="email"
                  icon={Mail}
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  helperText="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                  Create Account
                </Button>
                <div className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
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
