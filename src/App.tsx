
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import MoveIn from "./pages/MoveIn";
import Maintenance from "./pages/Maintenance";
import Operator from "./pages/Operator";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";
import OwnerLogin from "./pages/OwnerLogin";
import UnknownRole from "./pages/UnknownRole";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading, userProfile } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={getDefaultRouteForRole(userProfile)} replace />;
  }
  
  return <>{children}</>;
}

function getDefaultRouteForRole(userProfile: any): string {
  // Special case for super admin email
  if (userProfile.email === 'info@applaudliving.com') {
    return '/super-admin';
  }
  
  switch (userProfile.role) {
    case 'super_admin':
      return '/super-admin';
    case 'senior_operator':
    case 'operator':
    case 'leasing':
      return '/operator';
    case 'maintenance':
      return '/maintenance';
    case 'resident':
      return '/';
    case 'prospect':
      return '/discovery';
    default:
      return '/unknown-role';
  }
}

function AppRoutes() {
  const { user, userProfile, loading } = useAuth();
  
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect from login pages to appropriate dashboard
  const shouldRedirectFromLogin = user && userProfile;
  const defaultRoute = shouldRedirectFromLogin ? getDefaultRouteForRole(userProfile) : null;

  return (
    <Routes>
      <Route path="/login" element={
        shouldRedirectFromLogin ? (
          <Navigate to={defaultRoute!} replace />
        ) : <Login />
      } />
      <Route path="/owner-login" element={
        shouldRedirectFromLogin ? (
          <Navigate to={defaultRoute!} replace />
        ) : <OwnerLogin />
      } />
      <Route path="/unknown-role" element={
        <ProtectedRoute>
          <UnknownRole />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['resident', 'super_admin']}>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/discovery" element={
        <ProtectedRoute allowedRoles={['prospect', 'super_admin']}>
          <Discovery />
        </ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute allowedRoles={['prospect', 'super_admin']}>
          <Matches />
        </ProtectedRoute>
      } />
      <Route path="/movein" element={
        <ProtectedRoute allowedRoles={['resident', 'super_admin']}>
          <MoveIn />
        </ProtectedRoute>
      } />
      <Route path="/movein/:homeId" element={
        <ProtectedRoute allowedRoles={['resident', 'super_admin']}>
          <MoveIn />
        </ProtectedRoute>
      } />
      <Route path="/maintenance" element={
        <ProtectedRoute allowedRoles={['maintenance', 'super_admin']}>
          <Maintenance />
        </ProtectedRoute>
      } />
      <Route path="/operator" element={
        <ProtectedRoute allowedRoles={['senior_operator', 'operator', 'leasing', 'super_admin']}>
          <Operator />
        </ProtectedRoute>
      } />
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <SuperAdmin />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
