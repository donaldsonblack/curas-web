/**
 * A mock hook to check if the current user is an admin.
 * @returns {boolean} Returns true for development purposes.
 */
export function useAdmin(): boolean {
  // In the future, this will involve a call to an auth context or API.
  // For now, it's just a mock for development.
  return true;
}
