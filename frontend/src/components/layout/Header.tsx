import React from "react";
import { useLocation } from "react-router-dom";

export interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
}) => {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/generator")) return "AI Copywriter Generator";
    if (path.startsWith("/detail")) return "Description Details";
    if (path.startsWith("/settings")) return "Workspace Configuration";
    return "Workspace Dashboard";
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

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-outline-border/60 border border-outline-border flex items-center justify-center text-xs font-mono font-bold">
          HP
        </div>
      </div>
    </header>
  );
};

export default Header;
