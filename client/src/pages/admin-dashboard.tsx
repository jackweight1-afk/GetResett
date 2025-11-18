import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Users, Activity, TrendingUp, DollarSign, Calendar, Mail, Phone, ArrowLeft, RefreshCw, Shield, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/getreset_logo.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface GlobalAnalytics {
  totalResets: number;
  totalOrganizations: number;
  totalEmployees: number;
  monthlyRevenue: number;
  popularResets: Array<{ name: string; count: number }>;
}

interface Organization {
  id: string;
  name: string;
  tier: string;
  corporateCode: string;
  employeeCount: number;
  pricePerSeat: number;
  billingStatus: string;
  createdAt: string;
}

interface BusinessLead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  employeeSize: string;
  interestedTier: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean | null;
  hasCompletedOnboarding: boolean | null;
  organisationId: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const { toast } = useToast();

  // Check if user is super admin first
  const { data: adminStatus, isLoading: adminLoading } = useQuery<{ isSuperAdmin: boolean }>({
    queryKey: ['/api/user/is-super-admin'],
  });

  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery<GlobalAnalytics>({
    queryKey: ['/api/admin/analytics'],
    enabled: adminStatus?.isSuperAdmin === true,
  });

  const { data: organizations, isLoading: orgsLoading, refetch: refetchOrgs } = useQuery<Organization[]>({
    queryKey: ['/api/admin/organizations'],
    enabled: adminStatus?.isSuperAdmin === true,
  });

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery<BusinessLead[]>({
    queryKey: ['/api/admin/leads'],
    enabled: adminStatus?.isSuperAdmin === true,
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: adminStatus?.isSuperAdmin === true,
  });

  const { data: orgAnalytics } = useQuery<any>({
    queryKey: ['/api/admin/organizations', selectedOrg, 'analytics'],
    enabled: !!selectedOrg && adminStatus?.isSuperAdmin === true,
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await apiRequest('POST', '/admin/users', userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "New user account has been created successfully",
      });
      setNewUser({ email: '', password: '', firstName: '', lastName: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/admin/users/${userId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "User status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    refetchAnalytics();
    refetchOrgs();
    refetchLeads();
    refetchUsers();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(newUser);
  };

  // Redirect if not super admin
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!adminStatus?.isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button
            onClick={() => window.location.href = '/resets'}
            className="bg-gradient-to-r from-purple-600 to-teal-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>
      </div>
    );
  }

  if (analyticsLoading || orgsLoading || leadsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'core': return 'bg-blue-100 text-blue-700';
      case 'growth': return 'bg-purple-100 text-purple-700';
      case 'culture_partner': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'qualified': return 'bg-purple-100 text-purple-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-10 h-10 rounded-xl shadow-md object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-xs text-gray-500">GetReset Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-xs"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/resets'}
              className="text-xs"
              data-testid="button-back-to-app"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Resets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{analytics?.totalResets || 0}</span>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{analytics?.totalOrganizations || 0}</span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{analytics?.totalEmployees || 0}</span>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">£{analytics?.monthlyRevenue?.toFixed(2) || '0.00'}</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{leads?.filter(l => l.status === 'new').length || 0}</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="organizations" data-testid="tab-organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Business Leads</TabsTrigger>
            <TabsTrigger value="insights" data-testid="tab-insights">Platform Insights</TabsTrigger>
          </TabsList>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizations?.map((org) => (
                    <div
                      key={org.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{org.name}</h3>
                          <p className="text-xs text-gray-500">Code: {org.corporateCode}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTierColor(org.tier)}`}>
                          {org.tier.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500">Employees</p>
                          <p className="font-semibold text-gray-900">{org.employeeCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price/Seat</p>
                          <p className="font-semibold text-gray-900">£{org.pricePerSeat}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">MRR</p>
                          <p className="font-semibold text-gray-900">£{(org.employeeCount * org.pricePerSeat).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className={`font-semibold ${org.billingStatus === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                            {org.billingStatus}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrg(org.id)}
                          className="text-xs"
                          data-testid={`button-view-org-${org.id}`}
                        >
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!organizations || organizations.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No organizations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Create User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-xs">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@company.com"
                        className="text-sm h-10"
                        data-testid="input-user-email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="••••••••"
                        className="text-sm h-10"
                        data-testid="input-user-password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName" className="text-xs">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        placeholder="John"
                        className="text-sm h-10"
                        data-testid="input-user-firstname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        placeholder="Doe"
                        className="text-sm h-10"
                        data-testid="input-user-lastname"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-teal-600 text-white"
                    data-testid="button-create-user"
                  >
                    {createUserMutation.isPending ? 'Creating...' : 'Create User Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* All Users List */}
            <Card>
              <CardHeader>
                <CardTitle>All Users ({users?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users?.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.email || 'Unknown User'}
                          </h3>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-3">
                        <div>
                          <p className="text-gray-500">Onboarded</p>
                          <p className="font-semibold text-gray-900">
                            {user.hasCompletedOnboarding ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Organization</p>
                          <p className="font-semibold text-gray-900">
                            {user.organisationId ? 'Linked' : 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserStatusMutation.mutate({ userId: user.id, isActive: false })}
                            disabled={updateUserStatusMutation.isPending}
                            className="text-xs text-red-600 hover:text-red-700"
                            data-testid={`button-deactivate-user-${user.id}`}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserStatusMutation.mutate({ userId: user.id, isActive: true })}
                            disabled={updateUserStatusMutation.isPending}
                            className="text-xs text-green-600 hover:text-green-700"
                            data-testid={`button-activate-user-${user.id}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {!users || users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads?.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{lead.companyName}</h3>
                          <p className="text-sm text-gray-600">{lead.contactName}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{lead.contactEmail}</span>
                        </div>
                        {lead.contactPhone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{lead.contactPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{lead.employeeSize} employees</span>
                        </div>
                        {lead.interestedTier && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>Interested in: {lead.interestedTier.replace('_', ' ')}</span>
                          </div>
                        )}
                        {lead.message && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{lead.message}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!leads || leads.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No leads yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Resets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.popularResets?.map((reset, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                      <span className="font-medium text-gray-900">{reset.name}</span>
                      <span className="text-sm font-semibold text-purple-600">{reset.count} sessions</span>
                    </div>
                  ))}
                  {!analytics?.popularResets || analytics.popularResets.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No reset data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
