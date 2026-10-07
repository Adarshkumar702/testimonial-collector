import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const executedTokenRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid verification link. Missing token.');
      return;
    }

    // Prevent duplicate verification requests for the same token (e.g. StrictMode or re-renders)
    if (executedTokenRef.current === token) {
      return;
    }
    executedTokenRef.current = token;

    const doVerify = async () => {
      try {
        await authService.verifyEmail({ token, email });
        setStatus('success');
        addToast('Email verified successfully! You can now log in.', 'success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Email verification failed or token expired.');
      }
    };

    doVerify();
  }, [token, email, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-slate-200">
          <CardContent className="space-y-4 pt-6 text-center">
            {status === 'verifying' && (
              <div className="py-8 space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Verifying your email...</h3>
                <p className="text-sm text-slate-500">Please wait while we confirm your account status.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email Verified!</h3>
                <p className="text-sm text-slate-600">Your account is fully verified. You can now sign in to your owner dashboard.</p>
                <Button className="w-full mt-2" onClick={() => navigate('/login')} size="lg">
                  Proceed to Sign In
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Verification Failed</h3>
                <p className="text-sm text-rose-600">{errorMessage}</p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/signup')}>
                    Back to Signup
                  </Button>
                  <Button className="w-full" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
