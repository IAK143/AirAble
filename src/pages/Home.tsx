import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { AirQualityData, Location, WeatherData } from '@/types';
import { fetchAirQuality, fetchWeather } from '@/services/api';
import HomeLocation from '@/components/home/HomeLocation';
import HomeStats from '@/components/home/HomeStats';
import HomeActions from '@/components/home/HomeActions';
import HomeAlert from '@/components/home/HomeAlert';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Smartphone } from 'lucide-react';

const Home = () => {
  const { user } = useUser();
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const fetchData = async (location: Location) => {
    setLoading(true);
    try {
      const [aqData, weatherData] = await Promise.all([
        fetchAirQuality(location.lat, location.lng),
        fetchWeather(location.lat, location.lng)
      ]);
      
      if (aqData) setAirQuality(aqData);
      if (weatherData) setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.homeLocation) {
      console.log("Using home location:", user.homeLocation);
      fetchData(user.homeLocation);
      setUserLocation(user.homeLocation);
    } else {
      console.log("Attempting to get user's current location");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Got user location:", currentLocation);
          setUserLocation(currentLocation);
          fetchData(currentLocation);
        },
        (error) => {
          console.error('Error getting user location:', error);
          const defaultLocation = { lat: 40.7128, lng: -74.0060 };
          console.log("Using default location:", defaultLocation);
          setUserLocation(defaultLocation);
          fetchData(defaultLocation);
        }
      );
    }
  }, [user?.homeLocation]);

  const handleRefresh = async () => {
    if (!userLocation) return;
    
    setRefreshing(true);
    await fetchData(userLocation);
    setRefreshing(false);
  };

  return (
    <div className="container mx-auto pb-20 px-4">
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex items-center gap-2 text-blue-800">
          <span>This is a beta version under development. The final app will have enhanced features and better performance.</span>
          <Smartphone className="h-4 w-4" />
          <span>Android app coming soon!</span>
        </AlertDescription>
      </Alert>

      <div className="pt-8 pb-4">
        <h1 className="text-2xl font-bold">
          Hello, {user?.name || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          Here's your air quality update for today.
        </p>
      </div>
      
      <div className="space-y-5">
        <HomeLocation 
          userLocation={userLocation} 
          refreshing={refreshing} 
          onRefresh={handleRefresh}
        />
        
        <HomeStats 
          airQuality={airQuality} 
          weather={weather} 
          loading={loading}
        />
        
        <HomeActions />
        
        <HomeAlert airQuality={airQuality} />
      </div>
    </div>
  );
};

export default Home;
