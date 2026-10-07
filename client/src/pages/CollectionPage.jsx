import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { spaceService } from '../services/spaceService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Rating } from '../components/ui/Rating';
import { Loader } from '../components/ui/Loader';
import { Sparkles, User, Mail, Briefcase, Upload, CheckCircle2, Star, HelpCircle } from 'lucide-react';

export const CollectionPage = () => {
  const { spaceSlug } = useParams();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [customAnswers, setCustomAnswers] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await spaceService.getPublicSpace(spaceSlug);
        setSpace(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Space not found or unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceSlug]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCustomAnswerChange = (question, answer) => {
    setCustomAnswers((prev) => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      addToast('Please enter your name', 'error');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    if (!reviewText.trim()) {
      addToast('Please write your review feedback', 'error');
      return;
    }

    if (space.requireAvatar && !avatarFile) {
      addToast('Please upload a profile photo/avatar', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('customerEmail', customerEmail);
      formData.append('companyRole', companyRole);
      formData.append('rating', rating);
      formData.append('reviewText', reviewText);

      // Convert custom answers object to array of { question, answer }
      const answersArray = Object.entries(customAnswers).map(([q, a]) => ({
        question: q,
        answer: a
      }));
      formData.append('customAnswers', JSON.stringify(answersArray));

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await spaceService.submitPublicTestimonial(spaceSlug, formData);
      setSubmitted(true);
      addToast('Thank you! Your testimonial has been submitted.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please check your inputs.';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading testimonial collection form..." />;

  if (error || !space) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Space Unavailable</h3>
          <p className="text-sm text-slate-500">{error || 'This collection space does not exist.'}</p>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Space Header Branding */}
        <div className="text-center space-y-3">
          {space.logoUrl ? (
            <img src={space.logoUrl} alt={space.name} className="h-16 max-w-[180px] object-contain mx-auto" />
          ) : (
            <div className="h-16 w-16 bg-brand-600 text-white font-bold rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-md">
              {space.name[0]?.toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{space.name}</h1>
          <p className="text-base text-slate-600 max-w-lg mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm italic">
            "{space.prompt}"
          </p>
        </div>

        {/* Submission Form Card */}
        {submitted ? (
          <Card className="shadow-lg border-emerald-200 bg-emerald-50/50 p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Thank You for Your Review!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your feedback has been submitted successfully to <strong>{space.name}</strong> and is currently pending review by the team.
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Submit Another Response
            </Button>
          </Card>
        ) : (
          <Card className="shadow-xl border-slate-200">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-8">
                {/* Rating Selector */}
                {space.requireRating && (
                  <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700">
                      Overall Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center">
                      <Rating value={rating} onChange={setRating} size="lg" showLabel />
                    </div>
                  </div>
                )}

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Your Review Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm"
                    placeholder="Write a few sentences about your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    icon={User}
                    placeholder="Alex Rivera"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="alex@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Title / Role at Company (Optional)"
                  icon={Briefcase}
                  placeholder="e.g. CTO at TechFlow"
                  value={companyRole}
                  onChange={(e) => setCompanyRole(e.target.value)}
                />

                {/* Avatar Photo Upload */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700">
                    Profile Photo / Avatar {space.requireAvatar ? <span className="text-red-500">*</span> : '(Optional)'}
                  </label>
                  <div className="flex items-center gap-4">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar Preview" className="h-14 w-14 rounded-full object-cover border" />
                    ) : (
                      <div className="h-14 w-14 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <Upload className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <label htmlFor="avatar-upload">
                        <Button variant="outline" size="sm" type="button" onClick={() => document.getElementById('avatar-upload').click()}>
                          Choose Avatar File
                        </Button>
                      </label>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Custom Questions Section */}
                {space.customQuestions && space.customQuestions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-brand-600" /> Additional Questions
                    </h4>
                    {space.customQuestions.map((q, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">{q}</label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          placeholder="Your answer..."
                          value={customAnswers[q] || ''}
                          onChange={(e) => handleCustomAnswerChange(q, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  Send Testimonial
                </Button>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
