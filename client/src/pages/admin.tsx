import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageSquare,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";

interface DisposalLocation {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  type: string;
  capacity: string;
  operatingHours: string;
  isActive: boolean;
}

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  eventType: string;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  feedbackType: string;
  location: string;
  message: string;
  isAnonymous: boolean;
  status: string;
  adminResponse: string;
  createdAt: string;
}

interface Stats {
  disposalPoints: number;
  monthlyWaste: string;
  recyclableRate: string;
  activeUsers: string;
}

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type: "general wastes",
    capacity: "medium",
    operatingHours: "24/7",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    eventType: "cleanup",
    maxParticipants: 50,
  });
  const [newStats, setNewStats] = useState({
    disposalPoints: 0,
    monthlyWaste: "0T",
    recyclableRate: "0%",
    activeUsers: "0",
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access the admin panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    document.title = "Admin Panel - UoP Science Faculty Waste Management";
  }, []);

  // Queries
  const { data: locations, isLoading: locationsLoading } = useQuery<
    DisposalLocation[]
  >({
    queryKey: ["/api/disposal-locations"],
    retry: false,
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    retry: false,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
    retry: false,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    retry: false,
  });

  // Mutations
  const createLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      await apiRequest("POST", "/api/disposal-locations", locationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disposal-locations"] });
      setNewLocation({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        type: "general wastes",
        capacity: "medium",
        operatingHours: "24/7",
      });
      toast({
        title: "Success",
        description: "Disposal location created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create disposal location.",
        variant: "destructive",
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: number) => {
      await apiRequest("DELETE", `/api/disposal-locations/${locationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disposal-locations"] });
      toast({
        title: "Success",
        description: "Disposal location deleted successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete disposal location.",
        variant: "destructive",
      });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      await apiRequest("POST", "/api/events", eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setNewEvent({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        eventType: "cleanup",
        maxParticipants: 50,
      });
      toast({
        title: "Success",
        description: "Event created successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Event creation error:", error);
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      // Try to extract more specific error message
      let errorMessage = "Failed to create event.";
      if (error.message && error.message.includes("Invalid data")) {
        errorMessage = "Please check all required fields and try again.";
      }
      if (error.response?.data?.errors) {
        errorMessage = `Validation errors: ${error.response.data.errors
          .map((e: any) => e.message)
          .join(", ")}`;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (statsData: any) => {
      await apiRequest("PUT", "/api/stats", statsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Statistics updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update statistics.",
        variant: "destructive",
      });
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      adminResponse,
    }: {
      id: number;
      status: string;
      adminResponse?: string;
    }) => {
      await apiRequest("PUT", `/api/feedback/${id}`, { status, adminResponse });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Success",
        description: "Feedback status updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update feedback status.",
        variant: "destructive",
      });
    },
  });

  // Initialize stats from current data
  useEffect(() => {
    if (stats) {
      setNewStats({
        disposalPoints: stats.disposalPoints || 0,
        monthlyWaste: stats.monthlyWaste || "0T",
        recyclableRate: stats.recyclableRate || "0%",
        activeUsers: stats.activeUsers || "0",
      });
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-forest">Admin Panel</h1>
                <p className="text-xs text-university">
                  Waste Management Portal
                </p>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = "/api/logout")}
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="locations">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Disposal Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Disposal Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, name: e.target.value })
                      }
                      placeholder="Location name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newLocation.type}
                      onValueChange={(value) =>
                        setNewLocation({ ...newLocation, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general wastes">
                          General Wastes (food, plastic, polythene)
                        </SelectItem>
                        <SelectItem value="chemical wastes">
                          Chemical Wastes
                        </SelectItem>
                        <SelectItem value="paper wastes">
                          Paper Wastes
                        </SelectItem>
                        <SelectItem value="e wastes">E Wastes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={newLocation.latitude}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          latitude: e.target.value,
                        })
                      }
                      placeholder="7.2558"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={newLocation.longitude}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          longitude: e.target.value,
                        })
                      }
                      placeholder="80.5944"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Select
                      value={newLocation.capacity}
                      onValueChange={(value) =>
                        setNewLocation({ ...newLocation, capacity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hours">Operating Hours</Label>
                    <Input
                      id="hours"
                      value={newLocation.operatingHours}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          operatingHours: e.target.value,
                        })
                      }
                      placeholder="24/7"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newLocation.description}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description of disposal location"
                  />
                </div>
                <Button
                  onClick={() => createLocationMutation.mutate(newLocation)}
                  disabled={
                    createLocationMutation.isPending ||
                    !newLocation.name ||
                    !newLocation.latitude ||
                    !newLocation.longitude
                  }
                  className="bg-forest hover:bg-eco"
                >
                  {createLocationMutation.isPending
                    ? "Creating..."
                    : "Create Location"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Disposal Locations</CardTitle>
              </CardHeader>
              <CardContent>
                {locationsLoading ? (
                  <div>Loading locations...</div>
                ) : (
                  <div className="space-y-4">
                    {locations?.map((location: DisposalLocation) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">{location.name}</h4>
                          <p className="text-sm text-gray-600">
                            {location.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              variant={
                                location.type === "general wastes"
                                  ? "outline"
                                  : location.type === "chemical wastes"
                                  ? "destructive"
                                  : location.type === "paper wastes"
                                  ? "secondary"
                                  : location.type === "e wastes"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {location.type}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Capacity: {location.capacity}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteLocationMutation.mutate(location.id)
                          }
                          disabled={deleteLocationMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!locations || locations.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No disposal locations found. Add your first location
                        above.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventTitle">Title</Label>
                    <Input
                      id="eventTitle"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventType">Type</Label>
                    <Select
                      value={newEvent.eventType}
                      onValueChange={(value) =>
                        setNewEvent({ ...newEvent, eventType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cleanup">Cleanup</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eventDate">Date & Time</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      value={newEvent.eventDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, eventDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input
                      id="eventLocation"
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                      placeholder="Event location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          maxParticipants: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Event description"
                  />
                </div>
                <Button
                  onClick={() => {
                    console.log("Form data:", newEvent);
                    const eventData = {
                      title: newEvent.title,
                      description: newEvent.description || null,
                      eventDate: new Date(newEvent.eventDate).toISOString(),
                      location: newEvent.location || null,
                      eventType: newEvent.eventType,
                      maxParticipants: newEvent.maxParticipants || null,
                    };
                    console.log("Sending data:", eventData);
                    createEventMutation.mutate(eventData);
                  }}
                  disabled={
                    createEventMutation.isPending ||
                    !newEvent.title ||
                    !newEvent.eventDate
                  }
                  className="bg-forest hover:bg-eco"
                >
                  {createEventMutation.isPending
                    ? "Creating..."
                    : "Create Event"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Events</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div>Loading events...</div>
                ) : (
                  <div className="space-y-4">
                    {events?.map((event: Event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {event.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge>{event.eventType}</Badge>
                              <span className="text-sm text-gray-500">
                                {event.currentParticipants}/
                                {event.maxParticipants} participants
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(event.eventDate).toLocaleDateString()}{" "}
                              at {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!events || events.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No events found. Add your first event above.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback & Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackLoading ? (
                  <div>Loading feedback...</div>
                ) : (
                  <div className="space-y-4">
                    {feedback?.map((item: Feedback) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {item.isAnonymous ? "Anonymous" : item.name}
                            </h4>
                            {!item.isAnonymous && (
                              <p className="text-sm text-gray-600">
                                {item.email}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                item.feedbackType === "complaint"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {item.feedbackType}
                            </Badge>
                            <Badge
                              variant={
                                item.status === "pending"
                                  ? "secondary"
                                  : item.status === "reviewed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {item.message}
                        </p>
                        {item.location && (
                          <p className="text-sm text-gray-500 mb-2">
                            Location: {item.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        {item.status === "pending" && (
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                updateFeedbackMutation.mutate({
                                  id: item.id,
                                  status: "reviewed",
                                })
                              }
                              disabled={updateFeedbackMutation.isPending}
                            >
                              Mark as Reviewed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateFeedbackMutation.mutate({
                                  id: item.id,
                                  status: "resolved",
                                })
                              }
                              disabled={updateFeedbackMutation.isPending}
                            >
                              Mark as Resolved
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!feedback || feedback.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No feedback submissions found.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disposalPoints">Disposal Points</Label>
                    <Input
                      id="disposalPoints"
                      type="number"
                      value={newStats.disposalPoints}
                      onChange={(e) =>
                        setNewStats({
                          ...newStats,
                          disposalPoints: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyWaste">Monthly Waste</Label>
                    <Input
                      id="monthlyWaste"
                      value={newStats.monthlyWaste}
                      onChange={(e) =>
                        setNewStats({
                          ...newStats,
                          monthlyWaste: e.target.value,
                        })
                      }
                      placeholder="2.4T"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recyclableRate">Recyclable Rate</Label>
                    <Input
                      id="recyclableRate"
                      value={newStats.recyclableRate}
                      onChange={(e) =>
                        setNewStats({
                          ...newStats,
                          recyclableRate: e.target.value,
                        })
                      }
                      placeholder="68%"
                    />
                  </div>
                  <div>
                    <Label htmlFor="activeUsers">Active Users</Label>
                    <Input
                      id="activeUsers"
                      value={newStats.activeUsers}
                      onChange={(e) =>
                        setNewStats({
                          ...newStats,
                          activeUsers: e.target.value,
                        })
                      }
                      placeholder="1.2K"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => updateStatsMutation.mutate(newStats)}
                  disabled={updateStatsMutation.isPending}
                  className="bg-forest hover:bg-eco"
                >
                  {updateStatsMutation.isPending
                    ? "Updating..."
                    : "Update Statistics"}
                </Button>
              </CardContent>
            </Card>

            {!statsLoading && stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-forest mb-2">
                        {stats.disposalPoints}
                      </div>
                      <p className="text-gray-600">Disposal Points</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-eco mb-2">
                        {stats.monthlyWaste}
                      </div>
                      <p className="text-gray-600">Monthly Waste</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning mb-2">
                        {stats.recyclableRate}
                      </div>
                      <p className="text-gray-600">Recyclable Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-university mb-2">
                        {stats.activeUsers}
                      </div>
                      <p className="text-gray-600">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
