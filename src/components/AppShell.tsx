import type { ReactNode } from "react";

export function AppShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`anga-app-shell min-h-screen bg-background ${className}`}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col">{children}</div>
    </div>
  );
}
