import type { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";


const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_eGBWCCrnC",
  client_id: "59n0rkhsdagoehhi3kf8q25t1f",
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid phone profile",
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