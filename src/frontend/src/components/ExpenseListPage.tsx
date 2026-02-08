import React, { useState } from "react";
import {
  useActiveTrip,
  useExpenses,
  useDeleteExpense,
} from "../hooks/useQueries";
import { formatCurrency } from "../utils/exchangeRates";
import { formatDate } from "../utils/formatters";
import { CATEGORIES } from "../constants";
import { EmptyState } from "./shared/EmptyState";
import { FormButton } from "./shared/FormButton";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { Coins, Edit2, Trash2, Plus, Package, Settings } from "lucide-react";

interface ExpenseListPageProps {
  onAddExpense: () => void;
  onEditExpense: (expenseId: bigint) => void;
  expensesEnabled: boolean;
  onGoToSettings: () => void;
}

export const ExpenseListPage: React.FC<ExpenseListPageProps> = ({
  onAddExpense,
  onEditExpense,
  expensesEnabled,
  onGoToSettings,
}) => {
  const { data: activeTrip } = useActiveTrip();
  const { data: expenses } = useExpenses(activeTrip?.id);
  const deleteExpense = useDeleteExpense();
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleDeleteClick = (id: bigint) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteExpense.mutateAsync(deleteId);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  if (!activeTrip) {
    return (
      <div className="text-center py-16">
        <p className="text-travel-navy-600 font-light">
          Select a trip to view expenses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-semibold text-travel-navy-900 tracking-tight">
          Expenses
        </h2>
        {expensesEnabled ? (
          <FormButton onClick={onAddExpense} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </FormButton>
        ) : (
          <FormButton onClick={onGoToSettings} variant="secondary">
            <Settings className="w-4 h-4 mr-2" />
            Setup API Key
          </FormButton>
        )}
      </div>

      {!expenses || expenses.length === 0 ? (
        !expensesEnabled ? (
          <EmptyState
            icon={<Settings className="w-20 h-20" />}
            title="API Key Required"
            description="Configure your exchange rate API key in Settings to enable expense tracking"
            action={{
              label: "Go to Settings",
              onClick: onGoToSettings,
            }}
          />
        ) : (
          <EmptyState
            icon={<Coins className="w-20 h-20" />}
            title="No expenses yet"
            description="Start tracking your travel expenses by adding your first expense"
            action={{
              label: "Add Your First Expense",
              onClick: onAddExpense,
            }}
          />
        )
      ) : (
        <div className="space-y-3">
          {expenses.map((expense, index) => {
            const categoryData = CATEGORIES.find(
              (c) => c.id === expense.category,
            );
            const Icon = categoryData?.icon;
            return (
              <div
                key={expense.id.toString()}
                className="group bg-white rounded-xl shadow-soft hover:shadow-soft-lg border border-travel-stone-200 hover:border-travel-amber-200 p-5 transition-all duration-200 animate-slide-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="shrink-0 p-2.5 bg-travel-stone-50 rounded-lg border border-travel-stone-200 group-hover:border-travel-amber-200 transition-all duration-200">
                    {Icon && typeof Icon === "function" ? (
                      <Icon
                        className="w-7 h-7 transition-transform duration-200 group-hover:scale-110"
                        style={{ color: categoryData?.color }}
                      />
                    ) : (
                      <Package className="w-7 h-7" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-travel-navy-900 text-lg">
                          {categoryData?.label || expense.category}
                        </h3>
                        {expense.note && (
                          <p className="text-sm text-travel-navy-600 mt-0.5 line-clamp-1">
                            {expense.note}
                          </p>
                        )}
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
                          <p className="text-sm text-travel-navy-500 font-mono mt-0.5 truncate">
                            {formatCurrency(
                              Number(expense.amount),
                              expense.localCurrency,
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-travel-stone-100">
                      <p className="text-sm text-travel-navy-400">
                        {formatDate(expense.date)}
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => onEditExpense(expense.id)}
                          className="text-sm text-travel-amber-600 hover:text-travel-amber-700 flex items-center gap-1.5 font-medium transition-colors duration-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense.id)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 font-medium transition-colors duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
};
