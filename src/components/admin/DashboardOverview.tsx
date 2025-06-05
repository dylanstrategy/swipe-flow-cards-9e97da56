
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats, Company } from '@/types/admin';
import { Building2, Users, Home, TrendingUp, Activity } from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCompanies: 0,
    totalProperties: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentSignups: 0
  });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [companiesResult, propertiesResult, usersResult, recentUsersResult] = await Promise.all([
        supabase.from('companies').select('id'),
        supabase.from('properties').select('id'),
        supabase.from('user_profiles').select('id, status'),
        supabase.from('user_profiles').select('id').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Load recent companies
      const { data: recentCompaniesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalCompanies: companiesResult.data?.length || 0,
        totalProperties: propertiesResult.data?.length || 0,
        totalUsers: usersResult.data?.length || 0,
        activeUsers: usersResult.data?.filter(u => u.status === 'active').length || 0,
        recentSignups: recentUsersResult.data?.length || 0
      });

      setRecentCompanies(recentCompaniesData?.map(company => ({
        ...company,
        created_at: new Date(company.created_at),
        updated_at: new Date(company.updated_at)
      })) || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gold-100 text-gold-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                <p className="text-sm text-gray-600">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
                <p className="text-sm text-gray-600">Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{stats.recentSignups}</p>
                <p className="text-sm text-gray-600">New This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.contact_email}</p>
                  <p className="text-xs text-gray-500">
                    Created: {company.created_at.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPlanColor(company.plan_type)}>
                    {company.plan_type}
                  </Badge>
                  <Badge className={getStatusColor(company.status)}>
                    {company.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentCompanies.length === 0 && (
              <p className="text-center text-gray-500 py-8">No companies yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
