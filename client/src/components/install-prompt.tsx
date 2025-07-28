import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Share, Plus, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasPromptedBefore, setHasPromptedBefore] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has been prompted before
    const hasPrompted = localStorage.getItem('install-prompt-shown');
    if (hasPrompted) {
      setHasPromptedBefore(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show manual prompt after a delay if not prompted before
      if (!hasPrompted) {
        setTimeout(() => {
          setShowModal(true);
        }, 10000); // Show after 10 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowModal(false);
      localStorage.setItem('install-prompt-shown', 'true');
    } else {
      // Show manual instructions for browsers without PWA support
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('install-prompt-shown', 'true');
  };

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS || isSafari) {
      return {
        title: "Add GetResett to Your iPhone",
        steps: [
          { icon: Share, text: "Tap the Share button at the bottom of Safari" },
          { icon: Plus, text: "Scroll down and tap 'Add to Home Screen'" },
          { icon: Smartphone, text: "Tap 'Add' to create your home screen shortcut" }
        ]
      };
    }
    
    return {
      title: "Add GetResett to Your Phone",
      steps: [
        { icon: Smartphone, text: "Open Chrome menu (three dots)" },
        { icon: Plus, text: "Tap 'Add to Home screen' or 'Install app'" },
        { icon: Smartphone, text: "Confirm to add GetResett to your home screen" }
      ]
    };
  };

  // Don't show anything if already installed or on desktop
  if (isInstalled || window.innerWidth > 768) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <>
      {/* Floating install button */}
      {!hasPromptedBefore && !showModal && (
        <Button
          onClick={handleInstallClick}
          className="fixed bottom-20 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-full p-3 md:hidden"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Install App
        </Button>
      )}

      {/* Install instructions modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {instructions.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get quick access to your wellness resets by adding GetResett to your home screen!
            </p>
            
            <div className="space-y-3">
              {instructions.steps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardContent className="flex items-center space-x-3 p-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <step.icon className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{step.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {deferredPrompt && (
              <Button
                onClick={handleInstallClick}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Install GetResett
              </Button>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                  localStorage.setItem('install-prompt-shown', 'true');
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Got It!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}