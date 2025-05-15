
import { Button } from '@/components/ui/button';
import { Navigation, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeActions = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link to="/route" className="no-underline">
        <Button 
          className="h-24 w-full"
          variant="outline"
        >
          <div className="flex flex-col items-center">
            <Navigation className="h-6 w-6 mb-2" />
            <span>Find Clean Route</span>
          </div>
        </Button>
      </Link>
      
      <Link to="/map" className="no-underline">
        <Button 
          className="h-24 w-full"
          variant="outline"
        >
          <div className="flex flex-col items-center">
            <MapPin className="h-6 w-6 mb-2" />
            <span>Air Quality Map</span>
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default HomeActions;
