import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import InteractiveMap from "@/components/map/interactive-map";
import Information from "@/components/sections/information";
import Events from "@/components/sections/events";
import Feedback from "@/components/sections/feedback";
import Footer from "@/components/sections/footer";

export default function Home() {
  useEffect(() => {
    // Set page title and meta description
    document.title = "Home - UoP Science Faculty Waste Management Portal";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Access your personalized waste management dashboard. Manage disposal locations, track environmental impact, and stay updated on University sustainability initiatives."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Access your personalized waste management dashboard. Manage disposal locations, track environmental impact, and stay updated on University sustainability initiatives.";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar showAdminButton={true} />
      <Hero />
      <Stats />
      <section id="map">
        <InteractiveMap />
      </section>
      <section id="info">
        <Information />
      </section>
      <section id="events">
        <Events />
      </section>
      <section id="feedback">
        <Feedback />
      </section>
      <Footer />
    </div>
  );
}
