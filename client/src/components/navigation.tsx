import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Leaf, Bell } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal to-sage rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Reset</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`${
                location === "/" ? "text-teal font-medium" : "text-gray-600 hover:text-teal"
              } transition-colors`}
            >
              Dashboard
            </Link>
            <Link 
              href="/insights" 
              className={`${
                location === "/insights" ? "text-teal font-medium" : "text-gray-600 hover:text-teal"
              } transition-colors`}
            >
              Insights
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-teal transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
                <span className="text-teal font-medium text-sm">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
