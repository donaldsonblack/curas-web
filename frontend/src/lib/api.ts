import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Placeholder for getting the auth token from our auth library (e.g., Cognito)
// In a real app, this would come from localStorage, a cookie, or state management.
const getAuthToken = () => {
  // return localStorage.getItem('authToken');
  return 'dummy-jwt'; // Replace with real token logic
};

/**
 * A helper function for making authenticated API requests.
 * It automatically adds the Authorization header and handles JSON parsing and errors.
 * @param endpoint The API endpoint to call (e.g., '/users/me').
 * @param options The options for the fetch request (method, body, etc.).
 * @returns The parsed JSON response.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to parse RFC 7807 problem details
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.detail || response.statusText;
    throw new Error(`API Error: ${response.status} ${errorMessage}`);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// --- API Endpoint Functions ---

// Example User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['NURSE', 'NUM']),
  displayName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Fetches the currently authenticated user's details.
 */
export const getMe = async (): Promise<User> => {
  const data = await apiFetch<User>('/me', { method: 'GET' });
  return UserSchema.parse(data);
};

// We will add more API functions here as we build features, for example:
/*
export const getWards = async (): Promise<Ward[]> => {
  return apiFetch<Ward[]>('/wards', { method: 'GET' });
}
*/
