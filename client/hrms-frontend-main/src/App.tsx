
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import AuthPage from "./pages/AuthPage";
import CandidatesPage from "./pages/CandidatesPage";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import LeavesPage from "./pages/LeavesPage";
import LogoutPage from "./pages/LogoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/candidates" />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leaves" element={<LeavesPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
