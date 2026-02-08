import React from "react";
import { TABS, TabId } from "../../constants";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useActiveTrip, useTrips } from "../../hooks/useQueries";
import { Wallet, Plane, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onCreateTrip: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onCreateTrip,
}) => {
  const { clear } = useInternetIdentity();

  const { data: trips } = useTrips();
  const { data: activeTrip } = useActiveTrip();

  return (
    <>
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-travel-navy-900 to-travel-navy-950 text-white shadow-soft-xl border-r border-travel-navy-800/50">
        {/* Header/Branding */}
        <div className="p-8 border-b border-travel-navy-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-travel-amber-500/10 rounded-xl border border-travel-amber-500/20">
              <Wallet className="w-6 h-6 text-travel-amber-400" />
            </div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">
              TripWallet
            </h1>
          </div>
          <p className="text-sm text-travel-navy-300 font-light mt-1">
            Your travel expense companion
          </p>
        </div>

        {/* Active Trip Display */}
        {trips && trips.length > 0 && (
          <div className="px-6 py-4 border-b border-travel-navy-800/50">
            <div className="w-full flex items-center gap-3 px-4 py-3 bg-travel-navy-800/40 rounded-xl border border-travel-navy-700/30">
              <Plane className="w-4 h-4 text-travel-amber-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-white">
                  {activeTrip?.name || "No Active Trip"}
                </p>
                {activeTrip && (
                  <p className="text-xs text-travel-navy-400 truncate">
                    {activeTrip.primaryCurrency} • {activeTrip.budgetLimit}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-travel-amber-500/10 text-travel-amber-400 shadow-soft border border-travel-amber-500/20"
                      : "text-travel-navy-300 hover:bg-travel-navy-800/40 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-travel-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer / Sign Out */}
        <div className="p-6 border-t border-travel-navy-800/50">
          <button
            onClick={() => clear()}
            className="w-full flex items-center gap-3 px-4 py-3 text-travel-navy-300 hover:text-white hover:bg-travel-navy-800/40 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
