import type { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";


const cognitoAuthConfig = {
	authority: import.meta.env.VITE_COGNITO_AUTHORITY,
	client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPEPE,
  scope: import.meta.env.VITE_COGNITO_SCOPE,
};

interface AuthProviderProps {
  children: ReactNode;
}

export function Auth({ children }: AuthProviderProps) {
  if (
    !cognitoAuthConfig.authority ||
    !cognitoAuthConfig.client_id ||
    !cognitoAuthConfig.redirect_uri
  ) {
    console.error("Missing OIDC config:", cognitoAuthConfig);
    return <div>Missing OIDC config.</div>;
  }

  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
