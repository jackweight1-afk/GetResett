import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Users, TrendingUp, Heart, Shield, Calendar, FileText, Award, Building2, ArrowLeft } from "lucide-react";
import logoUrl from "@assets/getreset_logo.jpg";

export default function Business() {
  const tiers = [
    {
      name: "Core Access",
      icon: Building2,
      price: "£5.99",
      recommended: "Small businesses, start-ups, agencies, charities",
      employeeSize: "1-50 employees",
      features: [
        "Full access to GetReset+ premium content",
        "Monthly wellbeing usage report (aggregated & anonymised)",
        "Onboarding pack for internal comms",
        "Access to HR support materials (posters, email templates)"
      ],
      highlight: false
    },
    {
      name: "Growth Support",
      icon: TrendingUp,
      price: "£5.99",
      recommended: "Expanding teams, culture-driven organisations",
      employeeSize: "51-250 employees",
      features: [
        "Everything in Core Access",
        "2× Wellbeing Reset Days per year (bi-annual)",
        "1-hour staff wellbeing webinar",
        "1-hour training for line managers/senior leadership",
        "HR follow-up summary with recommendations",
        "Enhanced wellbeing reporting (trends + engagement insights)"
      ],
      highlight: true
    },
    {
      name: "Culture Partner",
      icon: Award,
      price: "£5.99",
      recommended: "Large organisations, councils, NHS partners, education trusts",
      employeeSize: "251+ employees",
      features: [
        "Everything in Growth Support",
        "4× Wellbeing Reset Days per year (quarterly)",
        "Advanced reporting: department/role breakdowns",
        "Wellbeing trend analysis",
        "Reset category utilisation patterns",
        "One Custom Reset Pack tailored to organisational challenges",
        "Optional co-branding opportunities",
        "Annual strategy review with HR/Leadership"
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50">
      {/* Header */}
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.location.href = '/signup'}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white text-sm font-semibold"
              data-testid="button-employee-login-header"
            >
              Employee Login
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="text-gray-700 hover:text-gray-900"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-gray-700">GetReset for Business</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Workplace wellbeing that actually fits into the workday
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Give your team science-backed wellbeing tools they'll actually use. 
            Quick resets that reduce stress, improve focus, and boost morale—all in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/signup'}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white text-base sm:text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-full"
              data-testid="button-employee-login"
            >
              Employee Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/business/contact'}
              className="w-full sm:w-auto border-2 border-teal-500 text-teal-700 hover:bg-teal-50 text-base sm:text-lg px-10 py-6 shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-full"
              data-testid="button-enquire"
            >
              Enquire Now
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why organizations choose GetReset
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "High Engagement", desc: "60-90 second sessions mean your team will actually use it, not another forgotten wellness benefit" },
              { icon: Heart, title: "Measurable Impact", desc: "Track usage, engagement, and trends with anonymised reporting that respects employee privacy" },
              { icon: Shield, title: "Evidence-Based", desc: "Science-backed techniques proven to reduce stress, improve focus, and support mental wellbeing" }
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose the right tier for your team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All tiers include unlimited resets for employees. Pricing is simple: <strong>£5.99 per employee per month</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all ${tier.highlight ? 'ring-2 ring-teal-500 transform scale-105' : ''}`}
              >
                {tier.highlight && (
                  <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center">
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {tier.price}
                    <span className="text-base font-normal text-gray-600"> / employee / month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tier.recommended}</p>
                  <p className="text-xs font-semibold text-teal-600">{tier.employeeSize}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => window.location.href = '/business/contact'}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    tier.highlight 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  data-testid={`button-tier-${i}`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Volume discounts available for organizations with 500+ employees</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-pink-500 via-purple-500 to-teal-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to support your team's wellbeing?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get in touch to discuss your organization's needs and start your wellbeing program.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/business/contact'}
            className="bg-white text-teal-700 hover:bg-gray-100 text-base sm:text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold rounded-full"
            data-testid="button-contact-cta"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold">GetReset</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 GetReset. Workplace wellbeing made simple.
          </p>
        </div>
      </footer>
    </div>
  );
}
