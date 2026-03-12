import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, ChefHat, Plus, Minus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CateringItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

export default function Catering() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, createCateringOrder } = useData();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedItems, setSelectedItems] = useState<CateringItem[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Calculate minimum order date (10 days from now)
  const minOrderDate = new Date();
  minOrderDate.setDate(minOrderDate.getDate() + 10);
  const minDateString = minOrderDate.toISOString().split('T')[0];

  const addItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = selectedItems.find(item => item.productId === productId);
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(items => [
        ...items,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          pricePerUnit: product.price,
        }
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedItems(items => items.filter(item => item.productId !== productId));
      setInputValues(prev => ({ ...prev, [productId]: '' }));
    } else {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setInputValues(prev => ({ ...prev, [productId]: newQuantity.toString() }));
    }
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName || !eventDate || !guestCount || !contactPhone || !deliveryAddress || selectedItems.length === 0) {
      toast.error('Please fill in all required fields and select at least one item');
      return;
    }

    // Check if event date is at least 10 days away
    const eventDateTime = new Date(eventDate);
    const minDateTime = new Date();
    minDateTime.setDate(minDateTime.getDate() + 10);
    
    if (eventDateTime < minDateTime) {
      toast.error('Event date must be at least 10 days from today for catering orders');
      return;
    }

    // Create catering order
    const cateringOrder = createCateringOrder({
      customerId: user?.id || 'guest',
      customerName: user?.username || 'Guest',
      eventName,
      eventDate,
      guestCount: parseInt(guestCount),
      items: selectedItems,
      totalPrice,
      status: 'pending',
      specialRequests,
      contactPhone,
      deliveryAddress,
      orderDeadline: new Date(eventDateTime.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    toast.success('Catering order submitted successfully! We will contact you within 24 hours to confirm details.');
    
    // Reset form
    setEventName('');
    setEventDate('');
    setGuestCount('');
    setContactPhone('');
    setDeliveryAddress('');
    setSpecialRequests('');
    setSelectedItems([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <ChefHat className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">Catering Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pre-order premium quality dals for your events, weddings, and large gatherings. 
            All catering orders require 10-15 days advance notice for preparation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
              <CardDescription>
                Please provide your event information and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Wedding, Corporate Event, etc."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="eventDate">Event Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={minDateString}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 10 days advance notice required
                  </p>
                </div>

                <div>
                  <Label htmlFor="guestCount">Expected Guest Count *</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="Number of guests"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Full delivery address including city and postal code"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special dietary requirements, packaging preferences, etc."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={selectedItems.length === 0}>
                  Submit Catering Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Products
                </CardTitle>
                <CardDescription>
                  Choose the dal products for your catering order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.map((product) => {
                    const selectedItem = selectedItems.find(item => item.productId === product.id);
                    return (
                      <div key={product.id} className="p-3 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">₹{product.price}/{product.unit}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Enter quantity"
                            value={inputValues[product.id] || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              console.log('Input change:', product.id, value); // Debug log
                              
                              // Update input value immediately for responsive typing
                              setInputValues(prev => ({ ...prev, [product.id]: value }));
                              
                              if (value === '') {
                                // Don't update selectedItems yet, wait for blur or valid number
                                return;
                              }
                              
                              const qty = parseInt(value);
                              if (!isNaN(qty) && qty >= 0) {
                                // Update selectedItems with valid number
                                if (qty === 0) {
                                  setSelectedItems(items => items.filter(item => item.productId !== product.id));
                                } else {
                                  const existingItem = selectedItems.find(item => item.productId === product.id);
                                  if (existingItem) {
                                    setSelectedItems(items =>
                                      items.map(item =>
                                        item.productId === product.id
                                          ? { ...item, quantity: qty }
                                          : item
                                      )
                                    );
                                  } else {
                                    const productData = products.find(p => p.id === product.id);
                                    if (productData) {
                                      setSelectedItems(items => [
                                        ...items,
                                        {
                                          productId: product.id,
                                          productName: productData.name,
                                          quantity: qty,
                                          pricePerUnit: productData.price,
                                        }
                                      ]);
                                    }
                                  }
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                // Clear the item if field is empty on blur
                                setSelectedItems(items => items.filter(item => item.productId !== product.id));
                                setInputValues(prev => ({ ...prev, [product.id]: '' }));
                              }
                            }}
                            min="0"
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => {
                                const currentQty = selectedItem?.quantity || 0;
                                const newQty = Math.max(0, currentQty - 1);
                                updateQuantity(product.id, newQty);
                              }}
                              variant="outline"
                              size="sm"
                              disabled={!selectedItem || selectedItem.quantity <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                const currentQty = selectedItem?.quantity || 0;
                                const newQty = currentQty + 1;
                                updateQuantity(product.id, newQty);
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.pricePerUnit} × {item.quantity} = ₹{item.pricePerUnit * item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            variant="outline"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Advance Notice</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All catering orders require 10-15 days advance notice to ensure quality preparation and availability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-8 w-8 text-secondary" />
                <h3 className="font-semibold">Bulk Quantities</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Perfect for weddings, corporate events, and large gatherings. Competitive pricing for bulk orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="h-8 w-8 text-accent" />
                <h3 className="font-semibold">Quality Assured</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium quality dals sourced from trusted suppliers, perfect for your special occasions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}