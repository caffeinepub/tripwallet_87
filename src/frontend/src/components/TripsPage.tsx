import React, { useState } from "react";
import { useTrips, useDeleteTrip } from "../hooks/useQueries";
import { formatCurrency } from "../utils/exchangeRates";
import { formatDate } from "../utils/formatters";
import { FormButton } from "./shared/FormButton";
import { EmptyState } from "./shared/EmptyState";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Plane, Trash2 } from "lucide-react";

interface TripsPageProps {
  onCreateTrip: () => void;
}

export const TripsPage: React.FC<TripsPageProps> = ({ onCreateTrip }) => {
  const { data: trips } = useTrips();
  const deleteTrip = useDeleteTrip();
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleDeleteClick = (id: bigint) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteTrip.mutateAsync(deleteId);
      } catch (error) {
        // Error handled silently
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-semibold text-travel-navy-900 tracking-tight">
          My Trips
        </h2>
        <FormButton onClick={onCreateTrip} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Trip
        </FormButton>
      </div>

      {!trips || trips.length === 0 ? (
        <EmptyState
          icon={<Plane className="w-20 h-20" />}
          title="No trips yet"
          description="Create your first trip to start tracking your travel expenses"
          action={{
            label: "Create Your First Trip",
            onClick: onCreateTrip,
          }}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {trips.map((trip, index) => (
            <div
              key={trip.id.toString()}
              className="group bg-white rounded-xl shadow-soft hover:shadow-soft-lg border border-travel-stone-200 p-6 transition-all duration-200 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-display font-semibold text-travel-navy-900 tracking-tight">
                    {trip.name}
                  </h3>
                  {trip.isActive && (
                    <Badge
                      variant="default"
                      className="mt-2 bg-travel-amber-100 text-travel-amber-700 border-travel-amber-200"
                    >
                      Active Trip
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClick(trip.id)}
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1.5 transition-colors duration-200 opacity-70 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-travel-navy-500">Currency:</span>
                  <span className="font-semibold text-travel-navy-900">
                    {trip.primaryCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-travel-navy-500">Budget:</span>
                  <span className="font-mono font-semibold text-travel-navy-900">
                    {formatCurrency(trip.budgetLimit, trip.primaryCurrency)}
                  </span>
                </div>
                {trip.startDate !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-travel-navy-500">Start:</span>
                    <span className="text-travel-navy-700">
                      {formatDate(trip.startDate)}
                    </span>
                  </div>
                )}
                {trip.endDate !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-travel-navy-500">End:</span>
                    <span className="text-travel-navy-700">
                      {formatDate(trip.endDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Trip"
        description="Are you sure? This will delete the trip and all its expenses. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
};
