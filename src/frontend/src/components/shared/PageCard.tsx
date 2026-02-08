import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PageCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function PageCard({
  title,
  subtitle,
  children,
  className = "",
  headerAction,
}: PageCardProps) {
  return (
    <Card
      className={`bg-white border-travel-stone-200 shadow-soft hover:shadow-soft-lg transition-shadow duration-300 ${className}`}
    >
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-travel-navy-900 font-display font-semibold text-xl tracking-tight">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-travel-navy-500 mt-1 font-light">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent className={title ? "" : "pt-6"}>{children}</CardContent>
    </Card>
  );
}
