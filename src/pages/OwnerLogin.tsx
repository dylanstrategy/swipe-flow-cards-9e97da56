
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerLogin = () => {
  const [email, setEmail] = useState('owner@applaud.com');
  const [password, setPassword] = useState('owner2024!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting owner login:', email);
      await signIn(email, password);
      toast({
        title: "Welcome back, Owner!",
        description: "You are now logged in as Super Admin",
      });
    } catch (error: any) {
      console.log('Owner login failed, creating owner account:', error.message);
      // If login fails, try to create the owner account
      try {
        console.log('Creating owner account');
        const result = await signUp(email, password, {
          firstName: 'Owner',
          lastName: 'Admin',
          phone: '(555) 000-0001',
          role: 'super_admin',
          property: 'Applaud HQ',
        });
        
        if (result.needsConfirmation) {
          setError('Account created but needs email confirmation. Check your email and try again.');
        } else {
          toast({
            title: "Owner account created and logged in!",
            description: "Welcome to your Super Admin dashboard!",
          });
        }
      } catch (signUpError: any) {
        console.error('Owner account creation failed:', signUpError);
        setError(signUpError.message || "Failed to create or login to owner account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setEmail('owner@applaud.com');
    setPassword('owner2024!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-red-200 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-red-600" />
              <CardTitle className="text-2xl text-red-800">Owner Access</CardTitle>
            </div>
            <p className="text-gray-600">Direct access for the app owner</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleOwnerLogin} className="space-y-4">
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

              <Button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Owner'}
              </Button>
            </form>

            <div className="space-y-3">
              <Button 
                onClick={handleQuickLogin}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Use Default Owner Credentials
              </Button>
              
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Main App
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerLogin;
