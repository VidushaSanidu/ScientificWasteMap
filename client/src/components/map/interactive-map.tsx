import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Target, Recycle, Leaf, Trash2, List } from "lucide-react";
import LocationModal from "@/components/modals/location-modal";

declare global {
  interface Window {
    L: any;
  }
}

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

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<DisposalLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { data: locations, isLoading } = useQuery<DisposalLocation[]>({
    queryKey: ["/api/disposal-locations"],
    retry: false,
  });

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Load CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          setIsMapLoaded(true);
        };
        document.head.appendChild(script);
      } else if (window.L) {
        setIsMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstanceRef.current) {
      const L = window.L;

      // University of Peradeniya coordinates
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [7.2558, 80.5944],
        16
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }
  }, [isMapLoaded]);

  // Update markers when locations change
  useEffect(() => {
    if (mapInstanceRef.current && locations && isMapLoaded) {
      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add new markers
      locations.forEach((location: DisposalLocation) => {
        if (shouldShowLocation(location)) {
          addMarkerToMap(location);
        }
      });
    }
  }, [locations, currentFilter, searchTerm, isMapLoaded]);

  const shouldShowLocation = (location: DisposalLocation) => {
    const matchesFilter =
      currentFilter === "all" || location.type === currentFilter;
    const matchesSearch =
      searchTerm === "" ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  };

  const addMarkerToMap = (location: DisposalLocation) => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const marker = L.marker([lat, lng])
      .bindPopup(
        `
        <div style="padding: 8px;">
          <h4 style="font-weight: 600; margin-bottom: 4px;">${
            location.name
          }</h4>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${
            location.description || ""
          }</p>
          <button onclick="window.showLocationDetails(${location.id})" 
                  style="background: #1B5E20; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
            View Details
          </button>
        </div>
      `
      )
      .addTo(mapInstanceRef.current);

    markersRef.current.push(marker);
  };

  // Global function for popup buttons
  useEffect(() => {
    (window as any).showLocationDetails = (locationId: number) => {
      const location = locations?.find(
        (loc: DisposalLocation) => loc.id === locationId
      );
      if (location) {
        setSelectedLocation(location);
        setIsLocationModalOpen(true);
      }
    };

    return () => {
      delete (window as any).showLocationDetails;
    };
  }, [locations]);

  const toggleFilter = (filterType: string) => {
    setCurrentFilter(filterType);
  };

  const centerMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([7.2558, 80.5944], 16);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "general wastes":
        return "bg-gray-500";
      case "chemical wastes":
        return "bg-red-600";
      case "paper wastes":
        return "bg-blue-600";
      case "e wastes":
        return "bg-purple-600";
      default:
        return "bg-forest";
    }
  };

  const getFilterIcon = (type: string) => {
    switch (type) {
      case "general wastes":
        return <Trash2 className="h-4 w-4 mr-2" />;
      case "chemical wastes":
        return <Search className="h-4 w-4 mr-2" />; // Using search as chemical icon
      case "paper wastes":
        return <List className="h-4 w-4 mr-2" />; // Using list as paper icon
      case "e wastes":
        return <Target className="h-4 w-4 mr-2" />; // Using target as electronics icon
      default:
        return <List className="h-4 w-4 mr-2" />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Campus Disposal Map
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Locate waste disposal facilities across the Faculty of Science
              campus with our interactive map system
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Campus Disposal Map
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Locate waste disposal facilities across the Faculty of Science
              campus with our interactive map system
            </p>
          </div>

          {/* Filter Controls */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => toggleFilter("all")}
                    variant={currentFilter === "all" ? "default" : "outline"}
                    className={
                      currentFilter === "all"
                        ? "bg-forest hover:bg-eco"
                        : "border-forest text-forest hover:bg-forest hover:text-white"
                    }
                  >
                    {getFilterIcon("all")}All Types
                  </Button>
                  <Button
                    onClick={() => toggleFilter("general wastes")}
                    variant={
                      currentFilter === "general wastes" ? "default" : "outline"
                    }
                    className={
                      currentFilter === "general wastes"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                    }
                  >
                    {getFilterIcon("general wastes")}General Wastes
                  </Button>
                  <Button
                    onClick={() => toggleFilter("chemical wastes")}
                    variant={
                      currentFilter === "chemical wastes"
                        ? "default"
                        : "outline"
                    }
                    className={
                      currentFilter === "chemical wastes"
                        ? "bg-red-600 hover:bg-red-700"
                        : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    }
                  >
                    {getFilterIcon("chemical wastes")}Chemical Wastes
                  </Button>
                  <Button
                    onClick={() => toggleFilter("paper wastes")}
                    variant={
                      currentFilter === "paper wastes" ? "default" : "outline"
                    }
                    className={
                      currentFilter === "paper wastes"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }
                  >
                    {getFilterIcon("paper wastes")}Paper Wastes
                  </Button>
                  <Button
                    onClick={() => toggleFilter("e wastes")}
                    variant={
                      currentFilter === "e wastes" ? "default" : "outline"
                    }
                    className={
                      currentFilter === "e wastes"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    }
                  >
                    {getFilterIcon("e wastes")}E Wastes
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-300 focus:ring-forest focus:border-transparent"
                  />
                  <Button className="bg-forest text-white hover:bg-green-800 transition-colors">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Container */}
          <Card>
            <CardContent className="p-6">
              <div
                ref={mapRef}
                className="leaflet-container"
                style={{ height: "500px", borderRadius: "0.75rem" }}
              />
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                    <span>General Wastes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                    <span>Chemical Wastes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                    <span>Paper Wastes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
                    <span>E Wastes</span>
                  </div>
                </div>
                <Button
                  onClick={centerMap}
                  variant="ghost"
                  className="text-forest hover:text-green-800"
                >
                  <Target className="h-4 w-4 mr-1" />
                  Center Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <LocationModal
        location={selectedLocation}
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
}
