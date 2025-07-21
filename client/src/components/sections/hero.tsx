import { Button } from "@/components/ui/button";
import { MapPin, BookOpen } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="bg-gradient-to-r from-forest to-eco text-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Waste Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find disposal facilities, learn sustainable practices, and
            contribute to a cleaner University environment
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={() => scrollToSection("map")}
              className="bg-warning text-text-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              size="lg"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Find Disposal Points
            </Button>
            <Button
              onClick={() => scrollToSection("info")}
              variant="outline"
              className="border-2 border-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-forest transition-colors"
              size="lg"
            >
              <BookOpen className="h-5 w-5 mr-2 " />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
