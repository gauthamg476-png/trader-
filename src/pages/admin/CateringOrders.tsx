import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChefHat, Calendar, Users, Phone, MapPin, Package, Search, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function CateringOrders() {
  const { cateringOrders, updateCateringOrderStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Sort by date (newest first)
  const sortedOrders = [...cateringOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Search filter function
  const filterOrders = (orderList: typeof cateringOrders) => {
    if (!searchQuery.trim()) return orderList;
    
    const query = searchQuery.toLowerCase();
    return orderList.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.eventName.toLowerCase().includes(query) ||
      (order.contactPhone && order.contactPhone.toLowerCase().includes(query))
    );
  };

  const filteredOrders = filterOrders(sortedOrders);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateCateringOrderStatus(orderId, newStatus);
    toast.success('Order status updated successfully!');
  };

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredOrders.map(order => {
      const productsDetail = order.items.map(item => 
        `${item.productName} (${item.quantity}kg @ ₹${item.pricePerUnit}/kg)`
      ).join('; ');

      return {
        'Order ID': order.id,
        'Customer Name': order.customerName,
        'Contact Phone': order.contactPhone,
        'Delivery Address': order.deliveryAddress,
        'Event Name': order.eventName,
        'Event Date': new Date(order.eventDate).toLocaleDateString('en-IN'),
        'Guest Count': order.guestCount,
        'Products': productsDetail,
        'Total Price': order.totalPrice,
        'Status': order.status.toUpperCase(),
        'Order Deadline': new Date(order.orderDeadline).toLocaleDateString('en-IN'),
        'Order Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
        'Special Requests': order.specialRequests || 'None'
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Order ID
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Contact Phone
      { wch: 30 }, // Delivery Address
      { wch: 25 }, // Event Name
      { wch: 15 }, // Event Date
      { wch: 12 }, // Guest Count
      { wch: 50 }, // Products
      { wch: 12 }, // Total Price
      { wch: 15 }, // Status
      { wch: 15 }, // Order Deadline
      { wch: 15 }, // Order Date
      { wch: 30 }  // Special Requests
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Catering Orders');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const filename = `BalajiCo_Trader_Catering_Orders_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    toast.success(`Exported ${filteredOrders.length} catering orders to ${filename}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'in-preparation':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <ChefHat className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold">Catering Orders</h1>
              <p className="text-muted-foreground">Manage pre-orders for events and catering</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catering orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{cateringOrders.length}</p>
                </div>
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {cateringOrders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <Badge className="bg-yellow-500">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">
                    {cateringOrders.filter(o => o.status === 'confirmed').length}
                  </p>
                </div>
                <Badge className="bg-green-500">Confirmed</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{cateringOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Catering Orders Yet</h3>
              <p className="text-muted-foreground">
                Catering orders will appear here when customers place pre-orders for events.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1 flex items-center gap-2">
                        <ChefHat className="h-5 w-5" />
                        {order.eventName}
                      </CardTitle>
                      <CardDescription>
                        Order ID: {order.id}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Customer & Event Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {order.customerName}</p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {order.contactPhone}
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="flex-1">{order.deliveryAddress}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Event Details</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Event Date: {formatDate(order.eventDate)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Guest Count: {order.guestCount}
                        </p>
                        <p className="text-muted-foreground">
                          Order Deadline: {formatDate(order.orderDeadline)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Ordered: {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products Ordered */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Products Ordered</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.pricePerUnit}/kg × {item.quantity} kg
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₹{(item.pricePerUnit * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="font-semibold text-lg">Total Amount:</span>
                      <span className="font-bold text-2xl text-primary">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {order.specialRequests && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="font-semibold text-sm mb-1">Special Requests:</p>
                      <p className="text-sm">{order.specialRequests}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-semibold">Update Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in-preparation">In Preparation</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${order.contactPhone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Customer
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
