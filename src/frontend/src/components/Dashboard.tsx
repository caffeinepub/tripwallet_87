import React from "react";
import {
  useActiveTrip,
  useTripSummary,
  useExpenses,
  useTrips,
  useSetActiveTrip,
} from "../hooks/useQueries";
import { formatCurrency } from "../utils/exchangeRates";
import { formatDate } from "../utils/formatters";
import { CATEGORIES } from "../constants";
import { EmptyState } from "./shared/EmptyState";
import { PageCard } from "./shared/PageCard";
import { FormButton } from "./shared/FormButton";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  AlertTriangle,
  Plus,
  Package,
  Check,
  Settings,
} from "lucide-react";

interface DashboardProps {
  onAddExpense: () => void;
  onCreateTrip: () => void;
  expensesEnabled: boolean;
  onGoToSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onAddExpense,
  onCreateTrip,
  expensesEnabled,
  onGoToSettings,
}) => {
  const { data: activeTrip } = useActiveTrip();
  const { data: summary } = useTripSummary(activeTrip?.id);
  const { data: expenses } = useExpenses(activeTrip?.id);
  const { data: trips } = useTrips();
  const setActiveTripMutation = useSetActiveTrip();

  const handleTripSelect = async (tripId: bigint) => {
    try {
      await setActiveTripMutation.mutateAsync(tripId);
    } catch (error) {
      // Error handled silently
    }
  };

  if (!activeTrip) {
    return (
      <div className="space-y-6">
        <PageCard
          title="My Trips"
          headerAction={
            <FormButton
              onClick={onCreateTrip}
              variant="primary"
              className="text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Trip
            </FormButton>
          }
        >
          <EmptyState
            icon={<Plane className="w-20 h-20" />}
            title="No Trips Yet"
            description="Create your first trip to start tracking expenses"
          />
        </PageCard>
      </div>
    );
  }

  const percentUsed = summary?.percentUsed || 0;
  const budgetColor =
    percentUsed > 100
      ? "bg-red-500"
      : percentUsed > 80
        ? "bg-travel-amber-500"
        : "bg-travel-sage-500";

  const recentExpenses = expenses?.slice(0, 5) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageCard
        title="My Trips"
        headerAction={
          <FormButton
            onClick={onCreateTrip}
            variant="primary"
            className="text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Trip
          </FormButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips?.map((trip) => (
            <button
              key={trip.id.toString()}
              onClick={() => handleTripSelect(trip.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                activeTrip?.id === trip.id
                  ? "border-travel-amber-500 bg-travel-amber-50 shadow-soft"
                  : "border-travel-stone-200 hover:border-travel-stone-300 hover:bg-travel-stone-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Plane className="w-5 h-5 text-travel-amber-600 shrink-0" />
                  <h3 className="font-semibold text-travel-navy-900 truncate">
                    {trip.name}
                  </h3>
                </div>
                {activeTrip?.id === trip.id && (
                  <Check className="w-5 h-5 text-travel-amber-600 shrink-0" />
                )}
              </div>
              <div className="text-sm text-travel-navy-600 space-y-1">
                <p className="truncate">
                  Budget:{" "}
                  <span className="font-mono">
                    {formatCurrency(trip.budgetLimit, trip.primaryCurrency)}
                  </span>
                </p>
                <p>
                  Currency:{" "}
                  <span className="font-medium">{trip.primaryCurrency}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </PageCard>

      <PageCard title={activeTrip.name}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-gradient-to-br from-travel-amber-50 to-travel-amber-100/50 p-4 sm:p-5 rounded-xl border border-travel-amber-200/50 overflow-hidden">
            <p className="text-sm text-travel-navy-600 font-medium mb-2">
              Budget
            </p>
            <p className="text-[clamp(1rem,2vw+0.5rem,1.5rem)] font-mono font-semibold text-travel-navy-900 tracking-tight truncate">
              {formatCurrency(
                activeTrip.budgetLimit,
                activeTrip.primaryCurrency,
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-travel-navy-50 to-travel-navy-100/50 p-4 sm:p-5 rounded-xl border border-travel-navy-200/50 overflow-hidden">
            <p className="text-sm text-travel-navy-600 font-medium mb-2">
              Spent
            </p>
            <p className="text-[clamp(1rem,2vw+0.5rem,1.5rem)] font-mono font-semibold text-travel-navy-900 tracking-tight truncate">
              {formatCurrency(
                summary?.totalSpent || 0,
                activeTrip.primaryCurrency,
              )}
            </p>
          </div>
          <div
            className={`bg-gradient-to-br p-4 sm:p-5 rounded-xl border overflow-hidden ${
              summary && summary.remaining < 0
                ? "from-red-50 to-red-100/50 border-red-200/50"
                : "from-travel-sage-50 to-travel-sage-100/50 border-travel-sage-200/50"
            }`}
          >
            <p className="text-sm text-travel-navy-600 font-medium mb-2">
              Remaining
            </p>
            <p
              className={`text-[clamp(1rem,2vw+0.5rem,1.5rem)] font-mono font-semibold tracking-tight truncate ${summary && summary.remaining < 0 ? "text-red-700" : "text-travel-sage-700"}`}
            >
              {formatCurrency(
                summary?.remaining || activeTrip.budgetLimit,
                activeTrip.primaryCurrency,
              )}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-travel-navy-600 font-medium">
              Budget Used
            </span>
            <span className="font-mono font-semibold text-travel-navy-900">
              {percentUsed.toFixed(1)}%
            </span>
          </div>
          <div className="relative w-full bg-travel-stone-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-full ${budgetColor} transition-all duration-500 ease-out rounded-full shadow-soft`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {percentUsed > 100 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-soft overflow-hidden">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-800 font-medium min-w-0">
              You've exceeded your budget by{" "}
              <span className="font-mono break-all">
                {formatCurrency(
                  Math.abs(summary?.remaining || 0),
                  activeTrip.primaryCurrency,
                )}
              </span>
            </p>
          </div>
        )}
        {percentUsed > 80 && percentUsed <= 100 && (
          <div className="mt-4 p-4 bg-travel-amber-50 border border-travel-amber-200 rounded-xl flex items-center gap-3 shadow-soft">
            <AlertTriangle className="w-5 h-5 text-travel-amber-600 shrink-0" />
            <p className="text-sm text-travel-amber-900 font-medium">
              You've used{" "}
              <span className="font-mono">{percentUsed.toFixed(1)}%</span> of
              your budget
            </p>
          </div>
        )}
      </PageCard>

      {summary && summary.expensesByCategory.length > 0 && (
        <PageCard title="Spending by Category">
          <div className="space-y-4">
            {summary.expensesByCategory.map(([category, amount]) => {
              const categoryData = CATEGORIES.find((c) => c.id === category);
              const percentage =
                (Number(amount) / Number(summary.totalSpent)) * 100;
              const Icon = categoryData?.icon;

              return (
                <div
                  key={category}
                  className="group hover:bg-travel-stone-50 p-3 rounded-lg transition-all duration-200 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <div className="flex items-center gap-3 min-w-0 shrink-0">
                      {Icon && typeof Icon === "function" ? (
                        <Icon
                          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 shrink-0"
                          style={{ color: categoryData?.color }}
                        />
                      ) : (
                        <Package className="w-5 h-5 shrink-0" />
                      )}
                      <span className="text-sm font-medium text-travel-navy-700">
                        {categoryData?.label || category}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-travel-navy-900 truncate min-w-0">
                      {formatCurrency(
                        Number(amount),
                        activeTrip.primaryCurrency,
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-travel-stone-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out shadow-soft"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: categoryData?.color || "#6B7280",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </PageCard>
      )}

      <PageCard
        title="Recent Expenses"
        headerAction={
          expensesEnabled ? (
            <FormButton
              onClick={onAddExpense}
              variant="primary"
              className="text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Expense
            </FormButton>
          ) : (
            <FormButton
              onClick={onGoToSettings}
              variant="secondary"
              className="text-sm"
            >
              <Settings className="w-4 h-4 mr-1" />
              Setup API Key
            </FormButton>
          )
        }
      >
        {!expensesEnabled && recentExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-travel-navy-500 font-light mb-3">
              Configure your API key in Settings to enable expense tracking.
            </p>
            <FormButton
              onClick={onGoToSettings}
              variant="primary"
              className="text-sm"
            >
              <Settings className="w-4 h-4 mr-1" />
              Go to Settings
            </FormButton>
          </div>
        ) : recentExpenses.length === 0 ? (
          <p className="text-center text-travel-navy-500 py-12 font-light">
            No expenses yet. Add your first expense to start tracking!
          </p>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => {
              const categoryData = CATEGORIES.find(
                (c) => c.id === expense.category,
              );
              const Icon = categoryData?.icon;
              return (
                <div
                  key={expense.id.toString()}
                  className="group flex items-start gap-4 p-4 bg-travel-stone-50 hover:bg-white rounded-xl border border-travel-stone-200/50 hover:border-travel-amber-200 transition-all duration-200 hover:shadow-soft animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="shrink-0 p-2 bg-white rounded-lg border border-travel-stone-200 group-hover:border-travel-amber-200 transition-all duration-200">
                    {Icon && typeof Icon === "function" ? (
                      <Icon
                        className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
                        style={{ color: categoryData?.color }}
                      />
                    ) : (
                      <Package className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-travel-navy-900">
                          {categoryData?.label || expense.category}
                        </p>
                        {expense.note && (
                          <p className="text-sm text-travel-navy-600 mt-0.5 line-clamp-1">
                            {expense.note}
                          </p>
                        )}
                        <p className="text-xs text-travel-navy-400 mt-1.5">
                          {formatDate(expense.date)}
                        </p>
                      </div>
                      <div className="text-right min-w-0 max-w-[50%]">
                        <p className="font-mono font-semibold text-travel-navy-900 text-[clamp(0.875rem,1.5vw+0.25rem,1.125rem)] truncate">
                          {formatCurrency(
                            Number(expense.convertedAmount),
                            activeTrip.primaryCurrency,
                          )}
                        </p>
                        {expense.localCurrency !==
                          activeTrip.primaryCurrency && (
                          <p className="text-xs text-travel-navy-500 font-mono mt-0.5 truncate">
                            {formatCurrency(
                              Number(expense.amount),
                              expense.localCurrency,
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageCard>
    </div>
  );
};
