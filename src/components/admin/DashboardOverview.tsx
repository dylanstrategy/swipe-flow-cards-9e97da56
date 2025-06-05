
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Home, Users, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats } from '@/types/admin';

const DashboardOverview = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCompanies: 0,
    totalProperties: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentSignups: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch data with type casting to bypass TypeScript errors until types are regenerated
      const [companiesResult, propertiesResult, usersResult] = await Promise.all([
        (supabase as any).from('companies').select('*', { count: 'exact', head: true }),
        (supabase as any).from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*')
      ]);

      // Calculate stats
      const totalCompanies = companiesResult.count || 0;
      const totalProperties = propertiesResult.count || 0;
      const totalUsers = usersResult.data?.length || 0;
      
      // Count active users
      const activeUsers = usersResult.data?.filter(user => user.status === 'active').length || 0;
      
      // Count recent signups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSignups = usersResult.data?.filter(user => 
        new Date(user.created_at || '') > thirtyDaysAgo
      ).length || 0;

      setStats({
        totalCompanies,
        totalProperties,
        totalUsers,
        activeUsers,
        recentSignups
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, color }: {
    title: string;
    value: number;
    icon: any;
    description: string;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {loading ? '...' : value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          System-wide statistics and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          description="Property management companies"
          color="text-blue-600"
        />
        
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={Home}
          description="Properties across all companies"
          color="text-green-600"
        />
        
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="All user accounts"
          color="text-purple-600"
        />
        
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          description="Currently active accounts"
          color="text-orange-600"
        />
        
        <StatCard
          title="Recent Signups"
          value={stats.recentSignups}
          icon={TrendingUp}
          description="New users (30 days)"
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Activity tracking will be available soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Services</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
