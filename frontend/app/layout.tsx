import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseX",
  description: "AI powered news intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body
        className="
          min-h-full
          bg-[#05010d]
          text-white
          overflow-hidden
        "
      >
        {children}
      </body>
    </html>
  );
}