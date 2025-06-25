
import React from 'react';
import { Heart, Shield, Mail, Phone, MapPin, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-sidebar border-t border-border/50 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h3 className="text-xl font-bold gradient-text">VidSpace</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Die modernste Plattform für erwachsene Unterhaltung. Sicher, diskret und qualitativ hochwertig.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              {['Premium werden', 'Live Cams', 'Kategorien', 'Top Rated', 'Neueste Videos'].map((link) => (
                <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-2">
              {['Hilfe Center', 'Kontakt', 'Datenschutz', 'AGB', 'Impressum'].map((link) => (
                <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-500" />
              <span>SSL Verschlüsselt</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Erhalte Updates zu neuen Features und exklusiven Inhalten.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Deine E-Mail..." 
                className="bg-muted/50 border-border/50 focus:border-primary/50"
              />
              <Button className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all">
                Abonnieren
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Deutschland</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>support@vidspace.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>+49 (0) 123 456789</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© 2024 VidSpace. Gemacht mit</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>in Deutschland</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
