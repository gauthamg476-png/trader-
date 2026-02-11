import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Package, Calendar, TrendingUp, Clock, CheckCircle, Truck, ChefHat, Users, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyOrders() {
  const { user } = useAuth();
  const { orders, cateringOrders, products, cancelOrder, cancelCateringOrder } = useData();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedOrderType, setSelectedOrderType] = useState<'regular' | 'catering'>('regular');
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter orders for current customer
  const myOrders = orders.filter(order => order.customerId === user?.id);
  const myCateringOrders = cateringOrders.filter(order => order.customerId === user?.id);

  // Combine and sort all orders by date (newest first)
  const allOrders = [
    ...myOrders.map(order => ({ ...order, type: 'regular' as const })),
    ...myCateringOrders.map(order => ({ ...order, type: 'catering' as const }))
  ].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Check if order can be cancelled (within 5 minutes and not cancelled)
  const canCancelOrder = (createdAt: string, cancelledAt?: string) => {
    if (cancelledAt) return false;
    const orderTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - orderTime) < fiveMinutes;
  };

  const handleCancelClick = (orderId: string, type: 'regular' | 'catering') => {
    setSelectedOrderId(orderId);
    setSelectedOrderType(type);
    setCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation.',
        variant: 'destructive',
      });
      return;
    }

    setIsCancelling(true);
    try {
      if (selectedOrderType === 'regular') {
        await cancelOrder(selectedOrderId, cancellationReason);
      } else {
        await cancelCateringOrder(selectedOrderId, cancellationReason);
      }

      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully. Stock has been restored.',
      });

      setCancelDialogOpen(false);
      setCancellationReason('');
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'packed':
        return 'bg-blue-500';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'packed':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-preparation':
        return <ChefHat className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductImage = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.image;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <CustomerHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold">My Orders</h1>
                <p className="text-muted-foreground">View and track all your orders</p>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{allOrders.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Regular Orders</p>
                    <p className="text-2xl font-bold">{myOrders.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Catering Orders</p>
                    <p className="text-2xl font-bold">{myCateringOrders.length}</p>
                  </div>
                  <ChefHat className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                      ₹{(
                        myOrders.reduce((sum, order) => sum + order.totalPrice, 0) +
                        myCateringOrders.reduce((sum, order) => sum + order.totalPrice, 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          {allOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => {
                // Check if it's a catering order
                const isCatering = order.type === 'catering';
                
                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {/* Order Type Icon */}
                          <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${
                            isCatering ? 'bg-secondary' : 'bg-primary'
                          }`}>
                            {isCatering ? (
                              <ChefHat className="h-8 w-8 text-secondary-foreground" />
                            ) : (
                              <Package className="h-8 w-8 text-primary-foreground" />
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-xl">
                                {isCatering ? (order as any).eventName : (order as any).productName}
                              </CardTitle>
                              {isCatering && (
                                <Badge variant="outline" className="bg-secondary/10">
                                  Catering
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {isCatering 
                                ? `Event: ${formatDate((order as any).eventDate)}`
                                : `Ordered: ${formatDate(order.createdAt)}`
                              }
                            </CardDescription>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge className={`${order.cancelledAt ? 'bg-red-500' : getStatusColor(order.status)} text-white flex items-center gap-1`}>
                          {order.cancelledAt ? <XCircle className="h-4 w-4" /> : getStatusIcon(order.status)}
                          {order.cancelledAt ? 'CANCELLED' : order.status.toUpperCase().replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {isCatering ? (
                        // Catering Order Details
                        <>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Order ID */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                              <p className="font-mono text-sm font-semibold">{order.id}</p>
                            </div>

                            {/* Guest Count */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Guest Count</p>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold">{(order as any).guestCount} guests</p>
                              </div>
                            </div>

                            {/* Total Price */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                              <p className="font-semibold text-lg text-primary">
                                ₹{order.totalPrice.toLocaleString()}
                              </p>
                            </div>

                            {/* Event Date */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                              <p className="font-semibold">
                                {new Date((order as any).eventDate).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Products Ordered */}
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-semibold mb-2">Products Ordered:</p>
                            <div className="space-y-1">
                              {(order as any).items.map((item: any, idx: number) => (
                                <div key={idx} className="text-sm flex justify-between">
                                  <span className="text-muted-foreground">
                                    {item.productName} × {item.quantity} kg
                                  </span>
                                  <span className="font-semibold">
                                    ₹{(item.quantity * item.pricePerUnit).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Contact:</span>
                                <span className="ml-2 font-semibold">{(order as any).contactPhone}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Delivery Address:</span>
                                <span className="ml-2 font-semibold">{(order as any).deliveryAddress}</span>
                              </div>
                            </div>
                          </div>

                          {/* Cancel Button for Catering - Show only if within 5 minutes and not cancelled */}
                          {canCancelOrder(order.createdAt, order.cancelledAt) && (
                            <div className="mt-4 pt-4 border-t">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelClick(order.id, order.type)}
                                className="w-full sm:w-auto"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order (within 5 min)
                              </Button>
                            </div>
                          )}

                          {/* Show if catering order cancelled */}
                          {order.cancelledAt ? (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                                Order Cancelled
                              </p>
                              <p className="text-xs text-red-700 dark:text-red-300">
                                Cancelled on: {new Date(order.cancelledAt).toLocaleString()}
                              </p>
                              {order.cancellationReason && (
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                  Reason: {order.cancellationReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              {/* Status Messages for Catering - Only show if not cancelled */}
                              {order.status === 'pending' && (
                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                                      Awaiting Admin Approval
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                      Your catering order is pending review. Admin will confirm based on availability and event date. 
                                      Catering orders require 10-15 days advance notice.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {order.status === 'confirmed' && (
                                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg flex items-start gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                      Order Confirmed
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                      Your catering order has been confirmed! We're preparing for your event on {
                                        new Date((order as any).eventDate).toLocaleDateString('en-IN', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })
                                      }.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {order.status === 'in-preparation' && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-start gap-2">
                                  <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                      In Preparation
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                      We're preparing your catering order. Everything will be ready for your event!
                                    </p>
                                  </div>
                                </div>
                              )}

                              {order.status === 'ready' && (
                                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-start gap-2">
                                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                                      Ready for Delivery
                                    </p>
                                    <p className="text-xs text-purple-700 dark:text-purple-300">
                                      Your catering order is ready and will be delivered on the event date.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {order.status === 'delivered' && (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg flex items-start gap-2">
                                  <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      Delivered
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                      Your catering order has been delivered. Thank you for choosing BALAJI & CO!
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        // Regular Order Details
                        <>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Order ID */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                              <p className="font-mono text-sm font-semibold">{order.id}</p>
                            </div>

                            {/* Quantity */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                              <p className="font-semibold">{(order as any).quantity} kg</p>
                            </div>

                            {/* Price */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                              <p className="font-semibold text-lg text-primary">
                                ₹{order.totalPrice.toLocaleString()}
                              </p>
                            </div>

                            {/* Estimated Delivery */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                              <p className="font-semibold">
                                {(order as any).estimatedDelivery 
                                  ? new Date((order as any).estimatedDelivery).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : 'TBD'}
                              </p>
                            </div>
                          </div>

                          {/* Product Image */}
                          {getProductImage((order as any).productId) && (
                            <div className="mt-4 pt-4 border-t">
                              <img
                                src={getProductImage((order as any).productId)}
                                alt={(order as any).productName}
                                className="w-32 h-32 rounded-lg object-cover"
                              />
                            </div>
                          )}

                          {/* Order Details */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price per unit:</span>
                                <span className="ml-2 font-semibold">₹{(order as any).pricePerUnit}/kg</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Order Type:</span>
                                <span className="ml-2 font-semibold capitalize">
                                  {order.status === 'confirmed' ? 'In-Stock Order' : 'Bulk Order'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Cancel Button - Show only if within 5 minutes and not cancelled */}
                          {canCancelOrder(order.createdAt, order.cancelledAt) && (
                            <div className="mt-4 pt-4 border-t">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelClick(order.id, order.type)}
                                className="w-full sm:w-auto"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order (within 5 min)
                              </Button>
                            </div>
                          )}

                          {/* Show if cancelled */}
                          {order.cancelledAt ? (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                                Order Cancelled
                              </p>
                              <p className="text-xs text-red-700 dark:text-red-300">
                                Cancelled on: {new Date(order.cancelledAt).toLocaleString()}
                              </p>
                              {order.cancellationReason && (
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                  Reason: {order.cancellationReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              {/* Status Messages for Regular Orders - Only show if not cancelled */}
                              {order.status === 'pending' && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                                  Order Pending
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                  Your order is being processed. We'll confirm it shortly.
                                </p>
                              </div>
                            </div>
                          )}

                          {order.status === 'confirmed' && (
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                  Order Confirmed
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                  Your order is confirmed and will be delivered by {(order as any).estimatedDelivery}
                                </p>
                              </div>
                            </div>
                          )}

                          {order.status === 'packed' && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-start gap-2">
                              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                  Order Packed
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  Your order has been packed and is ready for delivery by {(order as any).estimatedDelivery}
                                </p>
                              </div>
                            </div>
                          )}

                          {order.status === 'delivered' && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg flex items-start gap-2">
                              <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  Order Delivered
                                </p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                  Your order has been delivered. Thank you for choosing BALAJI & CO!
                                </p>
                              </div>
                            </div>
                          )}
                            </>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this order. The stock will be restored.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Cancellation Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you want to cancel this order..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancellationReason('');
              }}
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling || !cancellationReason.trim()}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
