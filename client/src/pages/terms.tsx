import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import logoUrl from "@assets/getreset_logo.jpg";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50">
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              GetReset
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-gray-700 hover:text-gray-900"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-10 border border-purple-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>
            
            <p className="text-sm text-gray-500 mb-8">Last updated: November 2025</p>

            <div className="prose prose-gray max-w-none space-y-6 text-sm sm:text-base">
              <p className="text-gray-700 leading-relaxed">
                Welcome to GetResett. These Terms & Conditions ("Terms") govern your use of our web app, mobile app, and services.
              </p>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">1. Who We Are</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-700"><strong>GetResett</strong></p>
                  <p className="text-gray-700">Northamptonshire, United Kingdom</p>
                  <p className="text-gray-700">Email: getresett@gmail.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
                <p className="text-gray-700">
                  You must be at least 16 years old and legally capable of agreeing to these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">3. Health & Safety Disclaimer</h2>
                <p className="text-gray-700 mb-4">
                  GetResett provides short, guided wellbeing and mental fitness resets. These are not medical or therapeutic exercises.
                </p>
                <p className="text-gray-700 mb-2">By using the app, you confirm that:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>You are fit and able to participate safely</li>
                  <li>You take full responsibility for your wellbeing</li>
                  <li>You will stop immediately if you feel unwell or uncomfortable</li>
                  <li>You will seek professional help if needed</li>
                </ul>
                <p className="text-gray-700 mt-4 font-medium">
                  GetResett does not provide medical advice, diagnosis, therapy, or crisis support.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">4. Using the App</h2>
                <p className="text-gray-700 mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Share your login details</li>
                  <li>Misuse any features</li>
                  <li>Interfere with the functioning of the app</li>
                  <li>Use the service unlawfully</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">5. Creating an Account</h2>
                <p className="text-gray-700">
                  You must provide accurate information and keep your login secure. Notify us of any unauthorised access.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">6. Free Tier & Paid Subscriptions</h2>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 font-medium mb-2">Free Tier:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Up to 3 resets per day</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-teal-50 rounded-xl p-4 mb-4 border border-pink-100">
                  <p className="text-gray-700 font-medium mb-2">GetResett+ (Paid):</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Unlimited resets</li>
                    <li>Monthly webinar access</li>
                    <li>Full podcast episodes and Q&A</li>
                    <li>Weekly actionable insights</li>
                    <li>Priority access to new features</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 font-medium mb-2">Billing:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Managed through Apple</li>
                    <li>Auto-renews unless cancelled</li>
                    <li>Refunds handled by Apple</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">7. Corporate Access</h2>
                <p className="text-gray-700">
                  Corporate access is granted based on work email verification. Users must not share this access outside their organisation. Only anonymous, aggregated usage insights are shared with employers.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">8. Intellectual Property</h2>
                <p className="text-gray-700">
                  All content, branding, scripts, audio, video and features belong to GetResett. You may not copy, reproduce, or distribute any materials.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">9. Service Availability</h2>
                <p className="text-gray-700">
                  We do not guarantee uninterrupted service or error-free operation. Updates may occur without notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700">
                  Use the app at your own risk. GetResett is not responsible for any discomfort, injury, or indirect damages. This does not exclude liability where prohibited by law.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
                <p className="text-gray-700">
                  We may suspend or terminate accounts for violation of these Terms. You may delete your account at any time.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to These Terms</h2>
                <p className="text-gray-700">
                  We may update these Terms. The revised date will appear at the top of this document.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms are governed by the laws of England and Wales.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Us</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-700">For any questions, please contact:</p>
                  <p className="text-gray-700"><strong>Email:</strong> getresett@gmail.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 GetReset. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors" data-testid="link-terms">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
