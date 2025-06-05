
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResidentProvider } from "@/contexts/ResidentContext";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import MoveIn from "./pages/MoveIn";
import Maintenance from "./pages/Maintenance";
import Operator from "./pages/Operator";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <ResidentProvider>
          <Routes>
            {/* All routes are now open without authentication */}
            <Route path="/" element={<Index />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/movein" element={<MoveIn />} />
            <Route path="/movein/:homeId" element={<MoveIn />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ResidentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
