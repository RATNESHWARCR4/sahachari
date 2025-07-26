'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Image as ImageIcon, Sparkles, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '@/app/lib/firebase';

export default function RupdrishtiPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useStore();

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('blackboard');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isText, setIsText] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the visual aid.');
      return;
    }
    setIsGenerating(true);
    setGeneratedContent(null);
    
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Authentication required.");

        const response = await fetch('/api/ai/rupdrishti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt, style })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.details || 'Failed to generate visual aid.');
        }
        
        setGeneratedContent(data.content);
        setIsText(data.isText);
        toast.success('Visual aid generated successfully!');

    } catch (error: any) {
        console.error("Rupdrishti generation error:", error);
        toast.error(`Error: ${error.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin" size={32} /></div>;
  }
  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gray-50 lang-${language}`}>
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/')} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
                <ArrowLeft size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="text-orange-500" />
                {t(language, 'features.rupdrishti.title')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Describe the Visual Aid</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                rows={4}
                placeholder="e.g., A simple diagram of the water cycle"
              />

              <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-800">2. Choose a Style</h2>
              <div className="space-y-2">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${style === 'blackboard' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                  <input type="radio" name="style" value="blackboard" checked={style === 'blackboard'} onChange={(e) => setStyle(e.target.value)} className="sr-only" />
                  <div className="ml-2">
                    <p className="font-semibold">Blackboard Drawing</p>
                    <p className="text-sm text-gray-600">Simple black & white line art.</p>
                  </div>
                </label>
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${style === 'grid' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                  <input type="radio" name="style" value="grid" checked={style === 'grid'} onChange={(e) => setStyle(e.target.value)} className="sr-only" />
                  <div className="ml-2">
                    <p className="font-semibold">Chalk Grid Diagram</p>
                    <p className="text-sm text-gray-600">ASCII-style for charts and layouts.</p>
                  </div>
                </label>
              </div>

              <button onClick={handleGenerate} disabled={isGenerating} className="w-full btn-primary bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2 mt-6 py-3 text-base">
                {isGenerating ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles size={20} /> Generate Visual</>}
              </button>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 self-start">Generated Visual Aid</h2>
              <div className="flex-grow w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
                {isGenerating && <Loader2 className="animate-spin text-orange-500" size={48} />}
                {generatedContent && !isGenerating && (
                  isText ? (
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap text-center">{generatedContent}</pre>
                  ) : (
                    <img src={generatedContent} alt="Generated visual aid" className="max-w-full max-h-full object-contain" />
                  )
                )}
                {!generatedContent && !isGenerating && (
                  <p className="text-gray-500 text-center p-4">Your visual aid will appear here.</p>
                )}
              </div>
              {generatedContent && !isText && (
                <a href={generatedContent} download="visual-aid.png" className="w-full btn-outline flex items-center justify-center gap-2 mt-4">
                  <Download size={20} /> Download
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
