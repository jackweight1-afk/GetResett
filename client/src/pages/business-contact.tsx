import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, Phone, Users, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/getreset_logo.jpg";

export default function BusinessContact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    employeeSize: "",
    interestedTier: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/leads", formData);
      
      toast({
        title: "Thank you for your interest!",
        description: "We'll be in touch within 24 hours to discuss your needs.",
      });

      // Reset form
      setFormData({
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        employeeSize: "",
        interestedTier: "",
        message: ""
      });

      // Redirect to thank you state after short delay
      setTimeout(() => {
        window.location.href = '/business?submitted=true';
      }, 2000);

    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50">
      {/* Header */}
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              GetReset
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/business'}
            className="text-gray-700 hover:text-gray-900"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">GetReset for Business</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Let's talk about your team's wellbeing
            </h1>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll be in touch within 24 hours to discuss how GetReset can support your organization.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-8 border border-purple-100/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Your Organization"
                    data-testid="input-company-name"
                  />
                </div>
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="John Smith"
                  data-testid="input-contact-name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="john@company.com"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="+44 20 1234 5678"
                    data-testid="input-contact-phone"
                  />
                </div>
              </div>

              {/* Employee Size */}
              <div>
                <label htmlFor="employeeSize" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Employees *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="employeeSize"
                    name="employeeSize"
                    value={formData.employeeSize}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none bg-white"
                    data-testid="select-employee-size"
                  >
                    <option value="">Select size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-250">51-250 employees</option>
                    <option value="251+">251+ employees</option>
                  </select>
                </div>
              </div>

              {/* Interested Tier */}
              <div>
                <label htmlFor="interestedTier" className="block text-sm font-semibold text-gray-700 mb-2">
                  Interested Tier (Optional)
                </label>
                <select
                  id="interestedTier"
                  name="interestedTier"
                  value={formData.interestedTier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none bg-white"
                  data-testid="select-tier"
                >
                  <option value="">Not sure yet</option>
                  <option value="core">Core Access</option>
                  <option value="growth">Growth Support</option>
                  <option value="culture_partner">Culture Partner</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                  placeholder="Tell us about your team's wellbeing needs..."
                  data-testid="textarea-message"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white py-4 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all text-base"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Inquiry
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to be contacted by GetReset regarding your inquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
