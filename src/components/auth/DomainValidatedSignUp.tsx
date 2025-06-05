
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { AppRole } from '@/types/supabase';

interface DomainValidatedSignUpProps {
  onSuccess?: () => void;
  allowedRoles?: AppRole[];
}

const DomainValidatedSignUp: React.FC<DomainValidatedSignUpProps> = ({ 
  onSuccess,
  allowedRoles = ['resident', 'prospect']
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'resident' as AppRole
  });
  const [error, setError] = useState('');
  const { signUpWithEmail, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: formData.role
      });

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || "Failed to create account");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="role">Account Type</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allowedRoles.includes('resident' as AppRole) && (
              <SelectItem value="resident">Resident</SelectItem>
            )}
            {allowedRoles.includes('prospect' as AppRole) && (
              <SelectItem value="prospect">Prospect</SelectItem>
            )}
            {allowedRoles.includes('operator' as AppRole) && (
              <SelectItem value="operator">Operator</SelectItem>
            )}
            {allowedRoles.includes('maintenance' as AppRole) && (
              <SelectItem value="maintenance">Maintenance</SelectItem>
            )}
            {allowedRoles.includes('leasing' as AppRole) && (
              <SelectItem value="leasing">Leasing</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={6}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default DomainValidatedSignUp;
