import { useState, useEffect, useCallback } from "react";
import emitter from "../../utils/eventBus";
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
   const onToggleSidebar = () => toggleSidebar();

   emitter.on("toggleSidebar", onToggleSidebar);

   return () => emitter.off("toggleSidebar", onToggleSidebar);
   }, [toggleSidebar]);

  return (
    <div className="sidebar">
      <img
        onClick={() => (sidebar ? setSidebar(false) : setSidebar(true))}
        src="images/logo.webp"
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
