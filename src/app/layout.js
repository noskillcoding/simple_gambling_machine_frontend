// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css"; // Imports Tailwind CSS styles

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Simple Gambling Machine dApp", // Our updated title
  description: "A decentralized gambling machine on Ethereum.", // Our updated description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 'children' will be the content of your page.js or other pages */}
        {children}
      </body>
    </html>
  );
}