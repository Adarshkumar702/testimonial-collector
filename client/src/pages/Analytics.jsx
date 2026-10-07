import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { spaceService } from '../services/spaceService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Loader } from '../components/ui/Loader';
import { Star, BarChart3, CheckCircle2, MessageSquare, Heart, Sparkles } from 'lucide-react';

export const Analytics = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await spaceService.getOwnerSpaces();
        setSpaces(res.data);
        if (res.data.length > 0) {
          setSelectedSpaceId(res.data[0]._id);
        }
      } catch (e) {
        console.error('Failed to load spaces for analytics', e);
      }
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    if (!selectedSpaceId) {
      setLoading(false);
      return;
    }
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getSpaceAnalytics(selectedSpaceId);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load space analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedSpaceId]);

  if (loading && !analytics) return <Loader label="Computing rating analytics..." />;

  const total = analytics?.metrics?.totalReviews || 0;
  const ratingDist = analytics?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const statusDist = analytics?.statusDistribution || { pending: 0, approved: 0, rejected: 0, archived: 0 };

  return (
    <div className="space-y-6">
      {/* Header & Space Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rating Analytics</h2>
          <p className="text-sm text-slate-500">Real-time rating distribution and customer feedback metrics</p>
        </div>

        {spaces.length > 0 && (
          <div className="w-full sm:w-72">
            <Select
              label="Select Space"
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              options={spaces.map((s) => ({ value: s._id, label: s.name }))}
            />
          </div>
        )}
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Rating</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-900">{analytics?.metrics?.averageRating || 0}</h3>
                <span className="text-xs text-slate-500">/ 5.0</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reviews</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{total}</h3>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval Rate</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">{analytics?.metrics?.approvalRate || 0}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured / Liked</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-purple-600">{analytics?.metrics?.featuredCount || 0}</h3>
                <span className="text-xs text-slate-400">/ {analytics?.metrics?.likedCount || 0} liked</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Heart className="h-6 w-6 fill-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution Bar Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Star Rating Breakdown</CardTitle>
            <CardDescription>Calculated from MongoDB database records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDist[star] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 w-16 font-semibold text-slate-700">
                    <span>{star}</span>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                    <div
                      className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="w-20 text-right font-medium text-slate-600">
                    {count} <span className="text-xs text-slate-400">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Moderation Status Breakdown</CardTitle>
            <CardDescription>Distribution across review moderation states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Approved Reviews</span>
                </div>
                <span className="font-bold text-emerald-700 text-lg">{statusDist.approved}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Pending Reviews</span>
                </div>
                <span className="font-bold text-amber-700 text-lg">{statusDist.pending}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-rose-600" />
                  <span className="font-semibold text-rose-900">Rejected Reviews</span>
                </div>
                <span className="font-bold text-rose-700 text-lg">{statusDist.rejected}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">Archived Reviews</span>
                </div>
                <span className="font-bold text-slate-700 text-lg">{statusDist.archived}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
