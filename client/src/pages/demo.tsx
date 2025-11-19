import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import Resets from './resets';

const DEMO_PASSWORD = 'GetReset123!';
const STORAGE_KEY = 'demo_access';

export default function Demo() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [, setLocation] = useLocation();

  // Check if user already has access
  useEffect(() => {
    const storedAccess = sessionStorage.getItem(STORAGE_KEY);
    if (storedAccess === 'true') {
      setHasAccess(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setHasAccess(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // If has access, show the resets page
  if (hasAccess) {
    return <Resets />;
  }

  // Show password screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 
              data-testid="title-demo-access"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            >
              Demo Access
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto leading-snug">
              Enter the password to access the GetReset demo
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-demo-password"
                className="w-full text-xs sm:text-sm h-10"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-600 mt-2" data-testid="text-password-error">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="button-demo-submit"
              className="w-full text-xs sm:text-sm h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Access Demo
            </Button>
          </form>

          {/* Back Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLocation('/')}
              data-testid="button-back-home"
              className="w-full text-xs sm:text-sm h-10"
            >
              Back to Home
            </Button>
          </div>

          {/* Helper Text */}
          <div className="text-center text-[11px] sm:text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            This is a private demo area for showcasing GetReset
          </div>
        </div>
      </div>
    </div>
  );
}
