import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { CuratedRooms } from "./components/CuratedRooms";
import { AmenitiesReviews } from "./components/AmenitiesReviews";
import { Reviews } from "./components/Reviews";
import { Contact } from "./components/Contact";
import { MapStrip } from "./components/MapStrip";
import { Footer } from "./components/Footer";
import { CookieNotice } from "./components/CookieNotice";

export default function PublicHome() {
  return (
    <Layout>
      <a id="top" />

      <Hero />

      <main>
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
