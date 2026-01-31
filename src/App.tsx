import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { CuratedRooms } from "./components/CuratedRooms";
import { AmenitiesReviews } from "./components/AmenitiesReviews";
import { Reviews } from "./components/Reviews";
import { Contact } from "./components/Contact";
import { MapStrip } from "./components/MapStrip";
import { Footer } from "./components/Footer";
import { CookieNotice } from "./components/CookieNotice";

export default function App() {
  return (
    <Layout>
      <a id="top" />

      {/* Navbar is already inside Hero */}
      <Hero />

      <main>
        {/* Rooms section already wrapped in Section */}
        <CuratedRooms />

        <AmenitiesReviews />

        <Reviews />

        <Contact />

        <MapStrip />
        <Footer />
        <CookieNotice />
      </main>
    </Layout>
  );
}
