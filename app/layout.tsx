import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "./context/LocationContext";
import GlobalLoaderWrapper from "./components/GlobalLoaderWrapper";
import StructuredData from "./components/StructuredData";
import ContextMenuProvider from "./components/ContextMenuProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://accredipeoplecertifications.com'),
  title: "AccrediPeople Certifications – Professional Certification Training Provider",
  description: "Advance your career with globally recognized certification programs designed for professionals across diverse industries.",
  keywords: "PMP certification, project management, corporate training, professional certification, unemployed discount, contact us",
  icons: {
    icon: [
      { url: "/Logo/full_coverphoto_black_white.png", sizes: "32x32", type: "image/png" },
      { url: "/Logo/full_coverphoto_black_white.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/Logo/full_coverphoto_black_white.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/Logo/full_coverphoto_black_white.png" },
    ],
  },
  openGraph: {
    title: "AccrediPeople Certifications – Professional Certification Training Provider",
    description: "We're committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today's competitive landscape.",
    url: "https://accredipeoplecertifications.com",
    siteName: "AccrediPeople Certifications",
    type: "website",
    images: [
      {
        url: "/Logo/full_coverphoto_black_white.png",
        width: 1200,
        height: 630,
        alt: "AccrediPeople Certifications Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccrediPeople Certifications – Professional Certification Training Provider",
    description: "We're committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today's competitive landscape.",
    images: ["/Logo/full_coverphoto_black_white.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo/full_coverphoto_black_white.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Logo/full_coverphoto_black_white.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Logo/full_coverphoto_black_white.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/Logo/full_coverphoto_black_white.png" type="image/png" />
        
        <StructuredData type="Organization" data={{}} />
        <StructuredData type="WebSite" data={{}} />
      </head>
      <body className={inter.className}>
        <GlobalLoaderWrapper />
        <LocationProvider>
          <ContextMenuProvider>
            {children}
          </ContextMenuProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
