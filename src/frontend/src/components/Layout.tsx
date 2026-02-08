import React, { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { TABS, TabId } from "../constants";
import { useActiveTrip, useTrips } from "../hooks/useQueries";
import { Wallet, Plane, Menu, X } from "lucide-react";
import { Sidebar } from "./shared/Sidebar";

interface LayoutProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onCreateTrip: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  setActiveTab,
  onCreateTrip,
  children,
}) => {
  const { clear } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: trips } = useTrips();
  const { data: activeTrip } = useActiveTrip();

  const activeTabData = TABS.find((t) => t.id === activeTab);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-travel-stone-50">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateTrip={onCreateTrip}
      />

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-soft border-b border-travel-stone-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-travel-amber-500/10 rounded-lg border border-travel-amber-500/20">
              <Wallet className="w-5 h-5 text-travel-amber-600" />
            </div>
            <h1 className="text-lg font-display font-semibold text-travel-navy-900">
              TripWallet
            </h1>

            {trips && trips.length > 0 && (
              <div className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-travel-amber-50 text-travel-amber-700 rounded-lg text-sm font-medium border border-travel-amber-200">
                <Plane className="w-4 h-4" />
                <span className="truncate max-w-[120px]">
                  {activeTrip?.name || "Select Trip"}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-travel-navy-600 hover:text-travel-navy-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Current Tab Indicator */}
      <div className="md:hidden bg-white border-b border-travel-stone-200 px-4 py-3">
        <div className="flex items-center gap-2 text-travel-amber-600 font-medium">
          {activeTabData &&
            React.createElement(activeTabData.icon, { className: "w-5 h-5" })}
          <span className="font-display">{activeTabData?.label}</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-travel-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-b from-travel-navy-900 to-travel-navy-950 shadow-soft-xl animate-slide-in">
            <div className="p-4 border-b border-travel-navy-800/50">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-white">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-travel-navy-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="py-4 px-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-xl transition-all duration-200 mb-1 ${
                      activeTab === tab.id
                        ? "bg-travel-amber-500/10 text-travel-amber-400 font-medium"
                        : "text-travel-navy-300 hover:bg-travel-navy-800/40 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-travel-navy-800/50">
              <button
                onClick={() => {
                  clear();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 text-travel-navy-300 hover:text-white hover:bg-travel-navy-800/40 rounded-xl transition-all duration-200"
              >
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
};
