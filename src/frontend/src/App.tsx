import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useActor } from "./hooks/useActor";
import {
  useTrips,
  useActiveTrip,
  useSetActiveTrip,
  useLastRateUpdate,
  useFetchExchangeRates,
  useExpensesEnabled,
  useApiKey,
} from "./hooks/useQueries";
import { TabId } from "./constants";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { ExpenseListPage } from "./components/ExpenseListPage";
import { TripsPage } from "./components/TripsPage";
import { SettingsPage } from "./components/SettingsPage";
import { LoadingScreen } from "./components/LoadingScreen";
import { TripModal } from "./components/TripModal";
import { ExpenseModal } from "./components/ExpenseModal";
import { toNanoseconds, NS_PER_DAY } from "./utils/formatters";

const App: React.FC = () => {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();

  // Clear query cache on logout
  useEffect(() => {
    if (!identity) {
      queryClient.clear();
    }
  }, [identity, queryClient]);

  const { actor, isFetching: isActorFetching } = useActor();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const {
    data: trips,
    isLoading: isLoadingTrips,
    error: tripsError,
  } = useTrips();
  const { data: activeTrip } = useActiveTrip();
  const setActiveTripMutation = useSetActiveTrip();

  const [showTripModal, setShowTripModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<
    bigint | undefined
  >();

  // Exchange rate auto-fetch
  const { data: lastRateUpdate } = useLastRateUpdate();
  const fetchRates = useFetchExchangeRates();
  const hasAttemptedRateFetch = useRef(false);

  // API key and expenses enabled state
  const { data: expensesEnabled } = useExpensesEnabled();
  const { data: apiKey } = useApiKey();

  // Track if we've already shown the new user modal to prevent re-opening
  const hasShownNewUserModal = useRef(false);

  // Auto-activate first trip if none is active
  useEffect(() => {
    if (trips && trips.length > 0 && !activeTrip && !tripsError) {
      setActiveTripMutation.mutate(trips[0].id);
    }
  }, [trips, activeTrip, tripsError, setActiveTripMutation]);

  // Show trip creation modal for new users (only once)
  useEffect(() => {
    if (
      isAuthenticated &&
      trips &&
      trips.length === 0 &&
      !isLoadingTrips &&
      !hasShownNewUserModal.current &&
      !tripsError
    ) {
      hasShownNewUserModal.current = true;
      setShowTripModal(true);
    }
  }, [isAuthenticated, trips, isLoadingTrips, tripsError]);

  // Auto-fetch exchange rates on app load (only if user has API key configured)
  useEffect(() => {
    if (!actor || hasAttemptedRateFetch.current || !apiKey) return;

    const doFetch = async () => {
      hasAttemptedRateFetch.current = true;
      try {
        await fetchRates.mutateAsync();
      } catch (error) {
        // Silently fail - user will need to manually refresh
      }
    };

    // Fetch if rates were never updated or are older than 24 hours
    const now = toNanoseconds(new Date());
    const shouldFetch = !lastRateUpdate || now - lastRateUpdate > NS_PER_DAY;

    if (shouldFetch) {
      doFetch();
    }
  }, [actor, lastRateUpdate, apiKey]);

  // Initializing identity - show loading screen
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Not authenticated - show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Loading actor or trips - show loading screen
  // Only check initial loading, NOT refetching
  // This prevents unmounting the main app during refetches and infinite loading
  if (!actor || isLoadingTrips) {
    return <LoadingScreen />;
  }

  // If there's an error loading trips, show empty state (prevents infinite loading)
  // The app will still render and allow creating a new trip
  const safeTrips = tripsError ? [] : trips;

  const handleAddExpense = () => {
    if (!expensesEnabled) {
      setActiveTab("settings");
      return;
    }
    setEditingExpenseId(undefined);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expenseId: bigint) => {
    setEditingExpenseId(expenseId);
    setShowExpenseModal(true);
  };

  const handleCloseExpenseModal = () => {
    setShowExpenseModal(false);
    setEditingExpenseId(undefined);
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateTrip={() => setShowTripModal(true)}
      >
        {activeTab === "dashboard" && (
          <Dashboard
            onAddExpense={handleAddExpense}
            onCreateTrip={() => setShowTripModal(true)}
            expensesEnabled={expensesEnabled ?? false}
            onGoToSettings={() => setActiveTab("settings")}
          />
        )}
        {activeTab === "expenses" && (
          <ExpenseListPage
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            expensesEnabled={expensesEnabled ?? false}
            onGoToSettings={() => setActiveTab("settings")}
          />
        )}
        {activeTab === "trips" && (
          <TripsPage onCreateTrip={() => setShowTripModal(true)} />
        )}
        {activeTab === "settings" && <SettingsPage />}
      </Layout>

      {/* Modals */}
      {showTripModal && <TripModal onClose={() => setShowTripModal(false)} />}
      {showExpenseModal && (
        <ExpenseModal
          expenseId={editingExpenseId}
          onClose={handleCloseExpenseModal}
        />
      )}
    </>
  );
};

export default App;
