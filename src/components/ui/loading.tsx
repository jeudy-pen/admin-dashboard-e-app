import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loading({ size = "md", className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg,
            hsl(0 84% 60%),
            hsl(25 95% 53%),
            hsl(45 93% 47%),
            hsl(142 71% 45%),
            hsl(199 89% 48%),
            hsl(262 83% 58%),
            hsl(0 84% 60%)
          )`,
          animation: "spin 1s linear infinite",
        }}
      />
      <div className="absolute inset-[2px] rounded-full bg-background" />
    </div>
  );
}

export function LoadingOverlay({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", className)}>
      <Loading size="lg" />
    </div>
  );
}

export function LoadingButton({ className }: { className?: string }) {
  return <Loading size="sm" className={className} />;
}
