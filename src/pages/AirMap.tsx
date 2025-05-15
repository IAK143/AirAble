import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, MapPin, Lock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AirMap = () => {
  const { user } = useUser();

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Air Quality Map
        </h1>
        <p className="text-muted-foreground mt-2">
          View real-time air quality data across India
        </p>
      </motion.div>

      <Alert variant="destructive" className="mb-6">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          This feature is not available in the trial version. Upgrade to the full version to access the Air Quality Map.
        </AlertDescription>
      </Alert>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Premium Feature</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                <MapPin className="h-3 w-3 mr-1" />
                Trial Version
              </Badge>
            </div>
            <CardDescription>
              The Air Quality Map is a premium feature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Unavailable in Trial Version</h3>
                <p className="text-sm text-blue-700 mt-1">
                  The Air Quality Map feature is only available in the full version of AirAble. 
                  Upgrade to access real-time air quality data across India.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">What you'll get with the full version:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Real-time air quality data across India
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Detailed pollution level indicators
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Historical air quality trends
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Custom alerts for your locations
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AirMap;
