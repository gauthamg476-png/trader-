import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createRazorpayOrder, 
  initializeRazorpayPayment, 
  verifyRazorpayPayment,
  formatPaymentMethod 
} from '@/lib/razorpayService';

export default function Payment() {
  const { orderId } = useParams();
  const { user, isLoading } = useAuth();
  const { orders, products } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const order = orders.find(o => o.id === orderId);
  const product = order ? products.find(p => p.id === order.productId) : null;

  if (!order || !order.paymentInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomerHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePayment = async () => {
    if (!order.paymentInfo) return;

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const { razorpayOrderId } = await createRazorpayOrder({
        amount: order.paymentInfo.advanceAmount,
        orderId: order.id,
        customerName: order.customerName,
      });

      // Initialize Razorpay payment
      const paymentResponse = await initializeRazorpayPayment({
        amount: order.paymentInfo.advanceAmount * 100, // Convert to paise
        currency: 'INR',
        orderId: razorpayOrderId,
        customerName: order.customerName,
        customerPhone: order.contactPhone,
        description: order.paymentInfo.method === 'cash_on_delivery' 
          ? `Advance payment for ${order.productName}` 
          : `Full payment for ${order.productName}`,
      });

      // Verify payment
      const isVerified = await verifyRazorpayPayment(paymentResponse);

      if (isVerified) {
        toast({
          title: 'Payment Successful!',
          description: order.paymentInfo.method === 'cash_on_delivery'
            ? 'Advance payment completed. Pay remaining amount on delivery.'
            : 'Payment completed successfully.',
        });

        // Navigate to order summary
        navigate(`/order-summary/${order.id}`);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Payment could not be processed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentInfo = order.paymentInfo;

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>

          <Card className="shadow-elevated">
            <CardHeader className="text-center border-b">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {paymentInfo.method === 'razorpay' ? (
                    <CreditCard className="h-8 w-8 text-primary" />
                  ) : (
                    <Banknote className="h-8 w-8 text-secondary" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl">Complete Payment</CardTitle>
              <p className="text-muted-foreground">
                {paymentInfo.method === 'cash_on_delivery'
                  ? 'Pay 10% advance to confirm your order'
                  : 'Complete your payment to confirm the order'}
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Order Details */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Order Details</h3>
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
                    <Badge variant="outline" className="mt-1">
                      Order ID: {order.id}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Breakdown */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Payment Details</h3>
                <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Order Amount:</span>
                    <span className="font-medium">₹{order.totalPrice.toLocaleString()}</span>
                  </div>

                  {paymentInfo.method === 'cash_on_delivery' ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Advance Payment (10%):</span>
                        <span className="font-bold text-primary">₹{paymentInfo.advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cash on Delivery:</span>
                        <span className="font-medium">₹{paymentInfo.remainingAmount.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Pay ₹{paymentInfo.advanceAmount.toLocaleString()} now to confirm your order. 
                          Remaining ₹{paymentInfo.remainingAmount.toLocaleString()} will be collected on delivery.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount to Pay:</span>
                        <span className="font-bold text-lg text-primary">₹{paymentInfo.advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Complete payment for your order via secure Razorpay gateway.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Payment Method: {formatPaymentMethod(paymentInfo.method)}</p>
                  <p className="text-sm text-muted-foreground">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{paymentInfo.advanceAmount.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By proceeding, you agree to our terms and conditions. 
                Your payment is secured by Razorpay.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}