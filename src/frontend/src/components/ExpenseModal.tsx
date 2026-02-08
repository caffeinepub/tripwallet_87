import React, { useState, useEffect } from "react";
import {
  useActiveTrip,
  useAddExpense,
  useUpdateExpense,
  useExpenses,
  useExchangeRates,
  useAvailableCurrencies,
} from "../hooks/useQueries";
import { CATEGORIES } from "../constants";
import { convertCurrency, formatCurrency } from "../utils/exchangeRates";
import {
  getTodayLocalDate,
  localDateStringToNanoseconds,
  nanosecondsToLocalDateString,
} from "../utils/formatters";
import { Modal } from "./shared/Modal";
import { FormButton } from "./shared/FormButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface ExpenseModalProps {
  expenseId?: bigint;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  expenseId,
  onClose,
}) => {
  const { data: activeTrip } = useActiveTrip();
  const { data: expenses } = useExpenses(activeTrip?.id);
  const { data: rates } = useExchangeRates();
  const { currencies } = useAvailableCurrencies();
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();

  const existingExpense = expenses?.find((e) => e.id === expenseId);

  const [amount, setAmount] = useState(
    existingExpense ? String(existingExpense.amount) : "",
  );
  const [currency, setCurrency] = useState(
    existingExpense?.localCurrency || activeTrip?.primaryCurrency || "USD",
  );
  const [category, setCategory] = useState(existingExpense?.category || "food");
  const [note, setNote] = useState(existingExpense?.note || "");
  const [date, setDate] = useState(
    existingExpense
      ? nanosecondsToLocalDateString(existingExpense.date)
      : getTodayLocalDate(),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state when expense data becomes available (for edit mode)
  useEffect(() => {
    if (expenseId !== undefined && expenses) {
      const expense = expenses.find((e) => e.id === expenseId);
      if (expense) {
        setAmount(String(expense.amount));
        setCurrency(expense.localCurrency);
        setCategory(expense.category);
        setNote(expense.note || "");
        setDate(nanosecondsToLocalDateString(expense.date));
      }
    }
  }, [expenseId, expenses]);

  const ratesMap: Record<string, number> = {};
  rates?.forEach((r) => {
    ratesMap[r.code] = Number(r.rate);
  });

  const convertedAmount =
    amount && activeTrip
      ? convertCurrency(
          Number(amount),
          currency,
          activeTrip.primaryCurrency,
          ratesMap,
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear any previous errors

    if (!activeTrip || !amount) {
      setErrorMessage(
        "Missing required information. Please ensure you have an active trip and amount.",
      );
      return;
    }

    try {
      const dateNano = localDateStringToNanoseconds(date);

      if (expenseId !== undefined) {
        await updateExpense.mutateAsync({
          id: expenseId,
          amount: Number(amount),
          localCurrency: currency,
          category,
          note,
          date: dateNano,
        });
      } else {
        await addExpense.mutateAsync({
          tripId: activeTrip.id,
          amount: Number(amount),
          localCurrency: currency,
          category,
          note,
          date: dateNano,
        });
      }
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Failed to save expense: ${errorMsg}`);
    }
  };

  if (!activeTrip) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={expenseId !== undefined ? "Edit Expense" : "Add Expense"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="amount" className="mb-2">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="font-mono"
          />
        </div>

        <div>
          <Label htmlFor="currency" className="mb-2">
            Currency
          </Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="flex h-10 w-full rounded-md border border-travel-stone-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-travel-amber-500 focus-visible:ring-offset-2 transition-all duration-200"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {currency !== activeTrip.primaryCurrency && amount && (
          <div className="p-3 bg-travel-amber-50 border border-travel-amber-200 rounded-xl flex items-center gap-2 animate-fade-in">
            <Info className="w-4 h-4 text-travel-amber-600 shrink-0" />
            <p className="text-sm text-travel-amber-900 font-medium">
              ≈{" "}
              <span className="font-mono">
                {formatCurrency(convertedAmount, activeTrip.primaryCurrency)}
              </span>
            </p>
          </div>
        )}

        <div>
          <Label className="mb-3">Category</Label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    category === cat.id
                      ? "border-travel-amber-500 bg-travel-amber-50 shadow-soft"
                      : "border-travel-stone-200 hover:border-travel-stone-300 hover:bg-travel-stone-50"
                  }`}
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-1 transition-transform duration-200 hover:scale-110"
                    style={{ color: cat.color }}
                  />
                  <div className="text-xs font-medium text-travel-navy-700">
                    {cat.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="note" className="mb-2">
            Note (Optional)
          </Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="What was this for?"
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="date" className="mb-2">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-900 font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-travel-stone-200">
          <FormButton
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            loading={addExpense.isPending || updateExpense.isPending}
            className="flex-1"
          >
            {expenseId !== undefined ? "Update" : "Add"} Expense
          </FormButton>
        </div>
      </form>
    </Modal>
  );
};
