import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "./components/MainNav";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3D gallery",
  description: "GLSL shader repository created by @samoz93 sameh zoaa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` ${inter.className} flex flex-row`}>
        <div className="flex-3">
          <MainNav />
        </div>
        <main className="w-full flex-10">{children}</main>
      </body>
    </html>
  );
}
