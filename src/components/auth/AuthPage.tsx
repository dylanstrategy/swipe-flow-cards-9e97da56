
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('prospect');
  const [property, setProperty] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Quick test accounts
  const testAccounts = [
    { email: 'test.prospect@meridian.com', password: 'prospect123', role: 'prospect', firstName: 'Test', lastName: 'Prospect' },
    { email: 'test.operator@meridian.com', password: 'operator123', role: 'operator', firstName: 'Test', lastName: 'Operator' },
    { email: 'admin@applaud.com', password: 'admin123', role: 'super_admin', firstName: 'Super', lastName: 'Admin' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSignupError('');

    try {
      console.log('Starting registration/login process:', { email, role, isSignUp });
      
      if (isSignUp) {
        console.log('Attempting sign up with data:', { firstName, lastName, email, phone, role, property });
        
        const result = await signUp(email, password, { firstName, lastName, phone, role, property });
        
        console.log('Signup result:', result);
        
        if (result.needsConfirmation) {
          console.log('Email confirmation needed');
          setEmailSent(true);
          toast({
            title: "Check your email!",
            description: `We've sent a confirmation link to ${email}. Click it to complete your registration.`,
          });
        } else {
          console.log('User was automatically signed in');
          toast({
            title: "Account created!",
            description: "You have been automatically signed in.",
          });
        }
      } else {
        console.log('Attempting sign in');
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = error.message || "Something went wrong";
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Please try signing in instead.";
        setIsSignUp(false); // Switch to sign in mode
      }
      
      setSignupError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleTestLogin(testAccount: typeof testAccounts[0]) {
    setLoading(true);
    setSignupError('');
    
    try {
      console.log('Attempting test login:', testAccount.email);
      await signIn(testAccount.email, testAccount.password);
      toast({
        title: "Test login successful!",
        description: `Logged in as ${testAccount.role}`,
      });
    } catch (error: any) {
      console.log('Test login failed, creating account:', error.message);
      // If login fails, try to create the test account
      try {
        console.log('Creating test account:', testAccount);
        const result = await signUp(testAccount.email, testAccount.password, {
          firstName: testAccount.firstName,
          lastName: testAccount.lastName,
          phone: '(555) 123-4567',
          role: testAccount.role,
          property: testAccount.role === 'super_admin' ? 'Applaud HQ' : 'The Meridian',
        });
        
        if (result.needsConfirmation) {
          toast({
            title: "Test account created!",
            description: "Check your email to confirm the account, then try logging in again.",
          });
        } else {
          toast({
            title: "Test account created and logged in!",
            description: `Created and logged in as ${testAccount.role}`,
          });
        }
      } catch (signUpError: any) {
        console.error('Test account creation failed:', signUpError);
        toast({
          title: "Error",
          description: signUpError.message || "Failed to create test account",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertDescription>
                We've sent a confirmation link to <strong>{email}</strong>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-500">
              Click the link in your email to complete your registration, then come back here to sign in.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setEmailSent(false);
                  setIsSignUp(false);
                }}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
              <Button 
                onClick={() => {
                  setEmailSent(false);
                  // Keep the same form data for retry
                }}
                variant="ghost"
                className="w-full text-sm"
              >
                Didn't receive email? Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            {isSignUp && (
              <Alert>
                <AlertDescription>
                  You'll receive an email to confirm your account after registration.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            {signupError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(role === 'operator' || role === 'super_admin') && (
                    <div>
                      <Label htmlFor="property">Property/Company</Label>
                      <Input
                        id="property"
                        value={property}
                        onChange={(e) => setProperty(e.target.value)}
                        placeholder={role === 'super_admin' ? 'e.g., Applaud HQ' : 'e.g., The Meridian'}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setSignupError('');
                }}
                className="text-blue-600 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Test Account Quick Login */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-sm">Quick Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {testAccounts.map((account) => (
              <Button
                key={account.role}
                variant="outline"
                className="w-full"
                onClick={() => handleTestLogin(account)}
                disabled={loading}
              >
                Login as {account.role === 'super_admin' ? 'Super Admin' : account.role}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
