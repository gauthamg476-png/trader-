import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminAnalytics() {
  const { user, isLoading, isAdmin } = useAuth();
  const { orders, products } = useData();
  const navigate = useNavigate();
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  // Fetch price history from database
  useEffect(() => {
    const fetchPriceHistory = async () => {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .order('changed_at', { ascending: true });

      if (!error && data) {
        setPriceHistory(data);
      }
    };

    fetchPriceHistory();
  }, []);

  // Process real order data for analytics - Group by WEEK for last 90 days
  const ordersByDate = useMemo(() => {
    const grouped: Record<string, { quantity: number; revenue: number; count: number }> = {};
    
    // Filter orders from last 90 days
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= ninetyDaysAgo) {
        // Simple date grouping - group by date
        const dateKey = orderDate.toISOString().split('T')[0];
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = { quantity: 0, revenue: 0, count: 0 };
        }
        grouped[dateKey].quantity += order.quantity;
        grouped[dateKey].revenue += order.totalPrice;
        grouped[dateKey].count += 1;
      }
    });

    // Convert to array and sort
    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dateKey, data]) => ({
        date: new Date(dateKey).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        fullDate: dateKey,
        quantity: data.quantity,
        revenue: Math.round(data.revenue),
        orders: data.count,
      }));
  }, [orders]);

  // Sales data for each dal product separately - Daily for 90 days
  const productSalesOverTime = useMemo(() => {
    const productData: Record<string, Record<string, number>> = {};
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    // Initialize for each product
    products.forEach(product => {
      productData[product.id] = {};
    });

    // Group orders by product and date
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= ninetyDaysAgo) {
        const dateKey = orderDate.toISOString().split('T')[0];
        
        if (productData[order.productId]) {
          productData[order.productId][dateKey] = 
            (productData[order.productId][dateKey] || 0) + order.quantity;
        }
      }
    });

    // Convert to chart format for each product
    const result: Record<string, any[]> = {};
    
    products.forEach(product => {
      const dates = Object.keys(productData[product.id]).sort();
      result[product.id] = dates.map(dateKey => ({
        date: new Date(dateKey).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        quantity: productData[product.id][dateKey],
      }));
    });

    return result;
  }, [orders, products]);

  // Revenue by product
  const revenueByProduct = useMemo(() => {
    const grouped: Record<string, { quantity: number; revenue: number; orders: number }> = {};
    
    orders.forEach((order) => {
      if (!grouped[order.productName]) {
        grouped[order.productName] = { quantity: 0, revenue: 0, orders: 0 };
      }
      grouped[order.productName].quantity += order.quantity;
      grouped[order.productName].revenue += order.totalPrice;
      grouped[order.productName].orders += 1;
    });

    return Object.entries(grouped).map(([name, data]) => ({
      name: name.split(' ')[0], // Short name (e.g., "Toor")
      fullName: name,
      quantity: data.quantity,
      revenue: Math.round(data.revenue),
      orders: data.orders,
    }));
  }, [orders]);

  // Calculate totals from real orders
  const totalQuantitySold = orders.reduce((sum, o) => sum + o.quantity, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Sales performance and trends over time
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuantitySold} kg</p>
                  <p className="text-xs text-muted-foreground">Total Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{Math.round(totalRevenue).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{Math.round(avgOrderValue)}</p>
                  <p className="text-xs text-muted-foreground">Avg Order Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Orders Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time (Last 90 Days)</CardTitle>
              <CardDescription>Daily order trends - compare recent performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ordersByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time (Last 90 Days)</CardTitle>
              <CardDescription>Daily revenue trends - track recent growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--secondary))"
                      radius={[4, 4, 0, 0]}
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
            <CardDescription>Comparison of quantity sold and revenue per product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {revenueByProduct.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByProduct}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Quantity (kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Revenue (₹)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'Revenue') return [`₹${value.toLocaleString()}`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="quantity"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      name="Quantity (kg)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="hsl(var(--secondary))"
                      radius={[4, 4, 0, 0]}
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No product sales data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price Variation Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Price Variation Over Time (Last 90 Days)</CardTitle>
            <CardDescription>Track how product prices have changed in the last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {priceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={priceHistory
                      .filter(ph => {
                        const date = new Date(ph.changed_at);
                        const ninetyDaysAgo = new Date();
                        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                        return date >= ninetyDaysAgo;
                      })
                      .map(ph => {
                        const product = products.find(p => p.id === ph.product_id);
                        return {
                          date: new Date(ph.changed_at).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            year: 'numeric' 
                          }),
                          fullDate: ph.changed_at,
                          price: parseFloat(ph.price),
                          product: product?.name.split(' ')[0] || 'Unknown',
                          fullProduct: product?.name || 'Unknown Product',
                        };
                      })
                      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Price (₹/kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `₹${value}/kg`,
                        props.payload.fullProduct
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    {products.map((product, index) => {
                      const colors = [
                        'hsl(var(--primary))',
                        'hsl(var(--secondary))',
                        'hsl(var(--accent))',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                      ];
                      return (
                        <Line
                          key={product.id}
                          type="monotone"
                          dataKey={(entry: any) => 
                            entry.product === product.name.split(' ')[0] ? entry.price : null
                          }
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[index % colors.length], r: 4 }}
                          name={product.name.split(' ')[0]}
                          connectNulls
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <p className="mb-2">No price history data available</p>
                  <p className="text-sm">Price changes will be tracked automatically when you update product prices</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Individual Product Sales Over Time */}
        <div>
          <h2 className="text-xl font-heading font-bold mb-4">Sales Trends by Product</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => {
              const productData = productSalesOverTime[product.id] || [];
              const productOrders = orders.filter(o => o.productId === product.id);
              const productRevenue = productOrders.reduce((sum, o) => sum + o.totalPrice, 0);
              const productQuantity = productOrders.reduce((sum, o) => sum + o.quantity, 0);

              return (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      {productOrders.length} orders • {productQuantity} kg sold • ₹{Math.round(productRevenue).toLocaleString()} revenue (Last 90 days)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      {productData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={productData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 11 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis 
                              tick={{ fontSize: 11 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                              }}
                              formatter={(value: number) => [`${value} kg`, 'Quantity']}
                            />
                            <Line
                              type="monotone"
                              dataKey="quantity"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                              name="Quantity (kg)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          No sales data for this product in last 90 days
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info Notice */}
        {orders.length === 0 && (
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                📊 Analytics shows last 90 days of data. Charts will display trends as you accumulate more orders.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
