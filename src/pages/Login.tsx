
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, user, userProfile } = useAuth();
  const navigate = useNavigate();

  // Quick test credentials
  const quickTestAccounts = [
    { label: 'Super Admin', email: 'info@applaudliving.com', password: 'admin123' },
    { label: 'Operator', email: 'operator@meridian.com', password: 'operator123' },
    { label: 'Resident', email: 'resident@gmail.com', password: 'resident123' }
  ];

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // Don't set isSubmitting to false here - let the auth state change handle navigation
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || "Failed to sign in with Google");
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, {
          first_name: 'New',
          last_name: 'User'
        });
      } else {
        await signInWithEmail(email, password);
      }
      // Don't set isSubmitting to false here - let the auth state change handle navigation
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || "Authentication failed");
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (testAccount: typeof quickTestAccounts[0]) => {
    setError('');
    setIsSubmitting(true);
    console.log('Attempting quick login with:', testAccount.email);
    
    try {
      await signInWithEmail(testAccount.email, testAccount.password);
      // Don't set isSubmitting to false here - let the auth state change handle navigation
    } catch (error: any) {
      console.log('Login failed, creating account:', error.message);
      try {
        await signUpWithEmail(testAccount.email, testAccount.password, {
          first_name: testAccount.label.split(' ')[0],
          last_name: testAccount.label.split(' ')[1] || 'User'
        });
        // Don't set isSubmitting to false here - let the auth state change handle navigation
      } catch (signUpError: any) {
        console.error('Account creation failed:', signUpError);
        setError(signUpError.message || "Failed to create test account");
        setIsSubmitting(false);
      }
    }
  };

  // Handle role-based routing after successful login
  useEffect(() => {
    // Only redirect if we have both user and userProfile, and we're not currently loading
    if (user && userProfile && !loading && !isSubmitting) {
      console.log('✅ User logged in with role:', userProfile.role);
      
      // Route based on user role
      switch (userProfile.role) {
        case 'super_admin':
          console.log('Redirecting to /super-admin');
          navigate('/super-admin', { replace: true });
          break;
        case 'operator':
        case 'senior_operator':
          console.log('Redirecting to /operator');
          navigate('/operator', { replace: true });
          break;
        case 'maintenance':
          console.log('Redirecting to /maintenance');
          navigate('/maintenance', { replace: true });
          break;
        case 'leasing':
          console.log('Redirecting to /operator');
          navigate('/operator', { replace: true });
          break;
        case 'vendor':
          console.log('Redirecting to /maintenance');
          navigate('/maintenance', { replace: true });
          break;
        case 'resident':
          console.log('Redirecting to /');
          navigate('/', { replace: true });
          break;
        case 'prospect':
          console.log('Redirecting to /discovery');
          navigate('/discovery', { replace: true });
          break;
        default:
          console.log('Redirecting to / (default)');
          navigate('/', { replace: true });
          break;
      }
    }
  }, [user, userProfile, loading, navigate, isSubmitting]);

  // Show loading only during auth initialization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in and we have their profile, show redirect message
  if (user && userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp ? 'Create Account' : 'Welcome to Applaud'}
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              {isSignUp ? 'Sign up for a new account' : 'Residential Living. Never Made Easier.'}
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isSubmitting ? 'Please wait...' : 'Continue with Google'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline text-sm"
                  disabled={isSubmitting}
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Test Login */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Quick Test Login</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Click to instantly login with test accounts
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickTestAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                className="w-full"
                onClick={() => handleQuickLogin(account)}
                disabled={isSubmitting}
              >
                Login as {account.label}
              </Button>
            ))}
            <p className="text-xs text-gray-500 text-center mt-4">
              These will create accounts if they don't exist
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
