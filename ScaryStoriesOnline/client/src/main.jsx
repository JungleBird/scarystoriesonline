import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import ScreenReaderComponent from "./components/ScreenReaderComponent.jsx";
import BookCardLibraryComponent from "./components/BookCardLibraryComponent.jsx";
import LayoutComponent from "./components/LayoutComponent.jsx";
import BookshelfComponent from "./components/BookshelfComponent.jsx";
import SubmissionsComponent from "./components/SubmissionsComponent.jsx";
import ProfileComponent from "./components/ProfileComponent.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router basename="/ScaryStoriesOnline">
      <Routes>
        <Route element={<LayoutComponent />}>
          <Route index element={<BookCardLibraryComponent />} />
          <Route path="/bookshelf" element={<BookshelfComponent />} />
          <Route path="/submissions" element={<SubmissionsComponent />} />
          <Route path="/profile" element={<ProfileComponent />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
);
