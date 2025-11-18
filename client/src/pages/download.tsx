import { Button } from "@/components/ui/button";
import { Apple, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/getreset_logo.jpg";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Download() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // You can add an endpoint later to collect launch notification emails
      toast({
        title: "Thanks for your interest!",
        description: "We'll notify you as soon as GetReset launches on the App Store.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-gray-700 hover:text-gray-900"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 sm:p-12 border border-purple-100/50">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={logoUrl} 
                alt="GetReset Logo" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-lg object-cover"
              />
            </div>

            {/* Apple Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center">
                <Apple className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon to the App Store
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              GetReset for iOS is being built and will be available soon. 
              Enter your email to be notified when we launch.
            </p>

            {/* Email Form */}
            <form onSubmit={handleNotify} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    required
                    data-testid="input-email"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                  data-testid="button-notify"
                >
                  {isSubmitting ? "Submitting..." : "Notify Me"}
                </Button>
              </div>
            </form>

            <div className="text-sm text-gray-500">
              Already using GetReset?{" "}
              <a
                href="/business"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Explore GetReset for Business
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-gray-600">
            <p className="text-sm">
              In the meantime, organizations can access GetReset through our corporate portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
