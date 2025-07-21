import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Recycle,
  Leaf,
  Trash2,
  Heart,
  RotateCcw,
  Users,
  Building2,
} from "lucide-react";
import InfoModal from "@/components/modals/info-modal";

export default function Information() {
  const [selectedInfo, setSelectedInfo] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const showInfoModal = (type: string) => {
    setSelectedInfo(type);
    setIsInfoModalOpen(true);
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Waste Management Information
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn best practices and guidelines for sustainable waste
              management on campus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* University Waste Management System Card */}
            <Card className="bg-bg-light hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="University waste management facility and operations"
                  className="rounded-lg mb-6 w-full h-48 object-cover"
                />
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    University System
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn about the comprehensive waste management system at the
                    University of Peradeniya, including collection, processing,
                    and disposal methods.
                  </p>
                  <Button
                    onClick={() => showInfoModal("university")}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chemical Wastes Card */}
            <Card className="bg-bg-light hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Chemical waste handling and laboratory safety"
                  className="rounded-lg mb-6 w-full h-48 object-cover"
                />
                <div className="text-center">
                  <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    Chemical Wastes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Laboratory chemical waste requires special handling and
                    disposal. Learn about proper containment, labeling, and
                    disposal procedures for scientific waste materials.
                  </p>
                  <Button
                    onClick={() => showInfoModal("chemical")}
                    className="bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Paper Wastes Card */}
            <Card className="bg-bg-light hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Paper recycling and document disposal"
                  className="rounded-lg mb-6 w-full h-48 object-cover"
                />
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    Paper Wastes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Paper materials including documents, books, and cardboard
                    can be recycled effectively. Learn proper sorting and
                    preparation techniques for maximum recycling efficiency.
                  </p>
                  <Button
                    onClick={() => showInfoModal("paper")}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* E Wastes Card */}
            <Card className="bg-bg-light hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1567789884554-0b844b597180?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Electronic waste recycling and disposal"
                  className="rounded-lg mb-6 w-full h-48 object-cover"
                />
                <div className="text-center">
                  <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    E Wastes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Electronic devices and components require specialized
                    disposal to recover valuable materials and prevent
                    environmental harm. Learn about proper e-waste management
                    procedures.
                  </p>
                  <Button
                    onClick={() => showInfoModal("ewaste")}
                    className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* General Waste Card */}
            <Card className="bg-bg-light hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1594736797933-d0511ba8fe65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="General waste bins and disposal facilities"
                  className="rounded-lg mb-6 w-full h-48 object-cover"
                />
                <div className="text-center">
                  <div className="bg-gray-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    General Wastes
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Food waste, plastic items, and polythene materials that
                    require standard disposal methods. Learn about proper
                    sorting and disposal strategies for everyday campus waste.
                  </p>
                  <Button
                    onClick={() => showInfoModal("general")}
                    className="bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices Section */}
          <div className="bg-gradient-to-r from-forest to-eco text-white rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Campus Best Practices</h3>
              <p className="text-lg opacity-90">
                Simple actions that make a big difference
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Reduce First</h4>
                <p className="text-sm opacity-90">
                  Minimize waste generation before disposal
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Reuse Items</h4>
                <p className="text-sm opacity-90">
                  Find creative ways to extend item lifecycle
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Recycle Right</h4>
                <p className="text-sm opacity-90">
                  Sort materials according to guidelines
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Educate Others</h4>
                <p className="text-sm opacity-90">
                  Share knowledge with fellow students
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfoModal
        type={selectedInfo}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </>
  );
}
