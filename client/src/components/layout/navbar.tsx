import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import { Link } from "wouter";

interface NavbarProps {
  showAdminButton: boolean;
}

export default function Navbar({ showAdminButton }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-forest">TRASH TRACK</h1>
                <p className="text-xs font-semibold  text-text-dark">
                  Waste Management Portal |{" "}
                  <span className="font-semibold">
                    University of Peradeniya
                  </span>
                </p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-text-dark hover:text-forest font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("map")}
                className="text-text-dark hover:text-forest font-medium transition-colors"
              >
                Map
              </button>
              <button
                onClick={() => scrollToSection("info")}
                className="text-text-dark hover:text-forest font-medium transition-colors"
              >
                Information
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-text-dark hover:text-forest font-medium transition-colors"
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection("feedback")}
                className="text-text-dark hover:text-forest font-medium transition-colors"
              >
                Feedback
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {showAdminButton && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex border-green-800 text-gray-800 hover:bg-green-800 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-text-dark hover:text-forest"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-forest">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-text-dark hover:text-forest"
                >
                  <X />
                </button>
              </div>
              <nav className="space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="block w-full text-left py-2 text-text-dark hover:text-forest font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("map")}
                  className="block w-full text-left py-2 text-text-dark hover:text-forest font-medium"
                >
                  Map
                </button>
                <button
                  onClick={() => scrollToSection("info")}
                  className="block w-full text-left py-2 text-text-dark hover:text-forest font-medium"
                >
                  Information
                </button>
                <button
                  onClick={() => scrollToSection("events")}
                  className="block w-full text-left py-2 text-text-dark hover:text-forest font-medium"
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection("feedback")}
                  className="block w-full text-left py-2 text-text-dark hover:text-forest font-medium"
                >
                  Feedback
                </button>
                {showAdminButton && (
                  <Link href="/admin">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left py-2 text-university hover:text-forest font-medium"
                    >
                      <Settings className="h-4 w-4 mr-2 inline" />
                      Admin Panel
                    </button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
