import React, { useState } from "react";
import {
  useLastRateUpdate,
  useFetchExchangeRates,
  useApiKey,
  useSetApiKey,
  useDeleteApiKey,
  useExpensesEnabled,
} from "../hooks/useQueries";
import { formatDateTime } from "../utils/formatters";
import { PageCard } from "./shared/PageCard";
import { FormButton } from "./shared/FormButton";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  AlertCircle,
  Key,
  Edit2,
  Trash2,
  Shield,
  ShieldOff,
} from "lucide-react";

const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.fxratesapi.com/latest?api_key=${encodeURIComponent(key)}`,
    );
    if (response.status >= 500 && response.status < 600)
      throw new Error("Invalid API key.");
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
};

export const SettingsPage: React.FC = () => {
  const { data: lastUpdate } = useLastRateUpdate();
  const { data: apiKey, isLoading: isLoadingApiKey } = useApiKey();
  const { data: expensesEnabled } = useExpensesEnabled();
  const fetchRates = useFetchExchangeRates();
  const setApiKeyMutation = useSetApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasApiKey = !!apiKey;

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setValidationError("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setSuccessMessage(null);

    try {
      const isValid = await validateApiKey(apiKeyInput.trim());

      if (!isValid) {
        setValidationError(
          "Invalid API key. Please check your key and try again.",
        );
        setIsValidating(false);
        return;
      }

      await setApiKeyMutation.mutateAsync(apiKeyInput.trim());

      try {
        await fetchRates.mutateAsync();
        setSuccessMessage(
          "API key saved and exchange rates fetched successfully!",
        );
      } catch {
        setSuccessMessage(
          "API key saved. Exchange rates will be fetched shortly.",
        );
      }

      setApiKeyInput("");
      setIsEditing(false);
    } catch (error) {
      console.error({ error });
      setValidationError("Failed to save API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleEditApiKey = () => {
    setIsEditing(true);
    setApiKeyInput("");
    setValidationError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setApiKeyInput("");
    setValidationError(null);
  };

  const handleDeleteApiKey = async () => {
    try {
      await deleteApiKeyMutation.mutateAsync();
      setSuccessMessage("API key deleted successfully.");
      setShowDeleteConfirm(false);
    } catch {
      setValidationError("Failed to delete API key. Please try again.");
    }
  };

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      await fetchRates.mutateAsync();
      setLastRefresh(new Date());
    } catch {
      setRefreshError(
        "Failed to refresh exchange rates. Please check your API key.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-display font-semibold text-travel-navy-900 tracking-tight">
        Settings
      </h2>

      {/* Status Card */}
      <PageCard title="Expense Tracking Status">
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-gradient-to-r from-travel-stone-50 to-white border-travel-stone-200">
          {expensesEnabled ? (
            <>
              <div className="p-2 bg-travel-sage-100 rounded-lg">
                <Shield className="w-6 h-6 text-travel-sage-600" />
              </div>
              <div>
                <p className="font-semibold text-travel-sage-700">
                  Expenses Enabled
                </p>
                <p className="text-sm text-travel-navy-500">
                  You can create and track expenses
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-travel-amber-100 rounded-lg">
                <ShieldOff className="w-6 h-6 text-travel-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-travel-amber-700">
                  Expenses Disabled
                </p>
                <p className="text-sm text-travel-navy-500">
                  Add an API key below to enable expense tracking
                </p>
              </div>
            </>
          )}
        </div>
      </PageCard>

      {/* API Key Management Card */}
      <PageCard title="Exchange Rate API Key">
        <div className="space-y-4">
          <p className="text-sm text-travel-navy-600">
            TripWallet uses{" "}
            <a
              href="https://fxratesapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-travel-amber-600 hover:underline"
            >
              fxratesapi.com
            </a>{" "}
            for currency conversion. Get your free API key to enable expense
            tracking.
          </p>
          <p className="text-xs text-travel-navy-400 mt-2">
            Note: fxratesapi may sometimes accept invalid keys temporarily, but
            a valid official API key from fxratesapi.com provides more stable
            and reliable service.
          </p>

          {isLoadingApiKey ? (
            <div className="p-4 bg-travel-stone-50 rounded-xl border border-travel-stone-200">
              <p className="text-sm text-travel-navy-500">Loading...</p>
            </div>
          ) : hasApiKey && !isEditing ? (
            <div className="space-y-4">
              <div className="p-4 bg-travel-stone-50 rounded-xl border border-travel-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-travel-navy-400" />
                    <div>
                      <p className="text-sm text-travel-navy-500 font-medium">
                        Current API Key
                      </p>
                      <p className="text-travel-navy-900 font-mono font-semibold">
                        {apiKey}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <FormButton
                  onClick={handleEditApiKey}
                  variant="secondary"
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Key
                </FormButton>
                <FormButton
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Key
                </FormButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-travel-navy-700 mb-2">
                  {isEditing ? "New API Key" : "API Key"}
                </label>
                <Input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter your fxratesapi.com API key"
                  className="font-mono"
                />
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="text-sm text-red-900 font-medium">
                    {validationError}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-travel-sage-50 border border-travel-sage-200 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-travel-sage-600 shrink-0" />
                  <p className="text-sm text-travel-sage-900 font-medium">
                    {successMessage}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <FormButton
                  onClick={handleSaveApiKey}
                  disabled={isValidating || !apiKeyInput.trim()}
                  loading={isValidating}
                  variant="primary"
                  className="flex-1"
                >
                  {isValidating ? "Validating..." : "Save API Key"}
                </FormButton>
                {isEditing && (
                  <FormButton
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </FormButton>
                )}
              </div>
            </div>
          )}
        </div>
      </PageCard>

      {/* Exchange Rates Card - Only show when API key is configured */}
      {hasApiKey && (
        <PageCard title="Exchange Rates">
          <div className="space-y-4">
            <div className="p-4 bg-travel-stone-50 rounded-xl border border-travel-stone-200">
              <p className="text-sm text-travel-navy-500 font-medium mb-1">
                Last Updated
              </p>
              <p className="text-travel-navy-900 font-semibold">
                {lastUpdate && lastUpdate > 0n
                  ? formatDateTime(lastUpdate)
                  : "Never"}
              </p>
              {lastRefresh && (
                <p className="text-sm text-travel-sage-600 mt-2 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Refreshed {lastRefresh.toLocaleTimeString()}
                </p>
              )}
              {refreshError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {refreshError}
                </p>
              )}
            </div>

            <FormButton
              onClick={handleRefreshRates}
              disabled={isRefreshing}
              loading={isRefreshing}
              variant="primary"
              className="w-full"
            >
              Refresh Exchange Rates
            </FormButton>
          </div>
        </PageCard>
      )}

      <PageCard title="About TripWallet">
        <p className="text-sm text-travel-navy-600 leading-relaxed">
          TripWallet helps you track travel expenses in multiple currencies with
          automatic conversion. All data is stored securely on the Internet
          Computer blockchain.
        </p>
      </PageCard>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteApiKey}
        title="Delete API Key"
        description="Are you sure you want to delete your API key? This will disable expense tracking until you add a new key."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
};
