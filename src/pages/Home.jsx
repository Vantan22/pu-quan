import React from "react";
import { Button } from "antd";
import { useMessage } from "@/providers/MessageProvider";
const Home = () => {
  const { showSuccess, showError } = useMessage();
  const handleClick = () => {
    showSuccess("This is a success message");
    showError("This is an error message");
  };
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Button type="primary" size="large" onClick={handleClick}>
        Primary Button
      </Button>
    </div>
  );
};

export default Home;
