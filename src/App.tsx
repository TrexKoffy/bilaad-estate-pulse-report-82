import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AddProject from "./pages/AddProject";
import ManageProjects from "./pages/ManageProjects";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/add-project" element={
                  <ProtectedRoute>
                    <AddProject />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                  <ProtectedRoute>
                    <ManageProjects />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
