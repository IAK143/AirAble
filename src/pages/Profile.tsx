import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ThumbsUp, 
  User, 
  Settings, 
  LogOut, 
  CreditCard
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/components/ui/use-toast';
import Map from '@/components/Map';
import LocationSearch from '@/components/LocationSearch';
import { Location, UserProfile } from '@/types';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user, updateUser, resetOnboarding, setHomeLocation } = useUser();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(user || {});
  
  const handleSaveChanges = () => {
    updateUser(formData);
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const handleLocationSelect = (location: Location) => {
    setFormData(prev => ({ ...prev, homeLocation: location }));
  };
  
  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile? This will delete all your saved data.')) {
      resetOnboarding();
      toast({
        title: "Profile Reset",
        description: "Your profile has been reset. Please complete the onboarding again.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  variant={editMode ? "outline" : "ghost"} 
                  size="sm" 
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : <Settings className="h-4 w-4" />}
                </Button>
              </div>
              {!editMode && (
                <CardDescription>Your personal air quality preferences</CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {editMode ? (
                // Edit Mode Form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name" 
                      placeholder="Your name" 
                      value={formData.name || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Your Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Your age (optional)" 
                      value={formData.age || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) || undefined }))} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="respiratory-issues">
                      Have respiratory issues?
                      <p className="text-xs text-muted-foreground mt-1">
                        (asthma, COPD, allergies)
                      </p>
                    </Label>
                    <Switch 
                      id="respiratory-issues" 
                      checked={formData.hasRespiratoryIssues || false} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasRespiratoryIssues: checked }))} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Air pollution sensitivity</Label>
                    <RadioGroup 
                      value={formData.sensitivityLevel || 'medium'}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        sensitivityLevel: value as 'low' | 'medium' | 'high' 
                      }))}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div>
                        <RadioGroupItem 
                          value="low" 
                          id="low" 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor="low" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <ThumbsUp className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Low</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="medium" 
                          id="medium" 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor="medium" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <ThumbsUp className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Medium</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="high" 
                          id="high" 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor="high" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <ThumbsUp className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">High</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.age ? `Age: ${user.age}` : 'No age provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Has respiratory issues</span>
                      <span className="font-medium">{user?.hasRespiratoryIssues ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sensitivity level</span>
                      <span className="font-medium capitalize">{user?.sensitivityLevel || 'Medium'}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            
            {editMode && (
              <CardFooter>
                <Button className="w-full" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* Home Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Home Location</CardTitle>
              <CardDescription>Set or update your home location</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                placeholder="Search for your home address"
              />
              
              {(user?.homeLocation || formData.homeLocation) && (
                <div className="h-40">
                  <Map 
                    initialCenter={formData.homeLocation || user?.homeLocation}
                    markers={formData.homeLocation ? [formData.homeLocation] : user?.homeLocation ? [user.homeLocation] : []}
                    className="h-full"
                  />
                </div>
              )}
            </CardContent>

            {formData.homeLocation && formData.homeLocation !== user?.homeLocation && (
              <CardFooter>
                <Button className="w-full" onClick={() => {
                  setHomeLocation(formData.homeLocation!);
                  toast({
                    title: "Home Location Updated",
                    description: "Your home location has been saved.",
                  });
                  setFormData(prev => ({ ...prev, homeLocation: undefined }));
                }}>
                  Update Home Location
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* Trial Version Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <CardTitle>Trial Version</CardTitle>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Limited Credits
                </Badge>
              </div>
              <CardDescription>
                You are using the trial version of AirAble
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Credits</span>
                  <span className="text-lg font-bold text-blue-600">{user?.airCredits || 0}/3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cost per Route Search</span>
                  <span className="text-sm">1 credit</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-blue-50/50 border-t">
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Trial Credits: {user?.airCredits || 0}/3
                </p>
                <p className="text-xs mt-1">
                  This is a trial version with limited credits.
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* App Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleResetProfile}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Reset Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
