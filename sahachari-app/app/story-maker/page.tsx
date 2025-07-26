'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Copy,
  FileText,
  Loader2,
  Volume2,
  Play,
  Pause,
  Download,
  Share2,
  Type,
  Users,
  Clock,
  Book,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, db } from '@/app/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

interface SavedStory {
  id: string;
  title: string;
  content: string;
  topic: string;
  ageGroup: string;
  createdAt: Date;
}

// Audio Player Component
const AudioPlayer = ({ src, onEnded }: { src: string; onEnded: () => void }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        onEnded();
      });

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [onEnded]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlayPause} className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600">
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <div className="flex-grow">
        <input
          type="range"
          value={currentTime}
          max={duration || 0}
          onChange={handleSeek}
          className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-primary-700 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};


export default function StoryMakerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useStore();
  
  // Form state
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('6-9');
  const [storyType, setStoryType] = useState('story');
  const [storyLength, setStoryLength] = useState('short');
  const [subject, setSubject] = useState('Moral Values');
  
  // Content and audio state
  const [generatedStory, setGeneratedStory] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Saved stories state
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [showSavedStories, setShowSavedStories] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const generateStory = async () => {
    if (!topic) {
      toast.error('Please provide a topic for the story.');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedStory('');
    setAudioSrc(null);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Authentication required.');
      
      const response = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ language, topic, ageGroup, storyType, storyLength, subject, state: user?.state || 'India' }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || 'Failed to generate story.');
      
      setGeneratedStory(data.story);
      toast.success('Story generated successfully!');

    } catch (error: any) {
      console.error('Story generation error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudio = async () => {
    if (!generatedStory) {
      toast.error('Generate a story first before creating audio.');
      return;
    }
    setIsSynthesizing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Authentication required.');

      const response = await fetch('/api/ai/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: generatedStory, languageCode: language + '-IN' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to synthesize audio.');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioSrc(url);
      toast.success('Audio generated successfully!');

    } catch (error: any) {
      console.error('Audio synthesis error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(generatedStory);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary-500" size={48} /></div>;
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gray-50 lang-${language}`}>
       <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {t(language, 'features.storyMaker.title')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800"><Sparkles className="text-primary-500" size={24} />1. Describe Your Story</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">What should the story be about?</label>
                  <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g., The importance of water" />
                </div>
                <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-gray-800"><Sparkles className="text-primary-500" size={24} />2. Customize It</h3>
                 <div>
                  <label htmlFor="storyType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Type size={16} />Story Type</label>
                  <select id="storyType" value={storyType} onChange={(e) => setStoryType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="story">Story</option><option value="poem">Poem</option><option value="riddle">Riddle</option><option value="song">Song</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ageGroup" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Users size={16} />Target Age Group</label>
                  <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="6-9">6-9 years</option><option value="10-12">10-12 years</option><option value="13-15">13-15 years</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="storyLength" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Clock size={16} />Desired Length</label>
                  <select id="storyLength" value={storyLength} onChange={(e) => setStoryLength(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="short">Short (2-3 mins)</option><option value="medium">Medium (5-7 mins)</option><option value="long">Long (10-12 mins)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Book size={16} />Subject Area</label>
                  <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="Science">Science</option><option value="Math">Math</option><option value="Social Studies">Social Studies</option><option value="Language">Language</option><option value="Moral Values">Moral Values</option><option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button onClick={generateStory} disabled={isGenerating} className="w-full btn-primary flex items-center justify-center gap-2 mt-6 py-3 text-base">
                {isGenerating ? <><Loader2 className="animate-spin" size={24} /> Generating...</> : <><Sparkles size={24} /> Generate Story</>}
              </button>
            </motion.div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Content</h2>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500"><Loader2 className="animate-spin text-primary-500" size={48} /><p className="mt-4 text-lg">Our AI is crafting your story...</p></div>
              ) : generatedStory ? (
                <>
                  <div className="prose prose-base max-w-none mb-6 p-4 bg-gray-50 rounded-lg max-h-80 overflow-y-auto custom-scrollbar border"><p className="whitespace-pre-wrap">{generatedStory}</p></div>
                  {audioSrc && <AudioPlayer src={audioSrc} onEnded={() => setAudioSrc(null)} />}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button onClick={generateAudio} disabled={isSynthesizing || !!audioSrc} className="btn-primary flex items-center justify-center gap-2 text-sm">
                      {isSynthesizing ? <><Loader2 className="animate-spin" size={20} />Creating Audio...</> : <><Volume2 size={16} /> Read Aloud</>}
                    </button>
                    <button onClick={copyToClipboard} className="btn-outline flex items-center justify-center gap-2 text-sm"><Copy size={16} /> Copy Text</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full"><FileText size={48} className="mx-auto mb-4 opacity-50" /><p className="text-lg font-medium">Your generated story will appear here.</p></div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
