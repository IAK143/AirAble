import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useUser, UserProvider } from '@/contexts/UserContext';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import RouteView from '@/pages/Route';
import AirMap from '@/pages/AirMap';
import Profile from '@/pages/Profile';
import Welcome from '@/pages/Welcome';
import KeyCodeVerification from '@/components/KeyCodeVerification';

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { isOnboardingComplete } = useUser();
  const { toast } = useToast();

  if (!isOnboardingComplete) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

const RequireKeyCode = ({ children }: { children: React.ReactNode }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const verified = localStorage.getItem('airAbleKeyVerified') === 'true';
    setIsVerified(verified);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null; // or a loading spinner
  }

  if (!isVerified) {
    return <KeyCodeVerification onVerified={() => setIsVerified(true)} />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Router>
      <RequireKeyCode>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/*"
            element={
              <RequireOnboarding>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="pt-16">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/route" element={<RouteView />} />
                      <Route path="/air-map" element={<AirMap />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                </div>
              </RequireOnboarding>
            }
          />
        </Routes>
      </RequireKeyCode>
      <Toaster />
    </Router>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
