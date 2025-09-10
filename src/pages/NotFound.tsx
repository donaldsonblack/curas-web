import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-4xl font-bold text-foreground sm:text-6xl">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Oops! Page not found.</p>
      <Link to="/" className="mt-6">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}

export default NotFound;