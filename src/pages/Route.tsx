import { useState } from 'react';
import { SavedRoute } from '@/types';
import { useUser } from '@/contexts/UserContext';
import RouteForm from '@/components/route/RouteForm';
import RouteResults from '@/components/route/RouteResults';
import { useToast } from '@/hooks/use-toast';
import Map from '@/components/Map';
import RouteComparisonTable from "@/components/route/RouteComparisonTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CreditCard, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const Route = () => {
  const { user, useAirCredits, getAvailableCredits } = useUser();
  const [routeSearch, setRouteSearch] = useState<{
    candidateRoutes?: (Omit<SavedRoute, "id"> & { duration?: number })[];
    selectedRouteIndex?: number;
  }>({});
  const { toast } = useToast();

  const credits = getAvailableCredits();
  const creditPercentage = (credits / 3) * 100;

  const handleRouteCalculated = (
    routes: (Omit<SavedRoute, "id"> & { duration?: number })[],
    selectedRouteIndex: number
  ) => {
    // Check if user has enough credits before proceeding
    if (credits < 1) {
      toast({
        title: "Insufficient Trial Credits",
        description: `You need 1 trial credit to search for routes. You currently have ${credits} out of 3 credits.`,
        variant: "destructive"
      });
      return;
    }

    // Use the credit before setting the routes
    if (!useAirCredits(1)) {
      toast({
        title: "Error",
        description: "Failed to use credit. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setRouteSearch({ candidateRoutes: routes, selectedRouteIndex });
    
    toast({
      title: "Route Search Complete",
      description: `1 trial credit has been used. You have ${getAvailableCredits()} out of 3 credits remaining.`,
    });
  };

  const handleSaveRoute = () => {
    toast({
      title: "Route Saved",
      description: "Your route has been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Find Clean Routes
        </h1>
        <p className="text-muted-foreground mt-2">
          Plan your journey through the cleanest air routes in India
        </p>
      </motion.div>

      {/* Enhanced Credits Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6 border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Trial Credits</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                <CreditCard className="h-3 w-3 mr-1" />
                Limited Use
              </Badge>
            </div>
            <CardDescription>
              Trial Credits: {credits}/3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <motion.p 
                      key={credits}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-bold text-blue-600"
                    >
                      {credits}
                    </motion.p>
                    <p className="text-sm text-muted-foreground">/3</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Cost: 1 credit
                  </Badge>
                  <p className="text-sm text-muted-foreground">per route search</p>
                </div>
              </div>
              <Progress 
                value={creditPercentage} 
                className="h-2 bg-blue-100"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {credits < 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive" className="mb-6 border-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="flex items-center gap-2">
                <span>You need 1 credit to search for routes.</span>
                <Badge variant="outline" className="bg-destructive/10">
                  {credits}/3
                </Badge>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <RouteForm
          onRoutesCalculated={handleRouteCalculated}
          disabled={credits < 1}
          initialStart={user?.homeLocation}
        />
        {routeSearch.candidateRoutes && routeSearch.selectedRouteIndex !== undefined && (
          <>
            <RouteResults
              route={routeSearch.candidateRoutes[routeSearch.selectedRouteIndex]}
              onSave={handleSaveRoute}
            />
            <RouteComparisonTable
              routes={routeSearch.candidateRoutes}
              selectedIndex={routeSearch.selectedRouteIndex}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Route;
