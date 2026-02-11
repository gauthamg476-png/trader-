import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Package, TrendingUp, Users, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { products } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user && !user.businessType && user.role === 'customer') {
      navigate('/customer-background');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      {/* Hero Section */}
      <section 
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 animate-fade-in">
            Welcome back, <span className="text-secondary">{user.username}</span>!
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mb-8 animate-fade-in">
            Explore our premium selection of quality pulses and lentils. 
            Place orders, track deliveries, and grow your business with BALAJI & CO.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 animate-fade-in">
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
            About BALAJI & CO
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BALAJI & CO is a leading commodities trading company specializing in premium quality 
                pulses and lentils. With decades of experience in the industry, we have built 
                strong relationships with farmers, suppliers, and businesses across the nation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to provide reliable, high-quality products at competitive prices, 
                ensuring our partners can grow their businesses with confidence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/10 border-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="bg-accent/10 border-accent/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Tons Delivered</div>
                </CardContent>
              </Card>
              <Card className="bg-success/10 border-success/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
            Our Business Model
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-card shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quality Sourcing</h3>
                <p className="text-sm text-muted-foreground">
                  Direct partnerships with verified farmers and suppliers
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Competitive Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent and fair market prices
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
                <p className="text-sm text-muted-foreground">
                  Expert team to assist with all your trading needs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Timely Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Efficient logistics and reliable shipping
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Our Products
            </h2>
            <Button asChild variant="outline">
              <Link to="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-elevated transition-shadow">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    ₹{product.price}/{product.unit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
