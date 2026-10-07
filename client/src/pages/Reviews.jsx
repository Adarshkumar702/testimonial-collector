import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testimonialService } from '../services/testimonialService';
import { spaceService } from '../services/spaceService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Rating } from '../components/ui/Rating';
import { Loader } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Star,
  Heart,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const spaceIdParam = searchParams.get('spaceId');

  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaceIdParam || '');
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, archived
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Load owner spaces
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await spaceService.getOwnerSpaces();
        setSpaces(res.data);
        if (res.data.length > 0 && !selectedSpaceId) {
          setSelectedSpaceId(res.data[0]._id);
        }
      } catch (e) {
        addToast('Failed to load spaces', 'error');
      }
    };
    fetchSpaces();
  }, []);

  // Update URL param when space changes
  useEffect(() => {
    if (selectedSpaceId) {
      setSearchParams({ spaceId: selectedSpaceId });
    }
  }, [selectedSpaceId, setSearchParams]);

  // Load testimonials
  const fetchTestimonials = useCallback(async () => {
    if (!selectedSpaceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await testimonialService.getSpaceTestimonials(selectedSpaceId, {
        status: activeTab,
        rating: ratingFilter,
        search,
        page,
        limit: 10
      });

      setTestimonials(res.data.testimonials);
      setPagination(res.data.pagination);
    } catch (err) {
      addToast('Failed to fetch testimonials', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedSpaceId, activeTab, ratingFilter, search, page, addToast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleAction = async (actionFn, successMsg) => {
    try {
      await actionFn();
      addToast(successMsg, 'success');
      fetchTestimonials();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const tabsConfig = [
    { id: 'all', label: 'All Reviews' },
    { id: 'pending', label: 'Pending Moderation' },
    { id: 'approved', label: 'Approved' },
    { id: 'archived', label: 'Archived' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Space Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Testimonial Moderation</h2>
          <p className="text-sm text-slate-500">Approve, feature, filter and manage customer reviews</p>
        </div>

        {spaces.length > 0 && (
          <div className="w-full md:w-72">
            <Select
              label="Select Space"
              value={selectedSpaceId}
              onChange={(e) => {
                setSelectedSpaceId(e.target.value);
                setPage(1);
              }}
              options={spaces.map((s) => ({ value: s._id, label: `${s.name} (/${s.slug})` }))}
            />
          </div>
        )}
      </div>

      {/* Tabs & Search Filter Bar */}
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-4">
          <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setPage(1); }} />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1">
              <Input
                placeholder="Search by customer name, email, role, or review text..."
                icon={Search}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
                options={[
                  { value: 'all', label: 'All Ratings' },
                  { value: '5', label: '5 Stars ⭐' },
                  { value: '4', label: '4 Stars ⭐' },
                  { value: '3', label: '3 Stars ⭐' },
                  { value: '2', label: '2 Stars ⭐' },
                  { value: '1', label: '1 Star ⭐' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      {loading ? (
        <Loader label="Filtering reviews..." />
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Testimonials Found"
          description="There are no reviews matching your current status, search keyword, or rating filters."
        />
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <Card key={t._id} className="border-slate-200 hover:border-slate-300 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Customer Details */}
                  <div className="flex items-start gap-4">
                    <Avatar src={t.avatarUrl} alt={t.customerName} size="lg" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{t.customerName}</h4>
                        {t.companyRole && (
                          <span className="text-xs text-slate-500 font-medium">({t.companyRole})</span>
                        )}
                        <Badge variant={t.status}>{t.status}</Badge>
                        {t.featured && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-amber-500" /> Featured
                          </span>
                        )}
                        {t.liked && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                            <Heart className="h-3 w-3 fill-rose-500" /> Liked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{t.customerEmail} • {new Date(t.createdAt).toLocaleDateString()}</p>
                      
                      {/* Rating */}
                      <div className="pt-1">
                        <Rating value={t.rating} readonly size="sm" showLabel />
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    {t.status !== 'approved' && (
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleAction(() => testimonialService.approve(t._id), 'Testimonial approved')}
                      >
                        Approve
                      </Button>
                    )}

                    {t.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={XCircle}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={() => handleAction(() => testimonialService.reject(t._id), 'Testimonial rejected')}
                      >
                        Reject
                      </Button>
                    )}

                    {t.status !== 'archived' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Archive}
                        onClick={() => handleAction(() => testimonialService.archive(t._id), 'Testimonial archived')}
                      >
                        Archive
                      </Button>
                    )}

                    <Button
                      variant={t.featured ? 'primary' : 'outline'}
                      size="sm"
                      icon={Star}
                      onClick={() => handleAction(() => testimonialService.toggleFeatured(t._id), 'Updated featured state')}
                    >
                      {t.featured ? 'Featured' : 'Feature'}
                    </Button>

                    <Button
                      variant={t.liked ? 'secondary' : 'outline'}
                      size="sm"
                      icon={Heart}
                      onClick={() => handleAction(() => testimonialService.toggleLiked(t._id), 'Updated liked state')}
                    >
                      {t.liked ? 'Liked' : 'Like'}
                    </Button>

                    <button
                      onClick={() => handleAction(() => testimonialService.delete(t._id), 'Testimonial deleted')}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-slate-800 text-sm leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-100">
                    "{t.reviewText}"
                  </p>
                </div>

                {/* Custom Answers if present */}
                {t.customAnswers && t.customAnswers.length > 0 && (
                  <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-brand-300 text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5 text-brand-600" /> Custom Questions Answers:
                    </span>
                    {t.customAnswers.map((ca, idx) => (
                      <p key={idx} className="text-slate-600">
                        <strong className="text-slate-800">{ca.question}:</strong> {ca.answer}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-slate-500">
                Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total items)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  icon={ChevronRight}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
