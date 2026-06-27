import React from "react";
import { NavLink } from "react-router-dom";

export interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isDark,
  toggleTheme,
}) => {
  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      iconPath: "M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    },
    {
      path: "/generator",
      label: "AI Generator",
      iconPath: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
      path: "/detail",
      label: "Detail View",
      iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    },
    {
      path: "/settings",
      label: "Settings",
      iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    }
  ];

  const renderNavLinks = () => (
    <nav className="space-y-1.5">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileOpen(false)}
          className={({ isActive }) =>
            `w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              isActive
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
          </svg>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 h-screen bg-container-bg border-r border-outline-border z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-border">
          <span className="text-sm font-sans font-bold uppercase tracking-wider">
            HimShakti AI
          </span>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {renderNavLinks()}
        </div>

        <div className="p-4 border-t border-outline-border flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-text">
            Theme Mode
          </span>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-[4px] border border-outline-border bg-outline-border/30 text-primary-text flex items-center justify-center hover:bg-outline-border/60"
            title="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1M3 12h1m16 0h1m-15.364-6.364l.707.707" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex-1 max-w-xs w-full bg-container-bg border-r border-outline-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-outline-border pb-4 mb-6">
                <span className="text-sm font-sans font-bold uppercase tracking-wider">
                  HimShakti AI
                </span>
                <button onClick={() => setIsMobileOpen(false)} className="p-1 text-secondary-text">
                  ✕
                </button>
              </div>
              {renderNavLinks()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
