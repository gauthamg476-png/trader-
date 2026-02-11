import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAuth();
  const { products, orders, inquiries, customers, notifications } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const bulkOrders = orders.filter(o => o.status === 'bulk');
  const pendingInquiries = inquiries.filter(i => !i.reply);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentNotifications = notifications
    .filter(n => !n.isRead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Welcome back, Admin!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your trading business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold text-foreground">{products.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalStock} kg in stock
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-foreground">{orders.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {confirmedOrders.length} confirmed, {bulkOrders.length} bulk
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                  <p className="text-3xl font-bold text-foreground">{customers.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered users
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total sales value
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingInquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.reduce((sum, o) => sum + o.quantity, 0)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">Total Quantity Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {order.cancelledAt ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : order.status === 'confirmed' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{order.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerName} • {order.quantity} kg
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ₹{order.totalPrice.toLocaleString()}
                        </p>
                        <Badge
                          className={
                            order.cancelledAt
                              ? 'bg-red-500 text-white'
                              : order.status === 'confirmed'
                              ? 'bg-green-500 text-white'
                              : order.status === 'pending'
                              ? 'bg-yellow-500 text-white'
                              : ''
                          }
                        >
                          {order.cancelledAt ? 'CANCELLED' : order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {recentNotifications.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No new notifications
                </p>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        notification.type === 'order' ? 'bg-primary' : 'bg-warning'
                      }`} />
                      <div>
                        <p className="text-sm text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
