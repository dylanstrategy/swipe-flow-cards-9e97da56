
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ResidentProvider } from "@/contexts/ResidentContext";
import Home from "./pages/Home";
import Resident from "./pages/Resident";
import Prospect from "./pages/Prospect";
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
    <ProfileProvider>
      <ResidentProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resident" element={<Resident />} />
              <Route path="/prospect" element={<Prospect />} />
              <Route path="/super-admin" element={<SuperAdmin />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/movein" element={<MoveIn />} />
              <Route path="/movein/:homeId" element={<MoveIn />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/operator" element={<Operator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ResidentProvider>
    </ProfileProvider>
  </QueryClientProvider>
);

export default App;
