import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { spaceService } from '../services/spaceService';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Loader } from '../components/ui/Loader';
import { ArrowLeft, Upload, Plus, Trash2, HelpCircle, Check, AlertCircle } from 'lucide-react';

export const CreateSpace = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [prompt, setPrompt] = useState('Would you mind taking a minute to leave us a testimonial? Your feedback means a lot to us!');
  const [requireAvatar, setRequireAvatar] = useState(false);
  const [requireRating, setRequireRating] = useState(true);
  const [customQuestions, setCustomQuestions] = useState(['What feature do you use the most?']);
  const [newQuestion, setNewQuestion] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [slugError, setSlugError] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchSpace = async () => {
        try {
          const response = await spaceService.getSpaceById(id);
          const s = response.data;
          setName(s.name);
          setSlug(s.slug);
          setPrompt(s.prompt);
          setRequireAvatar(s.requireAvatar);
          setRequireRating(s.requireRating);
          setCustomQuestions(s.customQuestions || []);
          if (s.logoUrl) setLogoPreview(s.logoUrl);
        } catch (err) {
          addToast('Failed to load space details', 'error');
          navigate('/dashboard/spaces');
        } finally {
          setLoading(false);
        }
      };
      fetchSpace();
    }
  }, [id, isEdit, addToast, navigate]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit && val) {
      const autoSlug = val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      setSlug(autoSlug);
      checkSlugDebounced(autoSlug);
    }
  };

  const handleSlugChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    setSlug(val);
    checkSlugDebounced(val);
  };

  const checkSlugDebounced = async (val) => {
    if (!val) {
      setSlugAvailable(false);
      setSlugError('Slug cannot be empty');
      return;
    }
    setSlugChecking(true);
    try {
      const res = await spaceService.checkSlug(val, isEdit ? id : null);
      setSlugAvailable(res.data.available);
      setSlugError(res.data.available ? '' : 'Slug is already taken');
    } catch (e) {
      setSlugAvailable(false);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setCustomQuestions([...customQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (index) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      addToast('Please provide a space name and unique slug', 'error');
      return;
    }

    if (!slugAvailable && !isEdit) {
      addToast('Slug is already taken. Please choose another slug.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('prompt', prompt);
      formData.append('requireAvatar', requireAvatar);
      formData.append('requireRating', requireRating);
      formData.append('customQuestions', JSON.stringify(customQuestions));
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (isEdit) {
        await spaceService.updateSpace(id, formData);
        addToast('Space updated successfully', 'success');
      } else {
        await spaceService.createSpace(formData);
        addToast('Space created successfully', 'success');
      }
      navigate('/dashboard/spaces');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save space', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading space data..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/spaces">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Spaces
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isEdit ? 'Edit Space Configuration' : 'Create New Collection Space'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md border-slate-200">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Branding and public collection details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Space Name"
              placeholder="Acme Corporation"
              value={name}
              onChange={handleNameChange}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Public Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2.5 rounded-lg border border-slate-200">
                  /collect/
                </span>
                <Input
                  placeholder="acme-corp"
                  value={slug}
                  onChange={handleSlugChange}
                  error={slugError}
                  required
                />
              </div>
              {!slugError && slug && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <Check className="h-3.5 w-3.5" /> Slug is available! Public URL: {window.location.origin}/collect/{slug}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Brand Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-contain rounded-xl border p-1" />
                ) : (
                  <div className="h-16 w-16 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="outline" size="sm" type="button" onClick={() => document.getElementById('logo-upload').click()}>
                      Upload Logo Image
                    </Button>
                  </label>
                  <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Collection Prompt */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Collection Header Prompt</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What did you think of our service?"
              />
            </div>

            {/* Form Preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Form Requirements</h4>

              <Switch
                checked={requireRating}
                onChange={setRequireRating}
                label="Require Star Rating (1 to 5)"
                description="Customers must select a star rating before submitting"
              />

              <Switch
                checked={requireAvatar}
                onChange={setRequireAvatar}
                label="Require Customer Avatar Upload"
                description="Mandatory profile photo for submission"
              />
            </div>

            {/* Custom Questions Builder */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-brand-600" />
                  Custom Questions (Optional)
                </h4>
                <p className="text-xs text-slate-500">Ask targeted extra questions on your testimonial submission form</p>
              </div>

              <div className="space-y-2">
                {customQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <span className="font-medium text-slate-800">{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g. What specific feature helped you the most?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                />
                <Button type="button" variant="secondary" icon={Plus} onClick={handleAddQuestion}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Link to="/dashboard/spaces">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting} size="lg">
              {isEdit ? 'Save Changes' : 'Create Space'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
