import React, { useState } from "react";
import "./ProfileMenu.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="profile-menu">
      <div className="profile-icon" onClick={() => setOpen(!open)}>
        👤
      </div>

      {open && (
        <div className="dropdown">
          <p className="user-name">{user?.name || user?.displayName || "User"}</p>
          <p className="user-email">{user?.email || ""}</p>
          <hr />
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </div>
  );
}