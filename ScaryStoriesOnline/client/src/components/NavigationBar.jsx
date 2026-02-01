import { NavLink } from "react-router-dom";
import "../styles/navigationBar.css";

export const NavigationBar = () => {
  const handleNavKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <nav aria-label="Primary Navigation" className="navigation-bar-wrapper">
      <ul className="navigation-bar" role="menubar">
        <li role="none">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onKeyDown={handleNavKeyDown}
            role="menuitem"
            aria-label="Library - Browse all books"
          >
            <span className="material-icons" aria-hidden="true">auto_stories</span>
          </NavLink>
        </li>
        <li role="none">
          <NavLink
            to="/bookshelf"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onKeyDown={handleNavKeyDown}
            role="menuitem"
            aria-label="My Bookshelf - View saved books"
          >
            <span className="material-icons" aria-hidden="true">web_stories</span>
          </NavLink>
        </li>
        <li role="none">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onKeyDown={handleNavKeyDown}
            role="menuitem"
            aria-label="Profile - View your profile"
          >
            <span className="material-icons" aria-hidden="true">person</span>
          </NavLink>
        </li>

        <li role="none">
          <NavLink
            to="/submissions"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onKeyDown={handleNavKeyDown}
            role="menuitem"
            aria-label="Submissions - Submit a story"
          >
            <span className="material-icons" aria-hidden="true">mail_outline</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
