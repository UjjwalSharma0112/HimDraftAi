import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/generator")) return "AI Copywriter Generator";
    if (path.startsWith("/detail")) return "Description Details";
    if (path.startsWith("/settings")) return "Workspace Settings";
    return "Workspace Dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!user || !user.name) return "U";
    const parts = user.name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-outline-border bg-container-bg flex items-center justify-between px-6 md:px-8 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-[4px] border border-outline-border text-primary-text hover:bg-outline-border/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-primary-text leading-none">{user.name}</span>
            <span className="text-[10px] text-secondary-text mt-0.5 leading-none">{user.email}</span>
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-outline-border/60 border border-outline-border flex items-center justify-center text-xs font-mono font-bold" title={user?.name || "User"}>
          {getInitials()}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border border-outline-border rounded-[4px] hover:bg-outline-border/30 transition-colors cursor-pointer text-secondary-text hover:text-primary-text"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
