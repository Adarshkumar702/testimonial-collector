import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { spaceService } from '../services/spaceService';
import { Card, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Rating } from '../components/ui/Rating';
import { MasonryGrid } from '../components/ui/MasonryGrid';
import { Loader } from '../components/ui/Loader';
import { Sparkles, Heart, Star, Quote, ArrowRight } from 'lucide-react';

export const WallOfLove = () => {
  const { spaceSlug } = useParams();

  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const response = await spaceService.getPublicApprovedTestimonials(spaceSlug);
        setSpace(response.data.space);
        setTestimonials(response.data.testimonials);
      } catch (err) {
        setError(err.response?.data?.message || 'Wall of Love unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedTestimonials();
  }, [spaceSlug]);

  if (loading) return <Loader label="Loading Wall of Love..." />;

  if (error || !space) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Wall of Love Not Found</h2>
          <p className="text-sm text-slate-500">{error || 'This space has no active Wall of Love.'}</p>
          <Link to="/">
            <span className="text-sm font-semibold text-brand-600">Return to SocialProof Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-brand-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Branding */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-pink-400 text-xs font-semibold uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5 fill-pink-400" /> Wall of Love
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Loved by Companies & Creators Worldwide
          </h1>

          <p className="text-lg text-slate-400">
            See what real customers are saying about <strong>{space.name}</strong>.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Rating value={parseFloat(averageRating)} readonly size="lg" showLabel />
            <span className="text-slate-400 text-sm">({testimonials.length} approved reviews)</span>
          </div>

          <div className="pt-2">
            <Link
              to={`/collect/${space.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-500/20 text-sm"
            >
              <span>Submit Your Own Testimonial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Masonry Grid of Approved Testimonials */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800">
            <p className="text-base font-medium">No approved testimonials to display yet.</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to submit a review for {space.name}!</p>
          </div>
        ) : (
          <MasonryGrid columns={3}>
            {testimonials.map((t) => (
              <Card
                key={t._id}
                className="bg-slate-900/90 border-slate-800 text-slate-100 p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all rounded-2xl relative overflow-hidden"
              >
                {t.featured && (
                  <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 border-b border-l border-amber-500/30 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400" /> Featured
                  </div>
                )}

                <Quote className="h-8 w-8 text-slate-800 absolute top-4 left-4 -z-0 opacity-40" />

                <div className="relative z-10 space-y-3">
                  <Rating value={t.rating} readonly size="sm" />

                  <p className="text-slate-200 text-sm leading-relaxed font-normal">
                    "{t.reviewText}"
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                    <Avatar src={t.avatarUrl} alt={t.customerName} size="md" className="border-slate-700" />
                    <div>
                      <h4 className="font-bold text-white text-sm leading-snug">{t.customerName}</h4>
                      {t.companyRole && (
                        <p className="text-xs text-slate-400 leading-snug">{t.companyRole}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </MasonryGrid>
        )}
      </div>
    </div>
  );
};
