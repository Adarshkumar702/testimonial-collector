import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { spaceService } from '../services/spaceService';
import { Rating } from '../components/ui/Rating';
import { Avatar } from '../components/ui/Avatar';
import { Carousel } from '../components/ui/Carousel';
import { Loader } from '../components/ui/Loader';
import { Star, Sparkles, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

export const EmbedPage = () => {
  const { spaceSlug } = useParams();
  const [searchParams] = useSearchParams();

  const theme = searchParams.get('theme') || 'light';
  const layout = searchParams.get('layout') || 'grid';

  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const response = await spaceService.getPublicApprovedTestimonials(spaceSlug);
        setSpace(response.data.space);
        setTestimonials(response.data.testimonials);
      } catch (err) {
        console.error('Failed to load embed testimonials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, [spaceSlug]);

  if (loading) return <Loader label="Loading widget..." />;

  const isDark = theme === 'dark';

  const cardBgClass = isDark
    ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  if (layout === 'badge') {
    const avg = testimonials.length > 0
      ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
      : '5.0';

    return (
      <div className={cn('p-4 rounded-2xl border flex items-center justify-between gap-4 font-sans select-none', cardBgClass)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-600 text-white rounded-xl shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-base">
              <span>{avg}</span>
              <Rating value={parseFloat(avg)} readonly size="sm" />
            </div>
            <p className={cn('text-xs font-medium', textMutedClass)}>
              Based on {testimonials.length} verified reviews for <strong>{space?.name || 'Us'}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderCard = (t) => (
    <div key={t._id} className={cn('p-5 rounded-xl border space-y-3 font-sans transition-shadow', cardBgClass)}>
      <Rating value={t.rating} readonly size="sm" />
      <p className="text-sm leading-relaxed font-normal">"{t.reviewText}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100/10">
        <Avatar src={t.avatarUrl} alt={t.customerName} size="md" />
        <div>
          <h4 className="font-bold text-sm leading-tight">{t.customerName}</h4>
          {t.companyRole && <p className={cn('text-xs', textMutedClass)}>{t.companyRole}</p>}
        </div>
      </div>
    </div>
  );

  if (layout === 'carousel') {
    return (
      <div className={cn('p-4 font-sans', isDark ? 'bg-slate-950 text-white' : 'bg-transparent')}>
        <Carousel items={testimonials} renderItem={renderCard} theme={theme} />
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className={cn('p-4 font-sans min-h-screen', isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => renderCard(t))}
      </div>
    </div>
  );
};
