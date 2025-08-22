import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export function useCleanAuthCallbackUrl() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && window.location.search.includes("code=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [auth.isAuthenticated]);
}