import React, { useState } from "react";
import { useCreateTrip, useAvailableCurrencies } from "../hooks/useQueries";
import { Modal } from "./shared/Modal";
import { FormButton } from "./shared/FormButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TripModalProps {
  onClose: () => void;
}

export const TripModal: React.FC<TripModalProps> = ({ onClose }) => {
  const createTrip = useCreateTrip();
  const { currencies } = useAvailableCurrencies();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget) return;

    try {
      await createTrip.mutateAsync({
        name,
        primaryCurrency: currency,
        budgetLimit: Number(budget),
      });
      // Cache is updated inside mutationFn before this resolves
      onClose();
    } catch (error) {
      // Error handled silently
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Trip">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="trip-name" className="mb-2">
            Trip Name
          </Label>
          <Input
            id="trip-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Japan 2026"
            required
          />
        </div>

        <div>
          <Label htmlFor="currency" className="mb-2">
            Primary Currency
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

        <div>
          <Label htmlFor="budget" className="mb-2">
            Budget Limit
          </Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="0.00"
            required
            className="font-mono"
          />
        </div>

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
            loading={createTrip.isPending}
            className="flex-1"
          >
            Create Trip
          </FormButton>
        </div>
      </form>
    </Modal>
  );
};
