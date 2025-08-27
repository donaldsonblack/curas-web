import { useCleanAuthCallbackUrl } from "./auth/useCleanAuthCallback";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layouts/AppShell";
import NotFound from "./pages/NotFound";
import { primaryRoutes, secondaryRoutes, hiddenRoutes } from "./Routes.tsx";

function App() {
  useCleanAuthCallbackUrl();
  const allRoutes = [...primaryRoutes, ...secondaryRoutes, ...hiddenRoutes].filter(
    (route) => route.type !== "dialog"
  );

  return (
    <Routes>
      <Route element={<AppShell />}>
        {allRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
