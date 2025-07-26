import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Leaf, Activity, TrendingUp, User } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald to-mint rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Reset</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/" 
                  ? "bg-emerald/10 text-emerald font-medium" 
                  : "text-gray-600 hover:text-emerald hover:bg-emerald/5"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Resets</span>
            </Link>
            <Link 
              href="/insights" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/insights" 
                  ? "bg-emerald/10 text-emerald font-medium" 
                  : "text-gray-600 hover:text-emerald hover:bg-emerald/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Insights</span>
            </Link>
            <Link 
              href="/account" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                location === "/account" 
                  ? "bg-emerald/10 text-emerald font-medium" 
                  : "text-gray-600 hover:text-emerald hover:bg-emerald/5"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/account" className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="User profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-emerald-200" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center border-2 border-emerald-200">
                  <span className="text-emerald font-medium text-sm">
                    {user?.firstName?.[0] || user?.email?.[0] || "U"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm text-gray-700">
                {user?.firstName || 'User'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
