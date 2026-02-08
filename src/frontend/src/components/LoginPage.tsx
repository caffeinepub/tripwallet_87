import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-stone-50 via-travel-amber-50/30 to-travel-navy-50/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-travel-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-travel-navy-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-2xl shadow-soft-xl max-w-md w-full mx-4 relative border border-travel-stone-200 animate-scale-in">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-br from-travel-amber-400 to-travel-amber-500 rounded-2xl mb-6 shadow-soft-lg">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-display font-semibold text-travel-navy-900 mb-3 tracking-tight">
            TripWallet
          </h1>
          <p className="text-travel-navy-600 font-light leading-relaxed">
            Track your travel budget in any currency, stress-free
          </p>
        </div>
        <Button
          onClick={() => login()}
          className="w-full bg-gradient-to-r from-travel-amber-500 to-travel-amber-600 text-white py-4 px-6 font-semibold hover:from-travel-amber-600 hover:to-travel-amber-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 rounded-xl"
        >
          Sign in with Internet Identity
        </Button>
        <p className="text-xs text-travel-navy-400 text-center mt-6 font-light">
          Powered by the Internet Computer
        </p>
      </div>
    </div>
  );
};
