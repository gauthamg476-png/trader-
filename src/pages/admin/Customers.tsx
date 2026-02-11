import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Users, Building2, TrendingUp, Store, UserCheck } from 'lucide-react';
import { BusinessType } from '@/types';

const businessTypeIcons: Record<BusinessType, React.ElementType> = {
  'Individual Consumer': Users,
  'Business Owner': Building2,
  'Trader': TrendingUp,
  'Retailer': Store,
  'Broker / Agent': UserCheck,
};

export default function AdminCustomers() {
  const { user, isLoading, isAdmin } = useAuth();
  const { customers, orders } = useData();
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

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const getCustomerTotalSpent = (customerId: string) => {
    return getCustomerOrders(customerId).reduce((sum, o) => sum + o.totalPrice, 0);
  };

  const businessTypeCounts = customers.reduce((acc, customer) => {
    const type = customer.businessType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            View registered customers and their business details
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-xs text-muted-foreground">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(businessTypeCounts).map(([type, count]) => {
            const Icon = businessTypeIcons[type as BusinessType] || Users;
            return (
              <Card key={type}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground truncate">{type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Username</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No customers registered yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => {
                      const customerOrders = getCustomerOrders(customer.id);
                      const totalSpent = getCustomerTotalSpent(customer.id);
                      const Icon = customer.businessType 
                        ? businessTypeIcons[customer.businessType]
                        : Users;

                      return (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {customer.username[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium">{customer.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.businessType ? (
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.businessType}</span>
                              </div>
                            ) : (
                              <Badge variant="secondary">Not specified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {customerOrders.length}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{totalSpent.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
