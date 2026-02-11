import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, Clock, ShoppingCart, Package, Search, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function AdminOrders() {
  const { user, isLoading, isAdmin } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    toast.success('Order status updated successfully!');
  };

  const exportToExcel = (orderList: typeof orders, filename: string) => {
    // Prepare data for export
    const exportData = orderList.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customerName,
      'Contact Phone': order.contactPhone || 'N/A',
      'Delivery Address': order.deliveryAddress || 'N/A',
      'Product': order.productName,
      'Quantity (kg)': order.quantity,
      'Price per kg': order.pricePerUnit,
      'Total Price': order.totalPrice,
      'Status': order.cancelledAt ? 'CANCELLED' : order.status.toUpperCase(),
      'Order Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
      'Expected Delivery': new Date(order.expectedDelivery).toLocaleDateString('en-IN'),
      'Cancellation Reason': order.cancellationReason || 'N/A'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Order ID
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Contact Phone
      { wch: 30 }, // Delivery Address
      { wch: 25 }, // Product
      { wch: 12 }, // Quantity
      { wch: 12 }, // Price per kg
      { wch: 12 }, // Total Price
      { wch: 12 }, // Status
      { wch: 15 }, // Order Date
      { wch: 18 }, // Expected Delivery
      { wch: 25 }  // Cancellation Reason
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fullFilename);
    toast.success(`Exported ${orderList.length} orders to ${fullFilename}`);
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const packedOrders = orders.filter(o => o.status === 'packed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const allOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Search filter function
  const filterOrders = (orderList: typeof orders) => {
    if (!searchQuery.trim()) return orderList;
    
    const query = searchQuery.toLowerCase();
    return orderList.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.productName.toLowerCase().includes(query) ||
      (order.contactPhone && order.contactPhone.toLowerCase().includes(query))
    );
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);

  const OrderTable = ({ orderList }: { orderList: typeof orders }) => (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Delivery Address</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Update Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orderList.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-sm">
                  {order.contactPhone || <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="text-sm max-w-xs truncate">
                  {order.deliveryAddress || <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell className="text-right">{order.quantity} kg</TableCell>
                <TableCell className="text-right font-medium">
                  ₹{order.totalPrice.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.cancelledAt
                        ? 'bg-red-500'
                        : order.status === 'confirmed'
                        ? 'bg-green-500'
                        : order.status === 'packed'
                        ? 'bg-blue-500'
                        : order.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }
                  >
                    {order.cancelledAt 
                      ? 'CANCELLED' 
                      : order.status === 'packed' 
                      ? 'Order Packed' 
                      : order.status === 'delivered' 
                      ? 'Delivered' 
                      : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusUpdate(order.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="packed">Order Packed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{confirmedOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuantity} kg</p>
                  <p className="text-xs text-muted-foreground">Total Qty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Orders</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  onClick={() => exportToExcel(filterOrders(allOrders), 'BalajiCo_Trader_Orders')}
                  variant="outline"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export to Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">
                  All ({filterOrders(allOrders).length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({filterOrders(pendingOrders).length})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmed ({filterOrders(confirmedOrders).length})
                </TabsTrigger>
                <TabsTrigger value="packed">
                  Packed ({filterOrders(packedOrders).length})
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  Delivered ({filterOrders(deliveredOrders).length})
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="all">
                  <OrderTable orderList={filterOrders(allOrders)} />
                </TabsContent>
                <TabsContent value="pending">
                  <OrderTable orderList={filterOrders(pendingOrders)} />
                </TabsContent>
                <TabsContent value="confirmed">
                  <OrderTable orderList={filterOrders(confirmedOrders)} />
                </TabsContent>
                <TabsContent value="packed">
                  <OrderTable orderList={filterOrders(packedOrders)} />
                </TabsContent>
                <TabsContent value="delivered">
                  <OrderTable orderList={filterOrders(deliveredOrders)} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
