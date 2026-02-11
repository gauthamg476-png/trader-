import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package, Building2, TrendingUp, Store, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const businessTypes: { value: BusinessType; label: string; icon: React.ElementType; description: string }[] = [
  { 
    value: 'Individual Consumer', 
    label: 'Individual Consumer', 
    icon: Users,
    description: 'I buy for personal or household use'
  },
  { 
    value: 'Business Owner', 
    label: 'Business Owner', 
    icon: Building2,
    description: 'I own or manage a business that uses commodities'
  },
  { 
    value: 'Trader', 
    label: 'Trader', 
    icon: TrendingUp,
    description: 'I buy and sell commodities for profit'
  },
  { 
    value: 'Retailer', 
    label: 'Retailer', 
    icon: Store,
    description: 'I sell products directly to consumers'
  },
  { 
    value: 'Broker / Agent', 
    label: 'Broker / Agent', 
    icon: Package,
    description: 'I facilitate trades between buyers and sellers'
  },
];

export default function CustomerBackground() {
  const [selectedType, setSelectedType] = useState<BusinessType | ''>('');
  const { updateBusinessType, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if no user or if already has business type
  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.businessType) {
    navigate('/home');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast({
        title: 'Please select your business type',
        variant: 'destructive',
      });
      return;
    }

    updateBusinessType(selectedType);
    toast({
      title: 'Profile completed!',
      description: 'Welcome to BALAJI & CO.',
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg">
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-heading">Tell Us About Yourself</CardTitle>
            <CardDescription>
              Help us personalize your experience by selecting your business type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as BusinessType)}
                className="space-y-3"
              >
                {businessTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Label
                      key={type.value}
                      htmlFor={type.value}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium text-foreground">{type.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>

              <Button type="submit" className="w-full" size="lg">
                Continue to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
