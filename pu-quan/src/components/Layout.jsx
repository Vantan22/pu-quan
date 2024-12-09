import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Navbar from "@/components/Navbar";

const { Content, Sider } = AntLayout;

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AntLayout style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Mobile Header */}
      {isMobile && (
        <AntLayout.Header
          className="bg-white px-4 flex items-center justify-between fixed w-full z-20 shadow-md"
          style={{ height: "50px" }}
        >
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <h1 className="text-lg font-bold">Quản lý nhà hàng</h1>
          </div>
        </AntLayout.Header>
      )}

      <AntLayout style={{ overflow: "hidden" }}>
        {/* Sidebar Navigation */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={isMobile ? 0 : 80}
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          className={`
            h-screen
            ${isMobile ? (collapsed ? "hidden" : "block") : "block"}
            border-r border-gray-200
          `}
          style={{
            position: "fixed",
            left: 0,
            top: isMobile ? "50px" : 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <Navbar collapsed={collapsed} />
        </Sider>

        {/* Main Content */}
        <AntLayout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
            marginTop: isMobile ? 50 : 0,
            transition: "all 0.2s",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Content
            className="bg-gray-50"
            style={{
              height: "100%",
            }}
          >
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </Content>
        </AntLayout>
      </AntLayout>

      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[5]"
          onClick={() => setCollapsed(true)}
        />
      )}
    </AntLayout>
  );
}

export default Layout;
