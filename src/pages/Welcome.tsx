import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  Route, 
  MapPin, 
  AirVent, 
  Shield, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const Welcome = () => {
  const navigate = useNavigate();
  const { updateUser, completeOnboarding } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const steps: Step[] = [
    {
      title: "Welcome to AirAble",
      description: "Your personal air quality companion for cleaner journeys",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            AirAble helps you navigate through the cleanest air routes in India, 
            protecting your health and well-being.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Trial Version Features:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                3 trial credits for route searches
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Basic route planning
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Air quality monitoring
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Clean Route Planning",
      description: "Find the cleanest air routes for your journey",
      icon: Route,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Our advanced algorithm calculates multiple routes and recommends the one 
            with the best air quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Smart Routing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Automatically finds alternative routes with better air quality
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Get live air quality data along your route
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Air Quality Monitoring",
      description: "Real-time air quality data across India",
      icon: AirVent,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Access comprehensive air quality data for any location in India.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">AQI Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Monitor air quality index in real-time
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Health Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Get notified about poor air quality conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Health Protection",
      description: "Personalized recommendations based on your health profile",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Customize your experience based on your health needs and preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Health Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Set your health preferences for personalized recommendations
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">
                  Receive alerts based on your health conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            updateUser({
              name: 'Test Profile',
              hasRespiratoryIssues: false,
              sensitivityLevel: 'medium',
              airCredits: 3,
              lastCreditRefresh: new Date().toISOString(),
              homeLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: 'Current Location'
              }
            });
            
            completeOnboarding();
            
            setTimeout(() => {
              navigate('/');
            }, 2000);
          },
          (error) => {
            console.error('Error getting location:', error);
            toast({
              title: "Location Error",
              description: "Could not access your location. Please enable location services.",
              variant: "destructive"
            });
            setIsLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Error in setup:', error);
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-blue-900">Setting up AirAble</h2>
          <p className="text-muted-foreground">Preparing your experience...</p>
        </motion.div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {currentStepData.title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentStepData.content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          {currentStep === steps.length - 1 ? (
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              onClick={nextStep}
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {currentStep === steps.length - 1 ? 
              "By continuing, you agree to our Terms of Service and Privacy Policy" :
              `Step ${currentStep + 1} of ${steps.length}`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 