
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResidentProvider } from "@/contexts/ResidentContext";
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

// Temporary: Bypass authentication for debugging
function BypassRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ResidentProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/owner-login" element={<OwnerLogin />} />
              <Route path="/unknown-role" element={<UnknownRole />} />
              
              {/* Temporarily bypass auth for all routes */}
              <Route path="/" element={<BypassRoute><Index /></BypassRoute>} />
              <Route path="/discovery" element={<BypassRoute><Discovery /></BypassRoute>} />
              <Route path="/matches" element={<BypassRoute><Matches /></BypassRoute>} />
              <Route path="/movein" element={<BypassRoute><MoveIn /></BypassRoute>} />
              <Route path="/movein/:homeId" element={<BypassRoute><MoveIn /></BypassRoute>} />
              <Route path="/maintenance" element={<BypassRoute><Maintenance /></BypassRoute>} />
              <Route path="/operator" element={<BypassRoute><Operator /></BypassRoute>} />
              <Route path="/super-admin" element={<BypassRoute><SuperAdmin /></BypassRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ResidentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
