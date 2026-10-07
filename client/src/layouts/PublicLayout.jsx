import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Public Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
            <div className="p-1.5 bg-brand-600 text-white rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>SocialProof</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/collect/acme-corp" target="_blank" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" icon={ExternalLink}>
                Demo Collection Form
              </Button>
            </Link>
            <Link to="/wall/acme-corp" target="_blank" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" icon={Heart}>
                Demo Wall of Love
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span>Testimonial & Social Proof Collector Platform</span>
          </div>
          <p>© 2026 SocialProof. Built with MongoDB, Express, React & Node.js (MERN Stack).</p>
        </div>
      </footer>
    </div>
  );
};
