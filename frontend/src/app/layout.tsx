import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Health Insurance Claims",
  description: "Automated claim validation and fraud risk scoring",
  metadataBase: new URL("https://health-claim-system-ccp.vercel.app"),
  keywords: [
    "health insurance",
    "claims auditing",
    "clinical policy validation",
    "fraud detection",
    "insurance automation",
  ],
  authors: [{ name: "SmartHealth Enterprise Development Team" }],
  creator: "SmartHealth",
  publisher: "SmartHealth Systems",
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
  openGraph: {
    title: "Smart Health Insurance Claims Processing & Audit Portal",
    description: "Enterprise validation, real-time clinical policy audits, and machine-learning fraud analysis.",
    url: "https://health-claim-system-ccp.vercel.app",
    siteName: "SmartHealth",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartHealth Claim Auditing System Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Health Insurance Claims Processing & Audit Portal",
    description: "Enterprise validation, real-time clinical policy audits, and machine-learning fraud analysis.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">{children}</body>
    </html>
  );
}
