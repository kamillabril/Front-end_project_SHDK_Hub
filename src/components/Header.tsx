import React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  username: string | null;
};

const Header: React.FC<HeaderProps> = ({ username }) => {
  if (!username) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: "10px 20px",
        backgroundColor: "#f0f0f0",
        zIndex: 1000,
      }}
    >
      <Link
        to="/profile"
        style={{ textDecoration: "none", color: "#5c16c5", fontWeight: "bold" }}
      >
        👤 {username}
      </Link>
    </div>
  );
};

export default Header;
