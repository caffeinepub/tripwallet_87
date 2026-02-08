import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-travel-amber-200/30 rounded-full blur-xl"></div>
          <Loader2
            className="relative h-14 w-14 animate-spin text-travel-amber-500 mx-auto"
            strokeWidth={2.5}
          />
        </div>
        <p className="mt-2 text-sm text-travel-navy-500 font-light">
          Please wait a moment
        </p>
      </div>
    </div>
  );
};
