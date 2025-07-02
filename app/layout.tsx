import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "./context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Accredi",
  description: "Accredi - Your Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
