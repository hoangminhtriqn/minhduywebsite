import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import ThemeController from "@/components/ThemeController";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();

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
      <ThemeController />
    </div>
  );
};

export default MainLayout;
