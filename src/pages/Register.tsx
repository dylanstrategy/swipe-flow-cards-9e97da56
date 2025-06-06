
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import type { AppRole } from '@/types/supabase';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'resident' as AppRole,
    propertyId: ''
  });
  
  const [propertyName, setPropertyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is already logged in, redirect based on role
        const email = session.user.email;
        if (email === 'info@applaudliving.com') {
          navigate('/super-admin');
        } else {
          // Fetch role from database
          const { data: userProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (userProfile?.role) {
            switch (userProfile.role) {
              case 'super_admin':
                navigate('/super-admin');
                break;
              case 'senior_operator':
              case 'operator':
              case 'leasing':
                navigate('/operator');
                break;
              case 'maintenance':
              case 'vendor':
                navigate('/maintenance');
                break;
              case 'resident':
              case 'former_resident':
                navigate('/resident');
                break;
              default:
                navigate('/');
                break;
            }
          } else {
            navigate('/');
          }
        }
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Pre-fill form from URL parameters
    const email = searchParams.get('email') || '';
    const role = (searchParams.get('role') as AppRole) || 'resident';
    const propertyId = searchParams.get('property') || '';
    
    setFormData(prev => ({
      ...prev,
      email,
      role,
      propertyId
    }));

    // Fetch property name if propertyId is provided
    if (propertyId) {
      const fetchProperty = async () => {
        const { data } = await supabase
          .from('properties')
          .select('name')
          .eq('id', propertyId)
          .single();
        
        if (data) {
          setPropertyName(data.name);
        }
      };
      
      fetchProperty();
    }
  }, [searchParams]);

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('REGISTER: Assigned Role →', formData.role);
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert user into public.users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          });

        if (userError) throw userError;

        // Handle role-specific setup
        if (formData.role === 'resident' && formData.propertyId) {
          await supabase
            .from('residents')
            .insert({
              user_id: authData.user.id,
              property_id: formData.propertyId,
              status: 'active',
              onboarding_status: 'pending',
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email
            });
        }
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. Redirecting...",
      });

      // Redirect based on role after a short delay
      setTimeout(() => {
        if (formData.email === 'info@applaudliving.com') {
          navigate('/super-admin');
        } else {
          switch (formData.role) {
            case 'super_admin':
              navigate('/super-admin');
              break;
            case 'senior_operator':
            case 'operator':
            case 'leasing':
              navigate('/operator');
              break;
            case 'maintenance':
            case 'vendor':
              navigate('/maintenance');
              break;
            case 'resident':
            case 'former_resident':
              navigate('/resident');
              break;
            default:
              navigate('/');
              break;
          }
        }
      }, 1000);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <UserPlus className="w-6 h-6" />
            Create Your Account
          </CardTitle>
          {propertyName && (
            <p className="text-sm text-gray-600">
              You're registering for <strong>{propertyName}</strong>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly={!!searchParams.get('email')}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={searchParams.get('email') ? 'bg-gray-100' : ''}
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Assigned Role</Label>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {formatRole(formData.role)}
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
