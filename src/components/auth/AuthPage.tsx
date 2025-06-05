
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('resident');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Quick test accounts
  const testAccounts = [
    { email: 'test.resident@meridian.com', password: 'resident123', role: 'resident', name: 'Test Resident' },
    { email: 'test.operator@meridian.com', password: 'operator123', role: 'operator', name: 'Test Operator' },
    { email: 'test.maintenance@meridian.com', password: 'maintenance123', role: 'maintenance', name: 'Test Maintenance' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting registration/login process:', { email, role, isSignUp });
      
      if (isSignUp) {
        console.log('Attempting sign up with data:', { name, email, phone, role });
        await signUp(email, password, { name, phone, role });
        toast({
          title: "Account created!",
          description: "You have been automatically signed in.",
        });
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
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (testAccount: typeof testAccounts[0]) => {
    setLoading(true);
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
        await signUp(testAccount.email, testAccount.password, {
          name: testAccount.name,
          phone: '(555) 123-4567',
          role: testAccount.role,
        });
        await signIn(testAccount.email, testAccount.password);
        toast({
          title: "Test account created and logged in!",
          description: `Created and logged in as ${testAccount.role}`,
        });
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                />
              </div>

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
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
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
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
                Login as {account.role}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
