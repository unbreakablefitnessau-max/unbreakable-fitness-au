import { AccessGate } from "@/components/layout/AccessGate";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { AdminPage } from "@/pages/AdminPage";
import { ChatPage } from "@/pages/ChatPage";
import { HomePage } from "@/pages/HomePage";
import { WorkoutDetailPage } from "@/pages/WorkoutDetailPage";
import { WorkoutsPage } from "@/pages/WorkoutsPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <AccessGate />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const workoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts",
  component: WorkoutsPage,
});

const workoutDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts/$workoutId",
  component: WorkoutDetailPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: () => (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
        404
      </p>
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        That page isn&apos;t part of the member area. Head back to your
        dashboard.
      </p>
      <a
        href="/"
        className="font-mono text-xs uppercase tracking-[0.16em] text-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        Back to dashboard
      </a>
    </div>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workoutsRoute,
  workoutDetailRoute,
  chatRoute,
  adminRoute,
  notFoundRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  registerServiceWorker();
  return <RouterProvider router={router} />;
}
