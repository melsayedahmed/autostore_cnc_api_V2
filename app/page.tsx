import type { Metadata } from "next";
import HomePageClient from "../app/Home";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Browse Vehicle Parts | Auto Parts Finder",
  description: "Find vehicle types and browse auto parts easily.",
  openGraph: {
    title: "Browse Vehicle Parts",
    description: "Find vehicle types and browse auto parts easily.",
    url: "https://yourdomain.com",
    siteName: "Auto Parts Finder",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Auto Parts Finder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <HomePageClient />;
}
