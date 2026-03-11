import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerBackground from "./pages/CustomerBackground";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Payment from "./pages/Payment";
import Catering from "./pages/Catering";
import MyOrders from "./pages/MyOrders";
import OrderSummary from "./pages/OrderSummary";
import Inquiries from "./pages/Inquiries";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCateringOrders from "./pages/admin/CateringOrders";
import AdminCustomers from "./pages/admin/Customers";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminAnalytics from "./pages/admin/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/customer-background" element={<CustomerBackground />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order-summary/:orderId" element={<OrderSummary />} />
              <Route path="/inquiries" element={<Inquiries />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/catering-orders" element={<AdminCateringOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
