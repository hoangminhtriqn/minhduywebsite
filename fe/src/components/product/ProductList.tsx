import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;
  const isLargeDesktop = windowWidth > 1400;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive CSS-in-JS Styles
  const containerStyle: React.CSSProperties = {
    display: "grid",
    gap: isMobile ? "16px" : isTablet ? "20px" : "24px",
    padding: isMobile ? "16px" : isTablet ? "20px" : "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const loadingContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    padding: "40px 20px",
  };

  const spinnerStyle: React.CSSProperties = {
    width: isMobile ? "40px" : "48px",
    height: isMobile ? "40px" : "48px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #0066B1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const errorContainerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#dc2626",
    padding: isMobile ? "32px 16px" : "40px 20px",
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: isMobile ? "16px" : "18px",
    fontWeight: "500",
    marginBottom: "8px",
  };

  const errorDetailStyle: React.CSSProperties = {
    fontSize: isMobile ? "14px" : "16px",
    opacity: 0.8,
  };

  const emptyContainerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#666666",
    padding: isMobile ? "32px 16px" : "40px 20px",
  };

  const emptyTextStyle: React.CSSProperties = {
    fontSize: isMobile ? "16px" : "18px",
    fontWeight: "500",
  };

  // Dynamic grid columns based on screen size
  const getGridColumns = () => {
    if (isLargeDesktop) return "repeat(4, 1fr)";
    if (isDesktop) return "repeat(3, 1fr)";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(1, 1fr)";
  };

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <p style={errorTextStyle}>Có lỗi xảy ra khi tải danh sách sản phẩm</p>
        <p style={errorDetailStyle}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <p style={emptyTextStyle}>Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div
      style={{
        ...containerStyle,
        gridTemplateColumns: getGridColumns(),
      }}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
