import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ShoppingCart, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

export default function Products() {
  const { user, isLoading } = useAuth();
  const { products, createOrder } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity('');
    setContactPhone('');
    setDeliveryAddress('');
    setIsDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      toast({
        title: 'Invalid quantity',
        description: 'Please enter a valid quantity.',
        variant: 'destructive',
      });
      return;
    }

    if (!contactPhone || !deliveryAddress) {
      toast({
        title: 'Missing information',
        description: 'Please provide contact phone and delivery address.',
        variant: 'destructive',
      });
      return;
    }

    const qty = parseInt(quantity);
    
    try {
      const order = await createOrder({
        customerId: user.id,
        customerName: user.username,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: qty,
        pricePerUnit: selectedProduct.price,
        totalPrice: qty * selectedProduct.price,
        contactPhone,
        deliveryAddress,
      });

      setIsDialogOpen(false);
      
      toast({
        title: order.status === 'confirmed' ? 'Order Confirmed!' : 'Bulk Order Placed',
        description: order.status === 'confirmed' 
          ? 'Your order has been confirmed and will be delivered soon.'
          : 'Stock is limited. Your bulk order will be fulfilled within 10-15 days.',
      });

      navigate(`/order-summary/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: 'In Stock', variant: 'default' as const, color: 'bg-success' };
    if (stock > 0) return { label: 'Low Stock', variant: 'secondary' as const, color: 'bg-warning' };
    return { label: 'Out of Stock', variant: 'destructive' as const, color: 'bg-destructive' };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Our Products</h1>
            <p className="text-muted-foreground">
              Premium quality pulses and lentils available for wholesale and retail orders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-square md:aspect-auto bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                          <span className="text-muted-foreground">/{product.unit}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Package className="inline h-4 w-4 mr-1" />
                          {product.stock} {product.unit} available
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => handleOrderClick(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order - {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Enter the quantity you want to order
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold">{selectedProduct.name}</h4>
                  <p className="text-lg font-bold text-primary">
                    ₹{selectedProduct.price}/{selectedProduct.unit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available: {selectedProduct.stock} {selectedProduct.unit}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity ({selectedProduct.unit})</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Input
                  id="deliveryAddress"
                  type="text"
                  placeholder="Full delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>

              {quantity && parseInt(quantity) > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="font-bold text-lg">
                      ₹{(parseInt(quantity) * selectedProduct.price).toLocaleString()}
                    </span>
                  </div>

                  {parseInt(quantity) > selectedProduct.stock ? (
                    <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning">Bulk Order</p>
                        <p className="text-xs text-muted-foreground">
                          Requested quantity exceeds available stock. Order will be processed as 
                          bulk order with 10-15 days delivery.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-success/10 border border-success/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success">Instant Confirmation</p>
                        <p className="text-xs text-muted-foreground">
                          Stock available! Your order will be confirmed immediately.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={!quantity || parseInt(quantity) <= 0 || !contactPhone || !deliveryAddress}>
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
