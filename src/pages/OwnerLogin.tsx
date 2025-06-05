
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      // Redirect will be handled by the auth context
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || "Failed to sign in with Google");
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmail(email, password);
      // Redirect will be handled by the auth context
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Invalid credentials");
    }
  };

  const createSuperAdminAccount = async () => {
    try {
      // This creates the super admin account directly
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_super_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          admin_email: 'admin@applaud.com',
          admin_password: 'ApplaudAdmin2024!'
        })
      });

      if (response.ok) {
        toast({
          title: "Super Admin Account Created!",
          description: "Use admin@applaud.com / ApplaudAdmin2024! to sign in.",
        });
      } else {
        throw new Error('Failed to create admin account');
      }
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      toast({
        title: "Info",
        description: "Super admin account may already exist. Try signing in with admin@applaud.com",
        variant: "default",
      });
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
            
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? 'Signing in...' : 'Sign In with Google'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
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
            </div>

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
                onClick={() => navigate('/login')}
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
