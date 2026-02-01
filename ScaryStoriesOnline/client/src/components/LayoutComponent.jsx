import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom"; // For React Router v6+

function LayoutComponent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <NavigationBar />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutComponent;
