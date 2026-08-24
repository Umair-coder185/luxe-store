import AnnouncementBar from "@/components/storefront/layout/AnnouncementBar";
import Navbar from "@/components/storefront/layout/Navbar";
import Footer from "@/components/storefront/layout/Footer";

export const metadata = {
  title: "LUXE | Premium Ecommerce",
  description: "Luxury fashion and lifestyle.",
};

export default function StorefrontLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
