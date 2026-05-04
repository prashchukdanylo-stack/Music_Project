import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/songslist", label: "Songs" },
    { path: "/favourite", label: "Favourite" },
  ];

  const toggleSidebar = useCallback(() => {
    setSidebar((prev)=> !prev);
  }, []);


  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === "Escape") {
        toggleSidebar();
      }
    };
    window.addEventListener("keyup", handleGlobalKey);
    return () => window.removeEventListener("keyup", handleGlobalKey);
  }, [toggleSidebar]);

  return (
    <div className="sidebar">
      <img
        onClick={() => (sidebar ? setSidebar(false) : setSidebar(true))}
        src="/images/logo.png"
        className="logo"
      ></img>

      {sidebar && (
        <div className="side-links">
          {navLinks.map((link)=>  
          <button key={link.label}
            className={
              location.pathname === link.path ? "nav-button-active" : "nav-button"
            }
            onClick={() => {
              navigate(link.path);
            }}
          >
            {link.label}
          </button>)}
        </div>
      )}
    </div>
  );
}
