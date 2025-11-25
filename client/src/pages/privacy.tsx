import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import logoUrl from "@assets/getreset_logo.jpg";

export default function Privacy() {
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
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            
            <p className="text-sm text-gray-500 mb-8">Last updated: November 2025</p>

            <div className="prose prose-gray max-w-none space-y-6 text-sm sm:text-base">
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy explains how GetResett ("we", "us", "our") collects, uses and protects your personal data when you use our web application ("the App") and any related services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are committed to handling your personal data fairly, transparently and securely in accordance with UK GDPR and the Data Protection Act 2018.
              </p>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">1. Who We Are</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-700"><strong>Data Controller:</strong> GetResett</p>
                  <p className="text-gray-700">Northamptonshire, United Kingdom</p>
                  <p className="text-gray-700">Email: getresett@gmail.com</p>
                </div>
                <p className="text-gray-700 mt-4">
                  We do not currently appoint a Data Protection Officer. If you have any questions about this Privacy Policy or your personal data, please contact us using the email above.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">2. The Data We Collect</h2>
                <p className="text-gray-700 font-medium mb-2">We collect:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Account Information (name, email, password)</li>
                  <li>Usage Information (resets completed, categories used, mood selections, timestamps)</li>
                  <li>Corporate Access Information (email domain, organisation ID)</li>
                  <li>Technical Information (device type, browser type, IP region, cookies, log data)</li>
                </ul>
                <p className="text-gray-700 font-medium mt-4 mb-2">We do not collect:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>GPS location</li>
                  <li>Biometric data</li>
                  <li>Medical data</li>
                  <li>Payment details (handled by Apple)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
                <p className="text-gray-700 mb-2">We use your data to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Manage your account</li>
                  <li>Provide resets and features</li>
                  <li>Enforce free/paid access rules</li>
                  <li>Recognise corporate accounts</li>
                  <li>Improve the App</li>
                  <li>Provide anonymous organisational insights</li>
                  <li>Support users and maintain performance</li>
                </ul>
                <p className="text-gray-700 mt-4 font-medium">We never share individual usage with employers.</p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">4. Corporate Reporting</h2>
                <p className="text-gray-700 mb-2">We may share anonymous, aggregated insights with employers, such as:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Total active users</li>
                  <li>Reset usage counts</li>
                  <li>Popular reset categories</li>
                  <li>General usage patterns</li>
                </ul>
                <p className="text-gray-700 font-medium mt-4 mb-2">We guarantee:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>No identification of individuals</li>
                  <li>No personal reset histories shared</li>
                  <li>Minimum group size of 5 before reporting</li>
                  <li>Data used only for wellbeing insights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">5. Legal Bases</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Contract</li>
                  <li>Legitimate Interests</li>
                  <li>Consent (where relevant)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">6. Sharing Your Data</h2>
                <p className="text-gray-700 mb-2">We share data only with:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Apple (app hosting, analytics)</li>
                  <li>Replit (web hosting)</li>
                  <li>RevenueCat (payment handling)</li>
                  <li>Mailchimp (email communications)</li>
                </ul>
                <p className="text-gray-700 mt-2">All providers comply with GDPR.</p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Reset data: 12 months</li>
                  <li>Technical logs: 90 days</li>
                  <li>Account data: retained while active</li>
                  <li>Corporate access data: retained during partnership</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">8. Your Rights</h2>
                <p className="text-gray-700 mb-2">You may:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Access your data</li>
                  <li>Correct inaccuracies</li>
                  <li>Request deletion</li>
                  <li>Restrict processing</li>
                  <li>Withdraw consent</li>
                  <li>Request portability</li>
                  <li>Complain to the ICO</li>
                </ul>
                <p className="text-gray-700 mt-2">Contact: getresett@gmail.com</p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">9. Cookies</h2>
                <p className="text-gray-700 mb-2">We use:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Essential cookies (login/security)</li>
                  <li>Analytics cookies (with consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">10. Data Security</h2>
                <p className="text-gray-700">
                  We use encryption, secure password hashing, access control and regular monitoring to protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700">
                  This service is not intended for users under 16 years of age.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">12. Changes</h2>
                <p className="text-gray-700">
                  We may update this policy. The "Last updated" date will change accordingly.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-4">13. Contact</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-700"><strong>GetResett</strong></p>
                  <p className="text-gray-700">Email: getresett@gmail.com</p>
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
