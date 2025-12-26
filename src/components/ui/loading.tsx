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
      <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
        {/* Top arc - 35% gap */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="70.7 212.1"
          strokeDashoffset="0"
        />
        {/* Bottom arc - 35% gap */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="70.7 212.1"
          strokeDashoffset="-141.4"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.5)" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>
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
