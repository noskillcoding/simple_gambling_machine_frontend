// src/app/layout.js
// import { Inter } from 'next/font/google'; // <--- REMOVE or COMMENT OUT this line
import "./globals.css";
import { ThemeProvider } from '../contexts/ThemeContext';

// const inter = Inter({ subsets: ["latin"] }); // <--- REMOVE or COMMENT OUT this line

export const metadata = {
  title: "Simple Gambling Machine",
  description: "A decentralized gambling machine on Ethereum.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove inter.className from here: */}
      <body> 
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}