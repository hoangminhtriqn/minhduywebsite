import React from "react";
import { Skeleton, Layout } from "antd";
import { useTheme } from "../contexts/ThemeContext";
import HomePageSkeleton from "./HomePageSkeleton";

const { Header, Content, Footer } = Layout;

const AppSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background.primary,
      }}
    >
      {/* Header skeleton */}
      <Header
        style={{
          background: theme.colors.background.secondary,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Skeleton.Input
          active
          size="large"
          style={{
            width: 120,
            height: 40,
          }}
        />
        <div style={{ display: "flex", gap: "16px" }}>
          <Skeleton.Button
            active
            size="default"
            style={{ width: 80, height: 32 }}
          />
          <Skeleton.Button
            active
            size="default"
            style={{ width: 80, height: 32 }}
          />
          <Skeleton.Button
            active
            size="default"
            style={{ width: 80, height: 32 }}
          />
          <Skeleton.Button
            active
            size="default"
            style={{ width: 80, height: 32 }}
          />
        </div>
      </Header>

      {/* Content skeleton */}
      <Content>
        <HomePageSkeleton />
      </Content>

      {/* Footer skeleton */}
      <Footer
        style={{
          background: theme.colors.background.secondary,
          textAlign: "center",
          padding: "24px",
        }}
      >
        <Skeleton.Input
          active
          size="default"
          style={{
            width: 300,
            height: 20,
          }}
        />
      </Footer>
    </Layout>
  );
};

export default AppSkeleton;
