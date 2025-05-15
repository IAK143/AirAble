import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { validateKeyCode, markKeyCodeAsUsed } from '@/config/keys';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

interface KeyCodeVerificationProps {
  onVerified: () => void;
}

const KeyCodeVerification = ({ onVerified }: KeyCodeVerificationProps) => {
  const [keyCode, setKeyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (validateKeyCode(keyCode)) {
        markKeyCodeAsUsed();
        toast({
          title: "Access Granted",
          description: "Welcome to AirAble! You can now use the app.",
        });
        onVerified();
      } else {
        toast({
          title: "Invalid Key Code",
          description: "Please check your key code and try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Trial Access</CardTitle>
            </div>
            <CardDescription>
              Enter your trial key code to access AirAble
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your key code"
                value={keyCode}
                onChange={(e) => setKeyCode(e.target.value)}
                className="text-center text-lg tracking-wider"
                autoFocus
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={!keyCode || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Key Code"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default KeyCodeVerification; 