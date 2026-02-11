import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Printer, ArrowLeft, CheckCircle, Clock, Package } from 'lucide-react';

export default function OrderSummary() {
  const { orderId } = useParams();
  const { user, isLoading } = useAuth();
  const { orders, products } = useData();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const order = orders.find(o => o.id === orderId);
  const product = order ? products.find(p => p.id === order.productId) : null;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomerHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="no-print">
        <CustomerHeader />
      </div>

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container max-w-2xl">
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 no-print"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>

          <div ref={printRef}>
            <Card className="shadow-elevated">
              <CardHeader className="text-center border-b">
                <div className="flex justify-center mb-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                    order.status === 'confirmed' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {order.status === 'confirmed' ? (
                      <CheckCircle className="h-8 w-8 text-success" />
                    ) : (
                      <Clock className="h-8 w-8 text-warning" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  {order.status === 'confirmed' ? 'Order Confirmed!' : 'Bulk Order Placed'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {order.status === 'confirmed'
                    ? 'Your order has been confirmed and will be delivered soon.'
                    : 'Your bulk order will be processed within 10-15 days.'}
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Order Details */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Order Details</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-mono">{order.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={order.status === 'confirmed' ? 'bg-success' : 'bg-warning'}>
                        {order.status === 'confirmed' ? 'Confirmed' : 'Bulk / Waiting'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Delivery</span>
                      <span>{order.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Product</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    {product && (
                      <img
                        src={product.image}
                        alt={order.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{order.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        ₹{order.pricePerUnit}/kg × {order.quantity} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Qty</p>
                      <p className="font-semibold">{order.quantity} kg</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Price Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Customer</h3>
                  <p className="text-sm">{order.customerName}</p>
                  {user.businessType && (
                    <p className="text-sm text-muted-foreground">{user.businessType}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Footer for Print */}
            <div className="hidden print:block mt-8 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-5 w-5" />
                <span className="font-semibold">Thanvi Trader</span>
              </div>
              <p>123 Trading Street, Market District, City 12345</p>
              <p>info@thanvitrader.com | +1 234 567 890</p>
              <p className="mt-4 text-xs">Thank you for your business!</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4 no-print">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button className="flex-1" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Summary
            </Button>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
