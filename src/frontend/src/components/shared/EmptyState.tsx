import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl p-12 border border-travel-stone-200 text-center shadow-soft animate-fade-in">
      <div className="text-travel-amber-500 mb-6 flex justify-center opacity-80">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold text-travel-navy-900 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-travel-navy-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-travel-amber-500 hover:bg-travel-amber-600 text-white font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
