
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      
      // Check if user is super admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('email', email)
        .single();

      if (profile?.role === 'super_admin') {
        navigate('/super-admin');
        toast({
          title: "Welcome, Super Admin!",
          description: "You have successfully signed in to the admin dashboard.",
        });
      } else {
        setError('Access denied. Super admin privileges required.');
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const createSuperAdminAccount = async () => {
    setLoading(true);
    try {
      // Create super admin account
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@applaud.com',
        password: 'ApplaudAdmin2024!',
        options: {
          data: {
            first_name: 'Super',
            last_name: 'Admin',
            phone: '(555) 000-0000',
            role: 'super_admin',
            property: 'Applaud HQ'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Super Admin Account Created!",
        description: "Use admin@applaud.com / ApplaudAdmin2024! to sign in.",
      });
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create super admin account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Applaud Super Admin</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Access the global management dashboard
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
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
                  placeholder="admin@applaud.com"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In as Super Admin'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Need to create the super admin account?
                </p>
                <Button 
                  variant="outline" 
                  onClick={createSuperAdminAccount}
                  disabled={loading}
                  className="w-full"
                >
                  Create Super Admin Account
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Back to Regular Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerLogin;
