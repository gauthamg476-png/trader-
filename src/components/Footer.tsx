import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground">
                <Package className="h-5 w-5 text-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">BALAJI & CO</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Premium quality pulses and lentils for wholesale and retail trading.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Toor Dal (Thuvaramparuppu)</li>
              <li>Moong Dal (Pachaipayaru)</li>
              <li>Chana Dal (Kadalaiparuppu)</li>
              <li>Urad Dal (Uluthamparuppu)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/home" className="hover:text-primary-foreground">About Us</Link></li>
              <li><Link to="/products" className="hover:text-primary-foreground">Our Products</Link></li>
              <li><Link to="/catering" className="hover:text-primary-foreground">Catering Services</Link></li>
              <li><Link to="/inquiries" className="hover:text-primary-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>123 Trading Street</li>
              <li>Market District, City 12345</li>
              <li>info@balajicotrader.com</li>
              <li>+1 234 567 890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2024 BALAJI & CO. All rights reserved.</p>
          <p className="mt-1 text-xs">
            Demo application - Data stored in browser localStorage
          </p>
        </div>
      </div>
    </footer>
  );
}
