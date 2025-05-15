import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Location, SavedRoute } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  user: UserProfile | null;
  isOnboardingComplete: boolean;
  updateUser: (userData: Partial<UserProfile>) => void;
  setHomeLocation: (location: Location) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveRoute: (route: Omit<SavedRoute, 'id'>) => void;
  deleteRoute: (routeId: string) => void;
  useAirCredits: (amount: number) => boolean;
  getAvailableCredits: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const { toast } = useToast();

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOnboardingStatus = localStorage.getItem('onboardingComplete');
    const hasUsedTrial = localStorage.getItem('hasUsedTrial');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure airCredits is set to 3 for new users
      if (!parsedUser.airCredits) {
        parsedUser.airCredits = 3;
      }
      setUser(parsedUser);
    }
    
    if (storedOnboardingStatus) {
      setIsOnboardingComplete(JSON.parse(storedOnboardingStatus));
    }

    // If user has used trial before, prevent reuse
    if (hasUsedTrial === 'true') {
      setIsOnboardingComplete(true);
    }
  }, []);

  // Function to use air credits
  const useAirCredits = (amount: number): boolean => {
    if (!user || user.airCredits < amount) {
      return false;
    }

    const newUser = {
      ...user,
      airCredits: user.airCredits - amount
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  // Function to get available credits
  const getAvailableCredits = (): number => {
    if (!user) return 0;
    return user.airCredits;
  };

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    localStorage.setItem('onboardingComplete', JSON.stringify(isOnboardingComplete));
  }, [user, isOnboardingComplete]);

  const updateUser = (userData: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) {
        return { 
          id: uuidv4(), 
          name: '', 
          hasRespiratoryIssues: false, 
          sensitivityLevel: 'medium',
          airCredits: 3, // Set to 3 credits by default
          lastCreditRefresh: new Date().toISOString(),
          deviceId: '', // Will be set when IP is detected
          ...userData 
        };
      }
      return { ...prev, ...userData };
    });
  };

  const setHomeLocation = (location: Location) => {
    updateUser({ homeLocation: location });
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem('hasUsedTrial', 'true');
  };

  const resetOnboarding = () => {
    // Don't allow resetting if trial has been used
    if (localStorage.getItem('hasUsedTrial') === 'true') {
      toast({
        title: "Cannot Reset",
        description: "Trial version can only be used once.",
        variant: "destructive"
      });
      return;
    }

    setIsOnboardingComplete(false);
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    setUser(null);
  };

  const saveRoute = (route: Omit<SavedRoute, 'id'>) => {
    if (!user) return;
    
    const newRoute: SavedRoute = {
      ...route,
      id: uuidv4(),
    };
    
    updateUser({
      preferredRoutes: [...(user?.preferredRoutes || []), newRoute]
    });
  };

  const deleteRoute = (routeId: string) => {
    if (user?.preferredRoutes) {
      updateUser({
        preferredRoutes: user.preferredRoutes.filter(route => route.id !== routeId)
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isOnboardingComplete, 
      updateUser, 
      setHomeLocation,
      completeOnboarding,
      resetOnboarding,
      saveRoute,
      deleteRoute,
      useAirCredits,
      getAvailableCredits
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
