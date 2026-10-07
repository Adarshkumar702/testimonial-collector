import React, { useState, useEffect } from 'react';
import { spaceService } from '../services/spaceService';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Code2, Copy, Check, Eye, LayoutGrid, Sliders, Sparkles } from 'lucide-react';

export const EmbedGenerator = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceSlug, setSelectedSpaceSlug] = useState('');
  const [theme, setTheme] = useState('light'); // light, dark
  const [layout, setLayout] = useState('grid'); // grid, carousel, badge
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await spaceService.getOwnerSpaces();
        setSpaces(res.data);
        if (res.data.length > 0) {
          setSelectedSpaceSlug(res.data[0].slug);
        }
      } catch (e) {
        console.error('Failed to load spaces for embed builder', e);
      }
    };
    fetchSpaces();
  }, []);

  const embedUrl = `${window.location.origin}/embed/${selectedSpaceSlug || 'acme-corp'}?theme=${theme}&layout=${layout}`;

  const embedSnippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${layout === 'badge' ? '120' : '600'}"
  frameborder="0"
  scrolling="no"
  style="border: none; overflow: hidden;"
  title="Customer Testimonials">
</iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    addToast('Embed code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Embed Generator</h2>
        <p className="text-sm text-slate-500">Configure widget theme and layout to embed on your website or app</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sliders className="h-4 w-4 text-brand-600" />
              Widget Customizer
            </CardTitle>
            <CardDescription>Select space, theme and presentation format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Space Select */}
            {spaces.length > 0 && (
              <Select
                label="Target Space"
                value={selectedSpaceSlug}
                onChange={(e) => setSelectedSpaceSlug(e.target.value)}
                options={spaces.map((s) => ({ value: s.slug, label: `${s.name} (/${s.slug})` }))}
              />
            )}

            {/* Theme Picker */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Color Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    theme === 'light'
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-white border border-slate-300" />
                  <span>Light Theme</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    theme === 'dark'
                      ? 'border-brand-600 bg-slate-900 text-white ring-2 ring-brand-500'
                      : 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-slate-800 border border-slate-600" />
                  <span>Dark Theme</span>
                </button>
              </div>
            </div>

            {/* Layout Picker */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Layout Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'grid', label: 'Grid' },
                  { id: 'carousel', label: 'Carousel' },
                  { id: 'badge', label: 'Badge' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLayout(l.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      layout === l.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Embed Code Action */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-medium text-slate-700">HTML Iframe Snippet</label>
              <textarea
                readOnly
                rows={5}
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 focus:outline-none"
                value={embedSnippet}
              />
              <Button
                className="w-full"
                icon={copied ? Check : Copy}
                onClick={handleCopyCode}
                size="lg"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview Column */}
        <Card className="lg:col-span-2 border-slate-200 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4 text-brand-600" />
                Live Embed Widget Preview
              </CardTitle>
              <CardDescription>Real-time rendering of approved testimonials</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 bg-slate-100/70 rounded-b-xl min-h-[500px]">
            <iframe
              src={embedUrl}
              key={embedUrl}
              className="w-full h-full min-h-[480px] rounded-xl border border-slate-200 bg-transparent shadow-sm"
              title="Embed Preview"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
