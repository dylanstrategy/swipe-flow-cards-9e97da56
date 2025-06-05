
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/admin';
import CreateCompanyForm from './CreateCompanyForm';
import { useToast } from '@/hooks/use-toast';

const CompaniesTab = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Type cast to any to bypass TypeScript errors until types are regenerated
      const { data, error } = await (supabase as any).from('companies').select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: "Error",
          description: "Failed to load companies",
          variant: "destructive",
        });
      } else {
        // Transform the data to match our Company type
        const transformedData = data?.map((company: any) => ({
          ...company,
          created_at: new Date(company.created_at),
          updated_at: new Date(company.updated_at)
        })) || [];
        setCompanies(transformedData);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Error",
        description: "Network error while loading companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (companyData: Partial<Company>) => {
    try {
      // Type cast to any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('companies')
        .insert([{
          name: companyData.name,
          domain: companyData.domain,
          contact_email: companyData.contact_email,
          contact_phone: companyData.contact_phone,
          address: companyData.address,
          plan_type: companyData.plan_type,
          status: companyData.status
        }])
        .select();

      if (error) {
        console.error('Error creating company:', error);
        toast({
          title: "Error",
          description: "Failed to create company",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Company created successfully",
        });
        setShowCreateForm(false);
        fetchCompanies(); // Refresh the list
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Error",
        description: "Network error while creating company",
        variant: "destructive",
      });
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreateForm) {
    return (
      <CreateCompanyForm
        onSubmit={handleCreateCompany}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Companies Management
              </CardTitle>
              <p className="text-sm text-gray-600">
                Manage all property management companies in the system
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading companies...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No companies match your search criteria.' : 'Get started by adding your first company.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {company.domain && (
                        <p className="text-sm text-blue-600">{company.domain}</p>
                      )}
                      {company.contact_email && (
                        <p className="text-sm text-gray-600">{company.contact_email}</p>
                      )}
                      {company.contact_phone && (
                        <p className="text-sm text-gray-600">{company.contact_phone}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                      <Badge className={getPlanColor(company.plan_type)}>
                        {company.plan_type}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500">
                      Created {company.created_at.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesTab;
