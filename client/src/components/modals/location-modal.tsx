import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Info, Navigation } from "lucide-react";

interface DisposalLocation {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  type: string;
  capacity: string;
  operatingHours: string;
}

interface LocationModalProps {
  location: DisposalLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ location, isOpen, onClose }: LocationModalProps) {
  const getDirections = () => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'recyclable': return 'default';
      case 'organic': return 'secondary';
      case 'general': return 'outline';
      default: return 'default';
    }
  };

  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-forest" />
            {location.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Badge variant={getBadgeVariant(location.type)} className="mb-2">
              {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
            </Badge>
            <p className="text-gray-600">{location.description}</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-forest" />
              <span>Available: {location.operatingHours}</span>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-forest" />
              <span>Capacity: {location.capacity.charAt(0).toUpperCase() + location.capacity.slice(1)}</span>
            </div>
          </div>
          
          <Button
            onClick={getDirections}
            className="w-full bg-forest text-white hover:bg-green-800 transition-colors"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
