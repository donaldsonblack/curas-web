import { type ReactNode } from "react";
import { withAuthenticationRequired } from "react-oidc-context";

interface AuthGateProps {
  children: ReactNode;
}

export const AuthGate = withAuthenticationRequired(
  ({ children }: AuthGateProps) => <>{children}</>,
  {
    OnRedirecting: () => (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground dark:border-zinc-700 dark:border-t-white" />
          <p className="text-muted-foreground text-sm dark:text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    )
  }
);
