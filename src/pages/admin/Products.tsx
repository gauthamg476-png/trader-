import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Package, DollarSign, Boxes } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

export default function AdminProducts() {
  const { user, isLoading, isAdmin } = useAuth();
  const { products, updateProduct } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    const price = parseFloat(editPrice);
    const stock = parseInt(editStock);

    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price.',
        variant: 'destructive',
      });
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast({
        title: 'Invalid stock',
        description: 'Please enter a valid stock quantity.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('🔄 Saving product update:', { productId: selectedProduct.id, price, stock });
      
      await updateProduct(selectedProduct.id, { price, stock });
      
      toast({
        title: 'Product updated!',
        description: `${selectedProduct.name} price updated to ₹${price} and stock to ${stock} ${selectedProduct.unit}.`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: 'In Stock', color: 'bg-success' };
    if (stock > 0) return { label: 'Low Stock', color: 'bg-warning' };
    return { label: 'Out of Stock', color: 'bg-destructive' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Update product prices and stock levels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 aspect-square sm:aspect-auto bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-bold text-foreground">
                            ₹{product.price}/{product.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Boxes className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Stock</p>
                          <p className="font-bold text-foreground">
                            {product.stock} {product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Edit {selectedProduct?.name}
            </DialogTitle>
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
                  <p className="text-sm text-muted-foreground">
                    Product ID: {selectedProduct.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹ per {selectedProduct.unit})</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock ({selectedProduct.unit})</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
