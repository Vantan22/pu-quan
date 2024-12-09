import { Menu } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  FireOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Sơ đồ bàn",
    },
    {
      key: "/menu-management",
      icon: <AppstoreOutlined />,
      label: "Quản lý menu",
    },
    {
      key: "/kitchen",
      icon: <FireOutlined />,
      label: "Màn hình bếp",
    },
    {
      key: "/inventory",
      icon: <InboxOutlined />,
      label: "Quản lý kho",
    },
  ];

  return (
    <div className="h-full bg-white">
      {!collapsed && (
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-lg font-bold">Quản lý nhà hàng</h1>
        </div>
      )}

      <Menu
        mode="inline"
        defaultSelectedKeys={["/"]}
        inlineIndent={24}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />

      <div className="absolute bottom-0 w-full border-t">
        <Menu
          mode="inline"
          selectedKeys={[]}
          items={[
            {
              key: "user",
              icon: <UserOutlined />,
              label: "Admin",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Navbar;
