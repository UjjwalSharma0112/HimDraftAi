import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Toast, Loader } from "../components/ui";

interface CopyDraft {
  id: string;
  name: string;
  category: string;
  altitude: string;
  tone: string;
  content: string;
  timestamp: string;
}

export default function DashboardPage() {
  // --- Core Application States ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "generator" | "detail" | "showcase" | "settings">("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- UI Component States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // --- Data and Form States ---
  const [productName, setProductName] = useState("Organic Himalayan Shilajit");
  const [category, setCategory] = useState("Shilajit");
  const [altitude, setAltitude] = useState("16,000 ft");
  const [tone, setTone] = useState("Cultural Story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  // Input states for showcases and settings
  const [inputNormalVal, setInputNormalVal] = useState("Kashmiri Saffron");
  const [inputErrorVal, setInputErrorVal] = useState("Invalid name");
  const [brandName, setBrandName] = useState("HimShakti Organic");
  
  // Mock Data
  const [drafts, setDrafts] = useState<CopyDraft[]>([
    {
      id: "1",
      name: "Wild Rhododendron Honey",
      category: "Honey",
      altitude: "8,500 ft",
      tone: "Cultural Story",
      content: "Harvested by heritage bee-collectors from high cliffs of Uttarakhand. Sourced at 8,500 ft from wild spring rhododendron blossoms, this rare amber honey preserves raw enzymes and offers a delicate, floral taste of the pristine valleys.",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      name: "Glacial Shilajit Resin",
      category: "Shilajit",
      altitude: "16,000 ft",
      tone: "Premium Luxury",
      content: "Experience absolute purity sourced at 16,000 ft from glacial rock faces. Rich in fulvic acid and trace minerals, our hand-purified Shilajit represents the ultimate standard in physical longevity and cognitive support.",
      timestamp: "1 day ago"
    },
    {
      id: "3",
      name: "High-Altitude Saffron Threads",
      category: "Herbs & Spices",
      altitude: "5,500 ft",
      tone: "E-com SEO",
      content: "Pure Grade A+ Himalayan Saffron threads. Hand-picked at dawn in Kashmir. Perfect for premium culinary dishes, skin radiance, and daily antioxidant wellness. Organic certified and non-GMO.",
      timestamp: "3 days ago"
    }
  ]);

  // Handle Dark / Light Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkActive = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(darkActive);
    if (darkActive) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      showToast("Theme switched to Ink (Dark Mode)", "success");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      showToast("Theme switched to Paper (Light Mode)", "success");
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Generate description handler
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      showToast("Product name is required!", "error");
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      let copy = "";
      if (category === "Honey") {
        if (tone === "Cultural Story") {
          copy = `Nestled in the remote, mist-kissed ridges of the Himalayas at ${altitude}, our ${productName} represents a centuries-old harmony between bees and pristine nature. Hand-harvested by generational honey hunters, this raw, golden elixir carries the delicate floral essence of high-altitude blossoms. Unfiltered and raw, it preserves all natural enzymes and immune-boosting benefits, sharing the true sacred energy of the mountains with every spoonful.`;
        } else if (tone === "Premium Luxury") {
          copy = `Introducing the gold standard of high-altitude nectar. Our ${productName} is harvested at ${altitude} from untouched Himalayan wildflowers. This micro-batch honey is characterized by its deep, luxurious amber hue and intense floral bouquet. Unheated and minimally strained, it is a rare culinary treasure packed with powerful mountain antioxidants, presented for the discerning palate.`;
        } else {
          copy = `Buy 100% Pure Raw Himalayan Honey. Sourced at ${altitude}. Key benefits: raw, unpasteurized, organic wildflower honey. Ideal for boosting immunity, healthy sweetening, and natural wellness recipes. Order your jar of pure mountain wellness today.`;
        }
      } else if (category === "Shilajit") {
        if (tone === "Cultural Story") {
          copy = `Forged in the heart of the Himalayas over centuries, our ${productName} is harvested from steep black rock faces at ${altitude}. Known traditionally as the 'Destroyer of Weakness,' this purified shilajit resin is a sacred adaptogen used for vitality and strength. Hand-purified using pristine mountain spring water and Triphala, it brings you ancient longevity secrets in its purest form.`;
        } else if (tone === "Premium Luxury") {
          copy = `Experience high-performance wellness powered by the heights of the earth. Cultivated at ${altitude}, this ultra-grade ${productName} resin contains a high percentage of fulvic acid and trace minerals. Purified meticulously to meet top-tier purity certifications, it is the ultimate natural supplement to elevate your daily cognitive focus, energy, and physical resilience.`;
        } else {
          copy = `High-quality Pure Himalayan Shilajit Resin. Sourced at ${altitude}. Rich in Fulvic Acid and 80+ trace minerals. Boosts stamina, brain function, and natural immunity. Third-party lab tested for heavy metals. Shop the best organic shilajit online.`;
        }
      } else {
        if (tone === "Cultural Story") {
          copy = `Grown in the mineral-dense, glacial-fed soils of the Himalayan hillsides at ${altitude}, our ${productName} is tended by small farmer cooperatives. Sundried and stone-milled using age-old methods, these traditional crops are packed with pure nutrients. Each harvest supports local mountain livelihoods while bringing the rich, aromatic flavors of the valleys straight to your home.`;
        } else if (tone === "Premium Luxury") {
          copy = `Elevate your culinary creations with the ultimate mountain harvest. Grown at a pristine altitude of ${altitude}, this premium ${productName} is curated for peak potency, flavor, and purity. Carefully hand-selected and custom-packed, it delivers unmatched freshness and an authentic taste profile that stands in a class of its own.`;
        } else {
          copy = `Organic ${productName} from Himalayan Valleys. Cultivated at ${altitude} by local fair-trade cooperatives. 100% natural, pesticide-free, and sun-dried. Perfect for healthy cooking, culinary flavoring, and premium pantry upgrades. Fast shipping.`;
        }
      }

      setGeneratedContent(copy);
      setIsGenerating(false);
      showToast("Description generated successfully!", "success");

      // Save to drafts array
      const newDraft: CopyDraft = {
        id: (drafts.length + 1).toString(),
        name: productName,
        category,
        altitude,
        tone,
        content: copy,
        timestamp: "Just now"
      };
      setDrafts([newDraft, ...drafts]);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const activeDraft = drafts.find(d => d.id === selectedDraftId) || drafts[0];

  return (
    <div className="min-h-screen bg-surface-bg text-primary-text font-sans antialiased flex transition-colors duration-250">
      
      {/* 1. SIDEBAR NAVIGATION - FIXED LEFT-HAND (256px width) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-container-bg border-r border-outline-border z-20">
        
        {/* Brand Header (Letter H Logo, no emojis) */}
        <div className="h-16 flex items-center px-6 border-b border-outline-border">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 bg-black dark:bg-white rounded-[4px] flex items-center justify-center text-white dark:text-black font-mono font-bold text-sm">
              H
            </span>
            <span className="text-sm font-sans font-bold uppercase tracking-wider">
              HimDraftAI
            </span>
          </div>
        </div>

        {/* Navigation list using inline SVGs instead of emojis */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => { setActiveTab("dashboard"); setIsMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              activeTab === "dashboard"
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab("generator"); setIsMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              activeTab === "generator"
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Generator
          </button>

          <button
            onClick={() => { setActiveTab("detail"); setIsMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              activeTab === "detail"
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Detail View
          </button>

          <button
            onClick={() => { setActiveTab("showcase"); setIsMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              activeTab === "showcase"
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            UI Components
          </button>

          <button
            onClick={() => { setActiveTab("settings"); setIsMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
              activeTab === "settings"
                ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                : "text-secondary-text hover:bg-outline-border/40 hover:text-primary-text"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>

        {/* Sidebar Footer with clean SVG icon toggler */}
        <div className="p-4 border-t border-outline-border flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-text">
            Mode: {isDark ? "Ink (Dark)" : "Paper (Light)"}
          </span>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-[4px] border border-outline-border bg-outline-border/30 text-primary-text flex items-center justify-center hover:bg-outline-border/60 transition-colors"
            title="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OUTLET (HAMBURGER DRAWER) */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-container-bg border-r border-outline-border pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center px-6">
              <span className="text-sm font-sans font-bold uppercase tracking-wider">
                HimDraftAI
              </span>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {/* Sidebar Tabs for Mobile with inline SVGs */}
              {["dashboard", "generator", "detail", "showcase", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-[4px] text-xs font-medium uppercase tracking-wider transition-colors duration-150 flex items-center gap-3 ${
                    activeTab === tab
                      ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                      : "text-secondary-text hover:bg-outline-border/45 hover:text-primary-text"
                  }`}
                >
                  {tab === "dashboard" && (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H16" />
                      </svg>
                      Dashboard
                    </>
                  )}
                  {tab === "generator" && (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Generator
                    </>
                  )}
                  {tab === "detail" && (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Detail View
                    </>
                  )}
                  {tab === "showcase" && (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2" />
                      </svg>
                      UI Components
                    </>
                  )}
                  {tab === "settings" && (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37" />
                      </svg>
                      Settings
                    </>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-outline-border flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-text">
                Theme Toggle
              </span>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-[4px] border border-outline-border bg-outline-border/30 text-primary-text flex items-center justify-center hover:bg-outline-border/60"
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1M3 12h1m16 0h1m-15.364-6.364l.707.707" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen">
        
        {/* Minimal TopNavBar */}
        <header className="h-16 border-b border-outline-border bg-container-bg flex items-center justify-between px-6 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-[4px] border border-outline-border text-primary-text hover:bg-outline-border/30 animate-pulse-subtle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider">
              {activeTab === "dashboard" && "Workspace Dashboard"}
              {activeTab === "generator" && "AI Copywriter Generator"}
              {activeTab === "detail" && "Description Details"}
              {activeTab === "showcase" && "HimDraftAI Component Library"}
              {activeTab === "settings" && "Workspace Configuration"}
            </h2>
          </div>

          {/* Minimal Search and User Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center relative">
              <input
                type="text"
                placeholder="Search copies..."
                className="text-xs bg-surface-bg border border-outline-border px-3 py-1.5 rounded-[4px] outline-none text-primary-text w-48 focus:w-64 transition-all focus:border-primary-text"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-outline-border/60 border border-outline-border flex items-center justify-center text-xs font-mono font-bold">
              HP
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-[1280px] w-full mx-auto animate-fadeIn">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="border-b border-outline-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase">Workspace Overview</h1>
                <p className="text-xs text-secondary-text mt-1 max-w-xl">
                  Manage generated descriptions and monitor copy performance for your Himalayan organic exports.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-container-bg border border-outline-border p-6 rounded-[4px]">
                  <span className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider block">
                    Total Drafts Created
                  </span>
                  <div className="text-3xl font-bold mt-2">{drafts.length}</div>
                  <span className="text-[10px] font-mono text-secondary-text/80 block mt-1">
                    Updated just now
                  </span>
                </div>

                <div className="bg-container-bg border border-outline-border p-6 rounded-[4px]">
                  <span className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider block">
                    Mountain Sourced Valleys
                  </span>
                  <div className="text-3xl font-bold mt-2">4</div>
                  <span className="text-[10px] font-mono text-secondary-text/80 block mt-1">
                    Garhwal, Pampore, Kumaon
                  </span>
                </div>

                <div className="bg-container-bg border border-outline-border p-6 rounded-[4px]">
                  <span className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider block">
                    SEO Integration Rate
                  </span>
                  <div className="text-3xl font-bold mt-2">100%</div>
                  <span className="text-[10px] font-mono text-secondary-text/80 block mt-1">
                    Optimized meta & keywords
                  </span>
                </div>
              </div>

              {/* Dashboard Content & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Recent Drafts List Table */}
                <div className="lg:col-span-8 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-border pb-3">
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                      Recent Copy Drafts
                    </h3>
                    <Button variant="outline" className="py-1 px-3 text-xs" onClick={() => setActiveTab("generator")}>
                      + New Copy
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-outline-border text-secondary-text font-mono uppercase tracking-wider">
                          <th className="py-2.5 font-medium">Product Name</th>
                          <th className="py-2.5 font-medium">Category</th>
                          <th className="py-2.5 font-medium">Altitude</th>
                          <th className="py-2.5 font-medium">Tone</th>
                          <th className="py-2.5 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-border">
                        {drafts.map((d) => (
                          <tr key={d.id} className="hover:bg-surface-bg/60 transition-colors">
                            <td className="py-3 font-semibold text-primary-text">{d.name}</td>
                            <td className="py-3 text-secondary-text">{d.category}</td>
                            <td className="py-3 font-mono text-[11px] text-secondary-text">{d.altitude}</td>
                            <td className="py-3 text-secondary-text">{d.tone}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedDraftId(d.id);
                                  setActiveTab("detail");
                                }}
                                className="text-xs font-bold underline hover:text-secondary-text"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dashboard Quick Actions Showcase Demo */}
                <div className="lg:col-span-4 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3 mb-4">
                      Library Quick Controls
                    </h3>
                    <p className="text-xs text-secondary-text mb-4">
                      Directly trigger and test the UI elements on this workspace screen.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button variant="primary" className="w-full" onClick={() => setIsModalOpen(true)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2.414 4A6.001 6.001 0 013 9a6 6 0 0110.893 3.414L13 14l-3 3.5.5.5H13l3.5-3.5.5.5V13z" />
                      </svg>
                      Verify Workspace Modal
                    </Button>

                    <Button variant="secondary" className="w-full" onClick={() => showToast("Himalayan honey catalog synchronized!", "success")}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Trigger Success Toast
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => showToast("Failed to fetch copy schema. Sourced data offline.", "error")}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Trigger Error Toast
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AI COPY GENERATOR (SPLIT VIEW) */}
          {activeTab === "generator" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-outline-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase">AI Copywriting Generator</h1>
                <p className="text-xs text-secondary-text mt-1">
                  Input specific parameters. The AI will preserve local ingredients, branding, and traditional details verbatim.
                </p>
              </div>

              {/* SPLIT VIEW LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (Input Form) */}
                <div className="lg:col-span-5 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <div className="border-b border-outline-border pb-3">
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                      Configuration Properties
                    </h3>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-5">
                    <Input
                      label="Product Title (Verbatim Sourced Name)"
                      id="product-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Pure Himalayan Shilajit"
                      required
                    />

                    <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
                      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                        Product Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3.5 py-2.5 rounded-[4px] text-sm text-primary-text focus:outline-none transition-colors"
                      >
                        <option value="Honey">Organic Honey</option>
                        <option value="Shilajit">Shilajit Resin</option>
                        <option value="Herbs & Spices">Herbs & Spices</option>
                        <option value="Grains">Mountain Grains & Millets</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
                      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                        Harvest Altitude
                      </label>
                      <select
                        value={altitude}
                        onChange={(e) => setAltitude(e.target.value)}
                        className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3.5 py-2.5 rounded-[4px] text-sm text-primary-text focus:outline-none transition-colors"
                      >
                        <option value="5,000 ft">5,000 ft (Low Alpine)</option>
                        <option value="8,500 ft">8,500 ft (Mid Alpine)</option>
                        <option value="12,000 ft">12,000 ft (High Altitude)</option>
                        <option value="16,000 ft">16,000 ft (Glacial Rock Valleys)</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
                      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                        AI Tone & Vibe
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Cultural Story", "Premium Luxury", "E-com SEO"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTone(t)}
                            className={`py-2 px-1 text-center rounded-[4px] text-xs font-semibold border transition-all ${
                              tone === t
                                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                                : "bg-transparent border-outline-border text-secondary-text hover:text-primary-text"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={isGenerating}>
                      {isGenerating ? "Processing Copy..." : "Generate Description"}
                    </Button>
                  </form>
                </div>

                {/* Right Column (Preview & Edit Output) */}
                <div className="lg:col-span-7 bg-container-bg border border-outline-border rounded-[4px] p-6 h-full flex flex-col justify-between min-h-[460px]">
                  
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between border-b border-outline-border pb-3">
                      <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                        Output Live Editor
                      </h3>
                      {generatedContent && (
                        <span className="text-[9px] font-mono uppercase border border-outline-border bg-surface-bg px-2 py-0.5 rounded-[4px]">
                          Format: {tone}
                        </span>
                      )}
                    </div>

                    {isGenerating ? (
                      <div className="flex-1 flex flex-col justify-center py-20">
                        <Loader variant="spinner" size="lg" className="mb-4" />
                        <Loader variant="skeleton" className="max-w-md mx-auto" />
                      </div>
                    ) : generatedContent ? (
                      <textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="w-full flex-1 min-h-[280px] p-4 bg-surface-bg border border-outline-border rounded-[4px] text-sm text-primary-text font-sans focus:outline-none focus:border-primary-text resize-none"
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-12 h-12 bg-surface-bg border border-outline-border rounded-full flex items-center justify-center text-lg">
                          <svg className="w-6 h-6 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">No copy generated yet</p>
                          <p className="text-xs text-secondary-text max-w-xs mt-1">
                            Set your product title, category, and vibe on the left, then click Generate to construct an SEO story.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {generatedContent && !isGenerating && (
                    <div className="pt-4 border-t border-outline-border mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-secondary-text">
                        Words: {generatedContent.split(/\s+/).filter(Boolean).length}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => copyToClipboard(generatedContent)}>
                          Copy Copy
                        </Button>
                        <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => showToast("Draft saved inside memory repository!", "success")}>
                          Save Draft
                        </Button>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* TAB 3: DETAIL VIEW */}
          {activeTab === "detail" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-outline-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase">Description Detail View</h1>
                <p className="text-xs text-secondary-text mt-1">
                  Perform deep reviews, keywords verification, and local compliance checks for specific items.
                </p>
              </div>

              {/* Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left panel details */}
                <div className="lg:col-span-4 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3 mb-4">
                      Sourced Properties
                    </h3>
                    
                    <div className="space-y-4 text-xs font-sans">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-secondary-text block">Selected Draft</span>
                        <select
                          className="w-full mt-1 bg-container-bg border border-outline-border rounded-[4px] p-2 text-xs text-primary-text focus:outline-none"
                          value={selectedDraftId || activeDraft.id}
                          onChange={(e) => setSelectedDraftId(e.target.value)}
                        >
                          {drafts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-secondary-text">Category</span>
                          <p className="font-semibold mt-0.5">{activeDraft.category}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-secondary-text">Altitude Sourced</span>
                          <p className="font-semibold mt-0.5">{activeDraft.altitude}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-secondary-text">Drafting Vibe</span>
                        <p className="font-semibold mt-0.5">{activeDraft.tone}</p>
                      </div>

                      <div className="pt-4 border-t border-outline-border space-y-2">
                        <span className="text-[10px] font-mono uppercase text-secondary-text block">Compliance Check</span>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Himalayan Origin Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Pure terminology approved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel text area */}
                <div className="lg:col-span-8 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-border pb-3">
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                      Copy Text Content
                    </h3>
                    <span className="text-[10px] font-mono text-secondary-text">{activeDraft.timestamp}</span>
                  </div>

                  <div className="bg-surface-bg p-6 border border-outline-border rounded-[4px] text-sm text-primary-text leading-relaxed font-sans min-h-[220px]">
                    {activeDraft.content}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-outline-border">
                    <Button variant="outline" className="text-xs" onClick={() => copyToClipboard(activeDraft.content)}>
                      Copy Text
                    </Button>
                    <Button variant="primary" className="text-xs" onClick={() => showToast("Export sequence queued successfully!", "success")}>
                      Publish Draft
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: COMPONENT LIBRARY SHOWCASE */}
          {activeTab === "showcase" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-outline-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase">Component Library</h1>
                <p className="text-xs text-secondary-text mt-1">
                  Deliverable 2 Showcase Page. Demonstration of all 5 UI components in multiple structural states.
                </p>
              </div>

              {/* Grid of UI Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. BUTTON SHOWCASE */}
                <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    1. Button Component
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Primary Button</span>
                      <div>
                        <Button variant="primary">Primary Button</Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Secondary Button</span>
                      <div>
                        <Button variant="secondary">Secondary Button</Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Outline Button</span>
                      <div>
                        <Button variant="outline">Outline Button</Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Disabled State</span>
                      <div>
                        <Button variant="primary" disabled={true}>Disabled Button</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. INPUT SHOWCASE */}
                <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    2. Input Component
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Normal Input</span>
                      <Input
                        label="Product Title"
                        id="showcase-normal"
                        value={inputNormalVal}
                        onChange={(e) => setInputNormalVal(e.target.value)}
                        placeholder="Normal input state"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Error Input State</span>
                      <Input
                        label="Category Label"
                        id="showcase-error"
                        value={inputErrorVal}
                        onChange={(e) => setInputErrorVal(e.target.value)}
                        error="This field must contain authentic Himalayan origin information"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-secondary-text uppercase">Required Input Field</span>
                      <Input
                        label="Sourced Altitude"
                        id="showcase-req"
                        placeholder="e.g. 10,000 ft"
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. MODAL SHOWCASE */}
                <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    3. Modal Component
                  </h3>
                  <p className="text-xs text-secondary-text">
                    Modals support clear header borders, flat actions, backdrop dismissals, and escape-key listener integrations.
                  </p>
                  <div>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                      Open Test Modal
                    </Button>
                  </div>
                </div>

                {/* 4. TOAST SHOWCASE */}
                <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    4. Toast Component
                  </h3>
                  <p className="text-xs text-secondary-text mb-4">
                    Toasts appear at the bottom-right and fade in smoothly, styled as Success (Green dot) or Error (Red dot) indicators.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => showToast("Himalayan copy draft exported successfully!", "success")}>
                      Trigger Success Toast
                    </Button>
                    <Button variant="outline" onClick={() => showToast("Operation aborted: Network timeout while querying AI backend.", "error")}>
                      Trigger Error Toast
                    </Button>
                  </div>
                </div>

                {/* 5. LOADER SHOWCASE */}
                <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6 md:col-span-2">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    5. Loader Component
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Spinner spinner */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-secondary-text uppercase block">Circular Spinners</span>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <Loader variant="spinner" size="sm" />
                          <span className="text-[9px] text-neutral-450 block mt-2 font-mono">Small</span>
                        </div>
                        <div className="text-center">
                          <Loader variant="spinner" size="md" />
                          <span className="text-[9px] text-neutral-450 block mt-2 font-mono">Medium</span>
                        </div>
                        <div className="text-center">
                          <Loader variant="spinner" size="lg" />
                          <span className="text-[9px] text-neutral-450 block mt-2 font-mono">Large</span>
                        </div>
                      </div>
                    </div>

                    {/* Skeleton loader */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-secondary-text uppercase block">Skeleton Content Screens</span>
                      <div className="border border-outline-border p-4 bg-surface-bg rounded-[4px]">
                        <Loader variant="skeleton" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & BRANDING */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-outline-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase">Workspace Settings</h1>
                <p className="text-xs text-secondary-text mt-1">
                  Adjust visual modes, customize default brand profiles, and verify local exporter credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Settings */}
                <div className="lg:col-span-6 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    Visual Settings
                  </h3>
                  
                  {/* Theme Theme Toggle */}
                  <div className="flex items-center justify-between border border-outline-border p-4 rounded-[4px]">
                    <div>
                      <h4 className="text-sm font-semibold">Workspace Theme Mode</h4>
                      <p className="text-xs text-secondary-text mt-0.5">Toggle between Paper (Light) and Ink (Dark) visual modes.</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all flex items-center gap-2"
                    >
                      {isDark ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1" />
                          </svg>
                          Paper Mode
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646" />
                          </svg>
                          Ink Mode
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Default Exporter profile */}
                <div className="lg:col-span-6 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
                    Default Exporter Profile
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Exporter Brand Name"
                      id="brand-name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />

                    <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
                      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                        Primary Region Sourced
                      </label>
                      <select className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3.5 py-2.5 rounded-[4px] text-sm text-primary-text focus:outline-none">
                        <option>Uttarakhand (Garhwal & Kumaon)</option>
                        <option>Himachal Pradesh</option>
                        <option>Jammu & Kashmir</option>
                        <option>Sikkim</option>
                      </select>
                    </div>

                    <Button variant="primary" onClick={() => showToast("Brand settings updated!", "success")}>
                      Save Configuration
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- RENDERED MODAL SHOWCASE COMPONENT --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="HimDraftAI Authentication"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => { setIsModalOpen(false); showToast("Workspace credentials verified!", "success"); }}>
              Verify
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs leading-relaxed text-secondary-text">
            Verify the compliance details of your Himalayan product draft. Sourcing information, lab-testing certs, and fair-trade cooperatives numbers will be checked in the background.
          </p>
          <Input
            label="Cooperative Verification ID"
            id="coop-id"
            placeholder="e.g. U-1025-COOP"
            required={true}
          />
        </div>
      </Modal>

      {/* --- RENDERED TOAST NOTIFICATION COMPONENT --- */}
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
}
