'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Brain, Sparkles, Send, Mic, Type, Users, Book, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '@/app/lib/firebase';

export default function GyanKoshPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useStore();

  // State for the feature
  const [question, setQuestion] = useState('');
  const [explanationType, setExplanationType] = useState('analogy');
  const [ageGroup, setAgeGroup] = useState('8-10');
  const [subject, setSubject] = useState('Science');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const handleGenerate = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question.');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedAnswer('');
    
    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Authentication required.");

        const response = await fetch('/api/ai/gyan-kosh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                question,
                explanationType,
                ageGroup,
                language,
                subject
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || 'Failed to get an answer.');
        }

        setGeneratedAnswer(data.answer);
        toast.success('Answer generated successfully!');

    } catch (error: any) {
        console.error("Gyan-Kosh generation error:", error);
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
                <Brain className="text-purple-500" />
                {t(language, 'features.gyanKosh.title')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-md p-6">
          
          <div className="mb-6">
            <label htmlFor="question" className="block text-lg font-medium text-gray-800 mb-2">Ask any question</label>
            <div className="relative">
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                placeholder="e.g., Why is the sky blue?"
              />
              <button className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200" disabled>
                <Mic size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="explanationType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Type size={16} /> Explanation Style</label>
              <select id="explanationType" value={explanationType} onChange={(e) => setExplanationType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="basic">Basic Explanation</option>
                <option value="detailed">Detailed Explanation</option>
                <option value="analogy">Analogy-Based</option>
                <option value="story">Story Format</option>
              </select>
            </div>
            <div>
              <label htmlFor="ageGroup" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Users size={16} /> Student Age Group</label>
              <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="5-7">5-7 years</option>
                <option value="8-10">8-10 years</option>
                <option value="11-13">11-13 years</option>
                <option value="14-16">14-16 years</option>
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Book size={16} /> Subject Area</label>
              <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="Science">Science</option>
                <option value="Math">Math</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isGenerating} className="w-full btn-primary bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 py-3 text-base">
            {isGenerating ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles size={20} /> Get Instant Answer</>}
          </button>

        </motion.div>

        {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-gray-600">
                <p>Please wait while the AI crafts the perfect explanation...</p>
            </motion.div>
        )}

        {generatedAnswer && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2"><Bot /> AI Generated Answer</h2>
            <div className="prose prose-base max-w-none whitespace-pre-wrap">
              <p>{generatedAnswer}</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
