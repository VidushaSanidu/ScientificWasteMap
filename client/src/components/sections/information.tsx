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
              management on University
            </p>
          </div>

          {/* University Waste Management System - Full Width Featured Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="bg-yellow-500 text-white w-20 h-20 rounded-full flex items-center justify-center mr-6">
                        <Building2 className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-text-dark mb-2">
                          University Waste Management System
                        </h3>
                        <p className="text-gray-500 font-semibold text-lg">
                          University of Peradeniya
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                      Discover the comprehensive waste management system at the
                      University of Peradeniya. Our integrated approach covers
                      collection, processing, and disposal methods designed for
                      educational institutions. Learn about our sustainable
                      practices, waste reduction initiatives, and how we manage
                      diverse waste streams across University facilities.
                    </p>
                    <Button
                      onClick={() => showInfoModal("university")}
                      className="bg-yellow-500 text-gray-800 hover:bg-yellow-600 transition-colors text-lg px-8 py-3"
                    >
                      Explore University System
                    </Button>
                  </div>
                  <div>
                    <img
                      src="https://i.pinimg.com/736x/08/c9/03/08c9036921d9d670825e57d4805d8a5c.jpg"
                      alt="University waste management facility and operations"
                      className="rounded-xl w-full h-80 object-cover shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Waste Types Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-text-dark mb-2">
                Waste Categories
              </h3>
              <p className="text-gray-600">
                Specialized guidelines for different types of waste materials
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Chemical Wastes Card */}
              <Card className="bg-bg-light hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <img
                    src="https://i.pinimg.com/1200x/e5/c7/05/e5c70568d04fe1ee27865ccadc1743e6.jpg"
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
                    src="https://i.pinimg.com/1200x/30/8b/50/308b504cfd08a38e1b1ae3ef0e072325.jpg"
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
                    src="https://i.pinimg.com/1200x/de/3a/8d/de3a8d7798eb2e622498e9968b9d5d52.jpg"
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
                    src="https://i.pinimg.com/736x/70/02/84/700284ddbcf3c852353134ad4182d3d2.jpg"
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
                      sorting and disposal strategies for everyday University
                      waste.
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
          </div>

          {/* Best Practices Section */}
          <div className="bg-gradient-to-r from-forest to-eco text-white rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                University Best Practices
              </h3>
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
