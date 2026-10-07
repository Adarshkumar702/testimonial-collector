import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { spaceService } from '../services/spaceService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Layers, MessageSquare, Clock, Star, Plus, ArrowRight, ExternalLink } from 'lucide-react';

export const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, spacesRes] = await Promise.all([
          analyticsService.getOverview(),
          spaceService.getOwnerSpaces()
        ]);
        setOverview(overviewRes.data);
        setSpaces(spacesRes.data);
      } catch (err) {
        console.error('Failed to load dashboard overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader label="Loading overview metrics..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview Dashboard</h2>
          <p className="text-sm text-slate-500">Monitor your collection spaces, incoming testimonials & analytics</p>
        </div>
        <Link to="/dashboard/spaces/new">
          <Button icon={Plus}>Create New Space</Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/dashboard/spaces" className="block group">
          <Card className="p-5 border-slate-200 transition-all duration-200 hover:shadow-md hover:border-brand-300 group-hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-brand-600 transition-colors">Total Spaces</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{overview?.totalSpaces || 0}</h3>
              </div>
              <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/dashboard/reviews" className="block group">
          <Card className="p-5 border-slate-200 transition-all duration-200 hover:shadow-md hover:border-purple-300 group-hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Total Reviews</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{overview?.totalTestimonials || 0}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/dashboard/reviews" className="block group">
          <Card className="p-5 border-slate-200 transition-all duration-200 hover:shadow-md hover:border-amber-300 group-hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Pending Reviews</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">{overview?.pendingTestimonials || 0}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/dashboard/analytics" className="block group">
          <Card className="p-5 border-slate-200 transition-all duration-200 hover:shadow-md hover:border-emerald-300 group-hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Average Rating</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-slate-900">{overview?.averageRating || 0}</h3>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Star className="h-6 w-6 fill-emerald-600 group-hover:fill-white" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Spaces Overview Table */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Spaces</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Quick access to collection links, moderation, and embeds</p>
          </div>
          <Link to="/dashboard/spaces" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {spaces.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              You haven't created any Spaces yet. Click <strong>Create New Space</strong> to get started!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {spaces.map((space) => (
                <div key={space._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-base">{space.name}</h4>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">/{space.slug}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Total: {space.stats?.total || 0}</span>
                      <span className="text-amber-600 font-medium">Pending: {space.stats?.pending || 0}</span>
                      <span className="text-emerald-600 font-medium">Approved: {space.stats?.approved || 0}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/collect/${space.slug}`} target="_blank">
                      <Button variant="outline" size="sm" icon={ExternalLink}>
                        Public Form
                      </Button>
                    </Link>
                    <Link to={`/wall/${space.slug}`} target="_blank">
                      <Button variant="outline" size="sm" icon={ExternalLink}>
                        Wall of Love
                      </Button>
                    </Link>
                    <Link to={`/dashboard/reviews?spaceId=${space._id}`}>
                      <Button variant="secondary" size="sm">
                        Moderate Reviews
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
