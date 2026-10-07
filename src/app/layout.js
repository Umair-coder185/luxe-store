import { Montserrat, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SessionProvider } from '@/providers/SessionProvider';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-logo",
});

export const metadata = {
  title: "LUXE Store",
  description: "Premium ecommerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}