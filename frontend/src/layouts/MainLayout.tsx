import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/ui";

export interface MainLayoutContext {
  showToast: (message: string, type?: "success" | "error") => void;
}

export const MainLayout: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkActive = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(darkActive);
    if (darkActive) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      showToast("Switched to Ink Mode", "success");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      showToast("Switched to Paper Mode", "success");
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-surface-bg text-primary-text font-sans antialiased flex transition-colors duration-250">
      {/* Persistent Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen">
        {/* Persistent Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-10 max-w-[1280px] w-full mx-auto animate-fadeIn">
          <Outlet context={{ showToast } satisfies MainLayoutContext} />
        </main>
      </div>

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3500}
        />
      )}
    </div>
  );
};

export default MainLayout;
