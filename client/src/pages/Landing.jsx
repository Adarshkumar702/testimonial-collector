import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, Star, ShieldCheck, Code2, Layers, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          MERN Stack Testimonial Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Collect, Moderate & Embed Customer <span className="text-brand-600 underline decoration-brand-300">Social Proof</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Empower your business with branded collection Spaces, seamless customer submissions, an owner moderation dashboard, and responsive Wall of Love widgets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/signup">
            <Button size="lg" icon={ArrowRight}>
              Create Owner Account
            </Button>
          </Link>
          <Link to="/collect/acme-corp" target="_blank">
            <Button variant="outline" size="lg" icon={Layers}>
              Try Demo Submission Form
            </Button>
          </Link>
          <Link to="/wall/acme-corp" target="_blank">
            <Button variant="secondary" size="lg" icon={Heart}>
              View Live Wall of Love
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto text-left">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl w-fit">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Branded Collection Spaces</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create unique slugs, upload company logos, customize prompts and ask custom questions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Owner Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by rating or keyword search, approve, feature, like or archive incoming testimonials.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Embed & Wall of Love</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Responsive masonry layout and customizable iframe widgets (grid, carousel, badge).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
