import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InsulinTitration from "@/calculators/diabetes/InsulinTitration";
import HypoRiskCalculator from "@/calculators/diabetes/HypoRisk";
import RenalDoseAdjustment from "@/calculators/diabetes/RenalDosing";
import SlidingScaleInsulin from "@/calculators/diabetes/SlidingScale";
import NotFound from "@/components/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root route will be configured in Task 7 */}
          <Route path="/insulin-titration" element={<InsulinTitration />} />
          <Route path="/sliding-scale" element={<SlidingScaleInsulin />} />
          <Route path="/hypo-risk" element={<HypoRiskCalculator />} />
          <Route path="/renal-dosing" element={<RenalDoseAdjustment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
