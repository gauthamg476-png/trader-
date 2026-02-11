import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Shield, Truck, Award } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container text-center text-primary-foreground z-10">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary animate-pulse-glow">
              <Package className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-secondary">BALAJI & CO</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in">
            Your trusted partner in premium quality pulses and lentils. 
            Connecting traders, retailers, and businesses across the nation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/login">
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
              <Link to="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/60"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <h2 className="text-3xl font-heading font-bold text-center mb-4 text-foreground">
            Why Choose BALAJI & CO?
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            We bring decades of experience in the commodities trading industry, 
            ensuring quality and reliability in every transaction.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Premium Quality</h3>
              <p className="text-muted-foreground">
                Sourced from the finest farms, our products meet the highest quality standards.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Trusted Trading</h3>
              <p className="text-muted-foreground">
                Secure transactions and transparent pricing for complete peace of mind.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Efficient logistics ensuring timely delivery across all regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="container text-center">
          <h2 className="text-3xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust BALAJI & CO for their commodity needs.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link to="/signup">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-8">
        <div className="container text-center">
          <p className="text-primary-foreground/70 text-sm">
            © 2024 BALAJI & CO. Demo Application - Data stored in browser localStorage
          </p>
          <p className="text-primary-foreground/50 text-xs mt-2">
            This system can be upgraded to a real backend and cloud database
          </p>
        </div>
      </footer>
    </div>
  );
}
