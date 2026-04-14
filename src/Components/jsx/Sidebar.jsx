import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
export function Sidebar({ song }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === "Escape") {
        sidebar ? setSidebar(false) : setSidebar(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [sidebar]);

  return (
    <div className="sidebar">
      <img
        onClick={() => (sidebar ? setSidebar(false) : setSidebar(true))}
        src="/images/logo.png"
        className="logo"
      ></img>

      {sidebar && (
        <div className="side-links">
          <button
            className={
              location.pathname === "/" ? "nav-button-active" : "nav-button"
            }
            onClick={() => {
              navigate("/");
            }}
          >
            Fluire{" "}
          </button>
          <button
            className={
              location.pathname === "/songslist"
                ? "nav-button-active"
                : "nav-button"
            }
            onClick={() => {
              navigate("/songslist");
            }}
          >
            {" "}
            Songs
          </button>
          <button
            className={
              location.pathname === "/song" ? "nav-button-active" : "nav-button"
            }
            onClick={() => {
              if (song) {
                navigate("/song");
              } else {
                alert("Choose a song first");
                navigate("/songslist");
              }
            }}
          >
            Go to song page
          </button>
          <button
            className={
              location.pathname === "/favourite"
                ? "nav-button-active"
                : "nav-button"
            }
            onClick={() => {
              navigate("/favourite");
            }}
          >
            Favourite
          </button>
        </div>
      )}
    </div>
  );
}
