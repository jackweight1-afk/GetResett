import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Leaf, Activity, TrendingUp, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-black" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Reset</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/" 
                  ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Resets</span>
            </Link>
            <Link 
              href="/insights" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/insights" 
                  ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Insights</span>
            </Link>
            <Link 
              href="/account" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/account" 
                  ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {/* User profile */}
            <Link href="/account" className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="User profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-300" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border-2 border-purple-300 shadow-sm">
                  <span className="text-black font-semibold text-sm">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm text-gray-800 font-medium">
                {user?.firstName || 'User'}
              </span>
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  location === "/" 
                    ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Activity className="w-5 h-5" />
                <span>Resets</span>
              </Link>
              <Link 
                href="/insights" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  location === "/insights" 
                    ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Insights</span>
              </Link>
              <Link 
                href="/account" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  location === "/account" 
                    ? "bg-purple-100 text-purple-700 font-semibold border border-purple-300" 
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
