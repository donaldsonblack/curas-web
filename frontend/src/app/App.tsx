import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { LoginPage } from './routes/LoginPage';

const queryClient = new QueryClient();

// A wrapper for routes that require authentication
function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renders the child route's element
}

// A component to handle role-based redirection from the root path
function RoleBasedRedirect() {
  const { user } = useAuth();
  // Default to ward 1 for MVP. This would be dynamic in a real app.
  const wardId = '1'; 

  if (user?.role === 'NUM') {
    return <Navigate to={`/ward/${wardId}/dashboard`} replace />;
  } else if (user?.role === 'NURSE') {
    return <Navigate to={`/ward/${wardId}/checklists`} replace />;
  }

  // Fallback if user has no role or is not logged in (should be caught by ProtectedRoute)
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/ward/:wardId/dashboard" element={<h1>NUM Dashboard</h1>} />
        <Route path="/ward/:wardId/checklists" element={<h1>Nurse Checklist View</h1>} />
        {/* More protected routes will be added here */}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
