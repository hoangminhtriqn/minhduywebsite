import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ThemeController from "@/components/ThemeController";
import ZaloContact from "@/components/ZaloContact";
import FacebookMessage from "@/components/FacebookMessage";

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Simple layout structure
  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff",
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    margin: 0,
    padding: 0,
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <main style={mainContentStyle}>{children}</main>
      <Footer />

      <FacebookMessage />
      <ZaloContact />
      <ThemeController />
    </div>
  );
};

export default MainLayout;
