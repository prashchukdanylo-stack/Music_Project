import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css"
export function Sidebar({song}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebar, setSidebar] = useState(false);
    
    return (
        <div className = "sidebar">
          <button onClick = {()=>sidebar ? setSidebar(false) : setSidebar(true) }>{sidebar ? "Close" : "Open"} Sidebar</button>
        
        {sidebar && <div className = "side-links">
      <button className = {location.pathname === "/" ? "nav-button-active" : "nav-button"} onClick={() => {
        navigate("/");
      }
      }>Fluire </button>
      <button className = {location.pathname === "/songslist" ? "nav-button-active" : "nav-button"} onClick={() => {
        navigate("/songslist");
      }}> Songs</button>
      <button className={location.pathname === "/song" ? "nav-button-active" : "nav-button"} onClick={() => {
            if (song) {
              navigate("/song");
            }
            else {
              alert("Choose a song first");
              navigate("/songslist");
            }
          }}
        >
          Go to song page
        </button>
      </div>}
        </div> 
    )
}