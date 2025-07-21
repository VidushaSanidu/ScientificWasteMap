import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Calendar,
  Users,
  Sprout,
  Lightbulb,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  eventType: string;
  maxParticipants: number;
  currentParticipants: number;
}

export default function Events() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    retry: false,
  });

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("POST", `/api/events/${eventId}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "You have successfully joined the event!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join event. It may be full or unavailable.",
        variant: "destructive",
      });
    },
  });

  const getBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case "cleanup":
        return "default";
      case "workshop":
        return "secondary";
      case "competition":
        return "outline";
      default:
        return "default";
    }
  };

  const getButtonColor = (eventType: string) => {
    switch (eventType) {
      case "cleanup":
        return "bg-forest hover:bg-green-800";
      case "workshop":
        return "bg-university hover:bg-blue-800";
      case "competition":
        return "bg-warning text-text-dark hover:bg-yellow-500";
      default:
        return "bg-forest hover:bg-green-800";
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Events & Initiatives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our waste management activities and university society
              initiatives for a cleaner University
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark mb-4">
            Events & Initiatives
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our waste management activities and university society
            initiatives for a cleaner University
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events && events.length > 0 ? (
            events.map((event: Event) => (
              <Card
                key={event.id}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={
                    event.eventType === "cleanup"
                      ? "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                      : event.eventType === "workshop"
                      ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                      : "https://images.unsplash.com/photo-1596568359553-a56de6970068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  }
                  alt={`${event.eventType} event`}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Badge
                      variant={getBadgeVariant(event.eventType)}
                      className="mr-2"
                    >
                      {event.eventType.charAt(0).toUpperCase() +
                        event.eventType.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {event.currentParticipants}/{event.maxParticipants}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => joinEventMutation.mutate(event.id)}
                        disabled={
                          joinEventMutation.isPending ||
                          event.currentParticipants >= event.maxParticipants
                        }
                        className={`${getButtonColor(
                          event.eventType
                        )} transition-colors text-sm`}
                      >
                        {event.currentParticipants >= event.maxParticipants
                          ? "Full"
                          : joinEventMutation.isPending
                          ? "Joining..."
                          : event.eventType === "workshop"
                          ? "Register"
                          : event.eventType === "competition"
                          ? "Participate"
                          : "Join Event"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No events currently scheduled. Check back soon for upcoming
              activities!
            </div>
          )}
        </div>

        {/* University Societies Section */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-text-dark text-center mb-8">
              University Societies & Partners
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 hover:bg-bg-light rounded-lg transition-colors">
                <div className="bg-forest text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Environmental Society
                </h4>
                <p className="text-sm text-gray-600">
                  Leading University sustainability initiatives
                </p>
              </div>
              <div className="text-center p-4 hover:bg-bg-light rounded-lg transition-colors">
                <div className="bg-eco text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Innovation Club
                </h4>
                <p className="text-sm text-gray-600">
                  Developing eco-friendly solutions
                </p>
              </div>
              <div className="text-center p-4 hover:bg-bg-light rounded-lg transition-colors">
                <div className="bg-university text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Volunteer Corps
                </h4>
                <p className="text-sm text-gray-600">
                  Community service and outreach
                </p>
              </div>
              <div className="text-center p-4 hover:bg-bg-light rounded-lg transition-colors">
                <div className="bg-warning text-text-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Student Union
                </h4>
                <p className="text-sm text-gray-600">
                  Coordinating University-wide programs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
