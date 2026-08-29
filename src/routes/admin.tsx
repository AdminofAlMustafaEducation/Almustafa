import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  errorComponent: AdminErrorComponent,
  pendingComponent: AdminPendingComponent,
});

function AdminPendingComponent() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
        <p className="text-sm text-gray-500">Loading admin panel...</p>
      </div>
    </div>
  );
}

function AdminErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-gray-600">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Reload Page
          </Button>
          <Button onClick={() => (window.location.href = "/admin")}>Go to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-dvh bg-gray-50">
        <AdminSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
