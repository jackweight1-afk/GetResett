import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 
              data-testid="title-pending-approval"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            >
              Account Pending Approval
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto leading-snug">
              Your account is waiting for admin approval. You'll receive an email once activated.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">What happens next?</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Our admin team will review your account</li>
                  <li>• You'll be notified via email when approved</li>
                  <li>• This usually takes 1-2 business days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <Button
              data-testid="button-contact-support"
              variant="outline"
              onClick={() => window.location.href = 'mailto:support@getreset.com'}
              className="w-full text-xs sm:text-sm h-10"
            >
              Contact Support
            </Button>

            <Button
              data-testid="button-back-login"
              variant="ghost"
              onClick={() => window.location.href = '/login'}
              className="w-full text-xs sm:text-sm h-10"
            >
              Back to Login
            </Button>
          </div>

          {/* Helper Text */}
          <div className="text-center text-[11px] sm:text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            Need immediate access? Contact your admin
          </div>
        </div>
      </div>
    </div>
  );
}
