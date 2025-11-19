import { Button } from "@/components/ui/button";

interface SessionFlowProps {
  onStartSession: () => void;
  children?: React.ReactNode;
}

export function SessionFlow({ onStartSession, children }: SessionFlowProps) {
  return (
    <div className="w-full">
      {children}
      <div className="mt-6">
        <Button 
          onClick={onStartSession}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
        >
          Start Session
        </Button>
      </div>
    </div>
  );
}