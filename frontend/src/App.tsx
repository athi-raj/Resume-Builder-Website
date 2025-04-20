import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import RequireAuth from "./components/auth/RequireAuth";
import ChatBot from "./components/chat/ChatBot";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/builder" element={
            <RequireAuth>
              <Builder />
            </RequireAuth>
          } />
          <Route path="/templates" element={
            <RequireAuth>
              <Templates />
            </RequireAuth>
          } />
          <Route path="/preview" element={
            <RequireAuth>
              <Preview />
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
