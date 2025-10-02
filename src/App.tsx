import { useCleanAuthCallbackUrl } from "./auth/useCleanAuthCallback";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layouts/AppShell";
import NotFound from "./pages/NotFound";
import { primaryRoutes, secondaryRoutes, hiddenRoutes } from "./Routes.tsx";
import { FormRepositoryProvider } from "./features/forms/api/FormRepository";
import { InMemoryFormRepository } from "./features/forms/api/InMemoryFormRepository";

function App() {
  useCleanAuthCallbackUrl();
  const allRoutes = [...primaryRoutes, ...secondaryRoutes, ...hiddenRoutes].filter(
    (route) => route.type !== "dialog"
  );

  // Initialize the form repository
  const formRepository = new InMemoryFormRepository();

  return (
    <FormRepositoryProvider value={formRepository}>
      <Routes>
        <Route element={<AppShell />}>
          {allRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </FormRepositoryProvider>
  );
}

export default App;
