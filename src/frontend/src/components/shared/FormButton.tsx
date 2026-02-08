import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  type?: "submit" | "button";
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FormButton({
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  onClick,
  className = "",
}: FormButtonProps) {
  const variantClasses = {
    primary:
      "bg-travel-amber-500 hover:bg-travel-amber-600 text-white shadow-soft hover:shadow-soft-lg transition-all duration-200",
    secondary:
      "bg-travel-stone-100 hover:bg-travel-stone-200 text-travel-navy-700 border border-travel-stone-300 transition-all duration-200",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-soft hover:shadow-soft-lg transition-all duration-200",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClasses[variant]} font-medium ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
