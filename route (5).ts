import type { Metadata, Viewport } from "next";
import { PWARegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ALIANCA",
    template: "%s | ALIANCA"
  },
  description: "Fortaleca sua fe. Proteja seu relacionamento.",
  applicationName: "ALIANCA",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/alianca-logo.png",
    apple: "/brand/alianca-logo.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#7A2348",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
