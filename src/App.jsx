import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import viVN from "antd/locale/vi_VN";
import { MessageProvider } from "@/providers/MessageProvider";

const App = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          wireframe: false,
          colorPrimary: "#fa8c16",
          colorInfo: "#fa8c16",
          fontSize: 14,
        },
      }}
    >
      <MessageProvider>
        <RouterProvider router={router} />
      </MessageProvider>
    </ConfigProvider>
  );
};

export default App;
