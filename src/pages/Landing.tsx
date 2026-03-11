import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Shield, Truck, Award, Home, LogIn, UserPlus, Star, Quote } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import CountUp from '@/components/CountUp';
import toorDalImg from '@/assets/toor-dal.jpg';
import moongDalImg from '@/assets/moong-dal.jpg';
import chanaDalImg from '@/assets/chana-dal.jpg';
import uradDalImg from '@/assets/urad-dal.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Professional White Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-gray-900">BALAJI & CO</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link 
                to="/login" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 border-t border-gray-100 mt-4 pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors py-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors py-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

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

      {/* Our Products Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-center mb-4 text-foreground">
              Our Premium Products
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Discover our carefully selected range of premium quality pulses and lentils, 
              sourced directly from trusted farmers across India.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={toorDalImg}
                  alt="Toor Dal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">Toor Dal</h3>
                <p className="text-sm text-muted-foreground mb-2">Thuvaramparuppu</p>
                <p className="text-lg font-bold text-primary">₹120/kg</p>
              </div>
            </div>

            <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={moongDalImg}
                  alt="Moong Dal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">Moong Dal</h3>
                <p className="text-sm text-muted-foreground mb-2">Pachaipayaru</p>
                <p className="text-lg font-bold text-primary">₹135/kg</p>
              </div>
            </div>

            <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={chanaDalImg}
                  alt="Chana Dal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">Chana Dal</h3>
                <p className="text-sm text-muted-foreground mb-2">Kadalaiparuppu</p>
                <p className="text-lg font-bold text-primary">₹95/kg</p>
              </div>
            </div>

            <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={uradDalImg}
                  alt="Urad Dal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">Urad Dal</h3>
                <p className="text-sm text-muted-foreground mb-2">Uluthamparuppu</p>
                <p className="text-lg font-bold text-primary">₹145/kg</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signup">
                Sign Up to Purchase
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-background">
        <div className="container">
          {/* Attractive Stats Section with Radiant Design */}
          <div className="relative mb-16">
            {/* Radiant background with multiple gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-3xl transform -rotate-1 opacity-20 blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 rounded-3xl transform rotate-1 opacity-15 blur-lg"></div>
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="relative">
                    {/* Enhanced Radiant glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl transform rotate-3 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300"></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-blue-100 group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="text-5xl font-bold mb-2">
                        <CountUp 
                          to={5000} 
                          duration={2.5}
                          delay={0.2}
                          className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent"
                        />
                        <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">+</span>
                      </div>
                      <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Happy Customers</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="relative">
                    {/* Enhanced Radiant glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl transform -rotate-3 group-hover:-rotate-6 group-hover:scale-105 transition-all duration-300"></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-orange-100 group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="text-5xl font-bold mb-2">
                        <CountUp 
                          to={50} 
                          duration={2}
                          delay={0.4}
                          className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent"
                        />
                        <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">+</span>
                      </div>
                      <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Cities Served</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="relative">
                    {/* Enhanced Radiant glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl transform rotate-2 group-hover:rotate-4 group-hover:scale-105 transition-all duration-300"></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-green-100 group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="text-5xl font-bold mb-2">
                        <CountUp 
                          to={99.8} 
                          duration={3}
                          delay={0.6}
                          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
                        />
                        <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">%</span>
                      </div>
                      <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="relative">
                    {/* Enhanced Radiant glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl transform -rotate-2 group-hover:-rotate-4 group-hover:scale-105 transition-all duration-300"></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-purple-100 group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="text-5xl font-bold mb-2">
                        <CountUp 
                          to={25} 
                          duration={2.2}
                          delay={0.8}
                          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
                        />
                        <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">+</span>
                      </div>
                      <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced decorative elements with radiant glow */}
              <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-20 blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-orange-200 to-pink-300 rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">
              Testimonials
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                "BALAJI & CO has been our trusted partner for over 3 years. Their quality is unmatched and delivery is always on time. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">RS</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Rajesh Sharma</div>
                  <div className="text-sm text-muted-foreground">Wholesale Trader, Delhi</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                "Excellent service and premium quality pulses. The online platform makes ordering so convenient. Our customers love the products!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                  <span className="text-secondary font-semibold">PK</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Priya Kumari</div>
                  <div className="text-sm text-muted-foreground">Retail Store Owner, Mumbai</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                "Professional team, competitive prices, and consistent quality. BALAJI & CO has helped grow our business significantly."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                  <span className="text-accent font-semibold">AV</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Amit Verma</div>
                  <div className="text-sm text-muted-foreground">Restaurant Chain, Bangalore</div>
                </div>
              </div>
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

