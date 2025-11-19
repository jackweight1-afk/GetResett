import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Activity, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/getreset_logo.jpg";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  tier: string;
  corporateCode: string;
  employeeCount: number;
  pricePerSeat: number;
  billingStatus: string;
  contactEmail: string | null;
  contactName: string | null;
}

interface Analytics {
  totalResets: number;
  activeEmployees: number;
  popularResets: Array<{ name: string; count: number }>;
  employeeEngagement: number;
}

export default function CompanyDashboard() {
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{ organization: Organization | null; analytics: Analytics }>({
    queryKey: ['/api/user/organization'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your organization...</p>
        </div>
      </div>
    );
  }

  if (!data?.organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Organization</h1>
          <p className="text-gray-600 mb-6">
            You're not currently linked to a company account. Enter your corporate code to get started.
          </p>
          <Button
            onClick={() => window.location.href = '/account'}
            className="bg-gradient-to-r from-purple-600 to-teal-600 text-white"
          >
            Go to Account Settings
          </Button>
        </div>
      </div>
    );
  }

  const { organization, analytics } = data;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(organization.corporateCode);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Corporate code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'core': return 'Core Access';
      case 'growth': return 'Growth Support';
      case 'culture_partner': return 'Culture Partner';
      default: return tier;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'core': return 'bg-blue-100 text-blue-700';
      case 'growth': return 'bg-purple-100 text-purple-700';
      case 'culture_partner': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-10 h-10 rounded-xl shadow-md object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Company Admin</h1>
              <p className="text-xs text-gray-500">{organization.name}</p>
            </div>
          </div>
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
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Organization Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Company Name</p>
                <p className="font-semibold text-gray-900">{organization.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Plan Tier</p>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getTierColor(organization.tier)}`}>
                  {getTierName(organization.tier)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Billing Status</p>
                <p className={`font-semibold ${organization.billingStatus === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                  {organization.billingStatus.charAt(0).toUpperCase() + organization.billingStatus.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Cost</p>
                <p className="font-semibold text-gray-900">
                  £{(organization.employeeCount * organization.pricePerSeat).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {organization.employeeCount} employees × £{organization.pricePerSeat}/month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{analytics?.activeEmployees || 0}</span>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics?.activeEmployees || 0} of {organization.employeeCount} using platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{analytics?.employeeEngagement.toFixed(0) || 0}%</span>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Employees Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Corporate Access Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Share this code with employees to give them unlimited access to GetReset.
            </p>

            {/* Corporate Code */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Company Code</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white px-4 py-3 rounded-lg font-mono text-lg font-bold text-purple-700 border border-purple-200">
                  {organization.corporateCode}
                </code>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-700 hover:bg-purple-50"
                  data-testid="button-copy-code"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Simplified Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">How it works:</p>
              <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                <li>Share this code with your team via email, Slack, or Teams</li>
                <li>Employees visit getreset.com and click "GetReset for Business"</li>
                <li>They enter this code and create their account</li>
                <li>Instant unlimited access - track usage here in your dashboard</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Popular Resets */}
        {analytics?.popularResets && analytics.popularResets.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Most Popular Resets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.popularResets.slice(0, 5).map((reset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{reset.name}</span>
                    <span className="text-sm font-semibold text-purple-600">{reset.count} uses</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
