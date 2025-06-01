// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Simple Gambling Machine",
  description: "A decentralized gambling machine on Ethereum.",
  // NO 'icons' field here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Manually add the relative link */}
        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
      </head>
      <body> 
        {children}
      </body>
    </html>
  );
}