import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { spaceService } from '../services/spaceService';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import { Dialog } from '../components/ui/Dialog';
import { Layers, Plus, ExternalLink, Settings, Trash2, Copy, Check, Heart, HelpCircle } from 'lucide-react';

export const Spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [deleteSpaceId, setDeleteSpaceId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchSpaces = async () => {
    try {
      const response = await spaceService.getOwnerSpaces();
      setSpaces(response.data);
    } catch (err) {
      addToast('Failed to load spaces', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/collect/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    addToast('Public submission URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteSpaceId) return;
    setIsDeleting(true);
    try {
      await spaceService.deleteSpace(deleteSpaceId);
      addToast('Space and associated reviews deleted successfully', 'success');
      setDeleteSpaceId(null);
      fetchSpaces();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete space', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading your collection spaces..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Spaces Management</h2>
          <p className="text-sm text-slate-500">Configure collection forms, logos, prompts & custom questions</p>
        </div>
        <Link to="/dashboard/spaces/new">
          <Button icon={Plus}>Create Space</Button>
        </Link>
      </div>

      {spaces.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Spaces Created Yet"
          description="Create your first Space to generate a branded public URL and start collecting customer testimonials."
          actionLabel="Create Your First Space"
          onAction={() => window.location.href = '/dashboard/spaces/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card key={space._id} className="flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {space.logoUrl ? (
                      <img src={space.logoUrl} alt={space.name} className="h-10 w-10 object-contain rounded-lg border p-1" />
                    ) : (
                      <div className="h-10 w-10 bg-brand-100 text-brand-700 font-bold rounded-lg flex items-center justify-center text-base border border-brand-200">
                        {space.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{space.name}</CardTitle>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">/{space.slug}</p>
                    </div>
                  </div>
                  <Link to={`/dashboard/spaces/edit/${space._id}`}>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <Settings className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 py-2 text-xs">
                <p className="text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg italic border border-slate-100">
                  "{space.prompt}"
                </p>

                <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                  <div>
                    <span className="block text-slate-400 font-medium">Total</span>
                    <span className="font-bold text-slate-800 text-sm">{space.stats?.total || 0}</span>
                  </div>
                  <div>
                    <span className="block text-amber-600 font-medium">Pending</span>
                    <span className="font-bold text-amber-600 text-sm">{space.stats?.pending || 0}</span>
                  </div>
                  <div>
                    <span className="block text-emerald-600 font-medium">Approved</span>
                    <span className="font-bold text-emerald-600 text-sm">{space.stats?.approved || 0}</span>
                  </div>
                </div>

                {space.customQuestions && space.customQuestions.length > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <HelpCircle className="h-3.5 w-3.5 text-brand-500" />
                    <span>{space.customQuestions.length} custom question(s) configured</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={copiedSlug === space.slug ? Check : Copy}
                    onClick={() => handleCopyLink(space.slug)}
                  >
                    {copiedSlug === space.slug ? 'Copied URL!' : 'Copy Form URL'}
                  </Button>
                </div>

                <div className="flex w-full gap-2">
                  <Link to={`/wall/${space.slug}`} target="_blank" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full text-xs" icon={Heart}>
                      Wall of Love
                    </Button>
                  </Link>
                  <Link to={`/dashboard/reviews?spaceId=${space._id}`} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Reviews
                    </Button>
                  </Link>
                  <button
                    onClick={() => setDeleteSpaceId(space._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Space"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={!!deleteSpaceId}
        onClose={() => setDeleteSpaceId(null)}
        title="Delete Space & All Reviews"
        description="Are you sure you want to delete this space? All associated testimonials and uploaded images will be permanently removed. This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteSpaceId(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Confirm Delete
            </Button>
          </>
        }
      />
    </div>
  );
};
