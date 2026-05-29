import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/app-sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />
        <main className="flex-1 px-4 sm:px-6 lg:pl-2 lg:pr-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
