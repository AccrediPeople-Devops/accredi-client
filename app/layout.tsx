import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "./context/LocationContext";
import GlobalLoaderWrapper from "./components/GlobalLoaderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AccrediPeople Certifications – Professional Certification Training Provider",
  description: "Advance your career with globally recognized certification programs designed for professionals across diverse industries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalLoaderWrapper />
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
