import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface EnergyDisclaimerModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onCancel: () => void;
}

export default function EnergyDisclaimerModal({ isOpen, onAgree, onCancel }: EnergyDisclaimerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl">Important: Movement Safety</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p className="text-gray-700 leading-relaxed">
              These resets involve physical movement and light exercise. Before starting:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Ensure you have enough space to move safely</li>
              <li>Stop immediately if you feel pain, dizziness, or discomfort</li>
              <li>Consult a doctor if you have any medical conditions</li>
              <li>Stay hydrated and listen to your body</li>
              <li>Use low-impact alternatives if needed</li>
            </ul>
            <p className="text-sm text-gray-500 italic">
              GetResett is not a substitute for professional medical advice. These movements are gentle and designed for general wellness.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 rounded-xl"
            data-testid="button-disclaimer-cancel"
          >
            Maybe Later
          </Button>
          <Button
            onClick={onAgree}
            className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
            data-testid="button-disclaimer-agree"
          >
            Agree & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
