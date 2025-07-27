import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Moon, 
  Zap, 
  Target, 
  Heart,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface FeelingCheckProps {
  onFeelingSelected: (feeling: string, sessionTypeId: string) => void;
  onFeelBetter: () => void;
  isPostSession?: boolean;
}

const feelingOptions = [
  {
    id: "stressed",
    label: "Stressed",
    description: "Feeling tense or overwhelmed",
    icon: Brain,
    color: "bg-blue-100 text-blue-600",
    sessionType: "Stress Relief"
  },
  {
    id: "cant_sleep",
    label: "Can't Sleep",
    description: "Having trouble winding down",
    icon: Moon,
    color: "bg-purple-100 text-purple-600",
    sessionType: "Sleep Check-in"
  },
  {
    id: "achy_muscles",
    label: "Achy Muscles",
    description: "Body feels tight or sore",
    icon: Zap,
    color: "bg-sage/20 text-sage",
    sessionType: "Upper Body Stretch"
  },
  {
    id: "cant_focus",
    label: "Can't Focus",
    description: "Mind feels scattered",
    icon: Target,
    color: "bg-yellow-100 text-yellow-600",
    sessionType: "Focus Reset"
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Need a moment of calm",
    icon: Heart,
    color: "bg-teal/20 text-teal",
    sessionType: "Mindful Moment"
  }
];

export default function FeelingCheck({ onFeelingSelected, onFeelBetter, isPostSession = false }: FeelingCheckProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const createFeelingEntryMutation = useMutation({
    mutationFn: async (data: { feeling: string, isPostSession: boolean }) => {
      return await apiRequest("POST", "/api/feelings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save feeling. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFeelingSelect = async (feeling: any) => {
    setSelectedFeeling(feeling.id);
    
    // Log the feeling selection
    await createFeelingEntryMutation.mutateAsync({
      feeling: feeling.id,
      isPostSession
    });

    // Find the corresponding session type
    const sessionTypes = queryClient.getQueryData(['/api/session-types']) as any[];
    const matchingSessionType = sessionTypes?.find(st => st.name === feeling.sessionType);
    
    if (matchingSessionType) {
      onFeelingSelected(feeling.id, matchingSessionType.id);
    }
  };

  const handleFeelBetter = async () => {
    setSelectedFeeling("better");
    
    // Log that they feel better
    await createFeelingEntryMutation.mutateAsync({
      feeling: "feel_better",
      isPostSession: true
    });

    onFeelBetter();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isPostSession ? `How are you feeling now, ${user?.firstName || "there"}?` : `Hi ${user?.firstName || "there"}, how are you feeling?`}
          </h1>
          <p className="text-lg text-gray-600">
            {isPostSession 
              ? "Let us know if you'd like to try another reset or if you're feeling better."
              : "Let's find the perfect 60-second reset to help you feel better."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {feelingOptions.map((feeling) => {
            const IconComponent = feeling.icon;
            const isSelected = selectedFeeling === feeling.id;
            
            return (
              <Card 
                key={feeling.id}
                className={`border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected ? 'ring-2 ring-purple-500 border-purple-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFeelingSelect(feeling)}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${feeling.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feeling.label}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feeling.description}</p>
                    <div className="flex items-center justify-center text-sm text-purple-600 font-medium">
                      <span>Get Help</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {isPostSession && (
          <div className="text-center">
            <Card className="border-emerald-200 bg-emerald-50/50 max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <Button
                    onClick={handleFeelBetter}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                    disabled={createFeelingEntryMutation.isPending}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I Feel Better, Thanks!
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Ready to see your insights and analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}