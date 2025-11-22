import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Users, Plus, Trash2, Upload, LogOut } from "lucide-react";
import logoUrl from "@assets/getreset_logo.jpg";
import type { Company, AllowedEmployee, User } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({ name: "", contactEmail: "", contactPhone: "", notes: "" });
  const [newEmployee, setNewEmployee] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");

  // Check if user is authenticated and is admin
  const { data: user, isLoading: isLoadingUser } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/admin/companies"],
    enabled: !!user && user.user.email === "GetResett@gmail.com",
  });

  // Fetch employees for selected company
  const { data: employees = [] } = useQuery<AllowedEmployee[]>({
    queryKey: ["/api/admin/employees", selectedCompany],
    enabled: !!selectedCompany,
  });

  // Fetch all users
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.user.email === "GetResett@gmail.com",
  });

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: (data: typeof newCompany) => apiRequest("POST", "/api/admin/companies", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      setNewCompany({ name: "", contactEmail: "", contactPhone: "", notes: "" });
      setShowNewCompanyForm(false);
      toast({ title: "Company created successfully" });
    },
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: (data: { email: string; companyId: string }) =>
      apiRequest("POST", "/api/admin/employees", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employees", selectedCompany] });
      setNewEmployee("");
      toast({ title: "Employee added successfully" });
    },
  });

  // Bulk add employees mutation
  const bulkAddMutation = useMutation({
    mutationFn: (data: { companyId: string; emails: string[] }) =>
      apiRequest("POST", "/api/admin/employees/bulk", data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employees", selectedCompany] });
      setBulkEmails("");
      toast({ title: `Successfully added ${data.count} employees` });
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/employees/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employees", selectedCompany] });
      toast({ title: "Employee removed successfully" });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    },
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isLoadingUser && (!user || user.user.email !== "GetResett@gmail.com")) {
      setLocation("/login");
    }
  }, [user, isLoadingUser, setLocation]);

  if (isLoadingUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.user.email !== "GetResett@gmail.com") {
    return null;
  }

  const handleAddEmployee = () => {
    if (!selectedCompany || !newEmployee) return;
    addEmployeeMutation.mutate({ email: newEmployee, companyId: selectedCompany });
  };

  const handleBulkAdd = () => {
    if (!selectedCompany || !bulkEmails.trim()) return;
    const emails = bulkEmails.split(/[\n,]/).map(e => e.trim()).filter(Boolean);
    bulkAddMutation.mutate({ companyId: selectedCompany, emails });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="GetReset Logo" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Manage companies and employee access</p>
            </div>
          </div>
          <Button
            onClick={() => logoutMutation.mutate()}
            variant="outline"
            size="sm"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Companies Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Companies ({companies.length})</h2>
              </div>
              <Button
                size="sm"
                onClick={() => setShowNewCompanyForm(!showNewCompanyForm)}
                data-testid="button-add-company"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Company
              </Button>
            </div>

            {showNewCompanyForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <Label className="text-xs">Company Name</Label>
                  <Input
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="Acme Corp"
                    data-testid="input-company-name"
                  />
                </div>
                <div>
                  <Label className="text-xs">Contact Email</Label>
                  <Input
                    type="email"
                    value={newCompany.contactEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                    placeholder="contact@acme.com"
                  />
                </div>
                <div>
                  <Label className="text-xs">Notes</Label>
                  <Textarea
                    value={newCompany.notes}
                    onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                    placeholder="Optional notes..."
                    rows={2}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => createCompanyMutation.mutate(newCompany)}
                  disabled={!newCompany.name || createCompanyMutation.isPending}
                  className="w-full"
                  data-testid="button-save-company"
                >
                  {createCompanyMutation.isPending ? "Creating..." : "Create Company"}
                </Button>
              </div>
            )}

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCompany === company.id
                      ? "bg-teal-50 border-teal-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  data-testid={`company-${company.id}`}
                >
                  <div className="font-semibold text-sm text-gray-900">{company.name}</div>
                  {company.contactEmail && (
                    <div className="text-xs text-gray-500 mt-1">{company.contactEmail}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Whitelist Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Employee Whitelist {selectedCompany && `(${employees.length})`}
              </h2>
            </div>

            {!selectedCompany ? (
              <div className="text-center py-12 text-gray-500">
                Select a company to manage employee access
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-xs">Add Single Employee</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={newEmployee}
                        onChange={(e) => setNewEmployee(e.target.value)}
                        placeholder="employee@company.com"
                        data-testid="input-employee-email"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddEmployee}
                        disabled={!newEmployee || addEmployeeMutation.isPending}
                        data-testid="button-add-employee"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Bulk Add (CSV or line-separated)</Label>
                    <Textarea
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      placeholder="email1@company.com&#10;email2@company.com&#10;email3@company.com"
                      rows={4}
                      data-testid="input-bulk-emails"
                    />
                    <Button
                      size="sm"
                      onClick={handleBulkAdd}
                      disabled={!bulkEmails.trim() || bulkAddMutation.isPending}
                      className="mt-2"
                      data-testid="button-bulk-add"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {bulkAddMutation.isPending ? "Adding..." : "Bulk Add"}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Allowed Employees</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">{employee.email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEmployeeMutation.mutate(employee.id)}
                          data-testid={`button-delete-${employee.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Usage Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-700">{companies.length}</div>
              <div className="text-sm text-gray-600">Total Companies</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{allUsers.length}</div>
              <div className="text-sm text-gray-600">Registered Users</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-700">
                {allUsers.filter(u => u.hasPremiumAccess).length}
              </div>
              <div className="text-sm text-gray-600">Premium Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
