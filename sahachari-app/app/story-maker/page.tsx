'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Download,
  Share2,
  Save,
  Loader2,
  BookOpen,
  Sparkles,
  Copy,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '@/app/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

interface SavedStory {
  id: string;
  title: string;
  content: string;
  topic: string;
  ageGroup: string;
  createdAt: Date;
}

export default function StoryMakerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useStore();
  
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('6-9');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [showSavedStories, setShowSavedStories] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadSavedStories();
    }
  }, [user]);

  const loadSavedStories = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'stories'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const stories: SavedStory[] = [];
      
      querySnapshot.forEach((doc) => {
        stories.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as SavedStory);
      });
      
      setSavedStories(stories);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Convert to text using Web Speech API or send to server
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    // For demo purposes, we'll use Web Speech API
    // In production, this would send to your speech-to-text API
    toast('Processing audio...', {
      icon: <Loader2 className="animate-spin" />,
    });
    
    // Simulate processing
    setTimeout(() => {
      toast.success('Audio processed!');
    }, 2000);
  };

  const generateStory = async () => {
    if (!prompt && !topic) {
      toast.error('Please provide a prompt or topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      
      // Use demo endpoint if running locally or if credentials not configured
      const endpoint = process.env.NEXT_PUBLIC_USE_DEMO === 'true' || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID 
        ? '/api/ai/story/demo' 
        : '/api/ai/story';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          topic,
          ageGroup,
          language,
          state: user?.state || 'India',
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedStory(data.story);
        if (data.metadata?.isDemo) {
          toast.success('Demo story generated! (Configure Google Cloud for AI generation)');
        } else {
          toast.success('Story generated successfully!');
        }
      } else {
        toast.error('Failed to generate story');
      }
    } catch (error) {
      console.error('Story generation error:', error);
      toast.error('Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveStory = async () => {
    if (!generatedStory) {
      toast.error('No story to save');
      return;
    }
    
    try {
      const storyData = {
        userId: user?.id,
        title: topic || prompt.slice(0, 50) + '...',
        content: generatedStory,
        topic,
        ageGroup,
        language,
        createdAt: new Date(),
      };
      
      await addDoc(collection(db, 'stories'), storyData);
      toast.success('Story saved successfully!');
      loadSavedStories();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save story');
    }
  };

  const speakStory = () => {
    if (!generatedStory) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(generatedStory);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const downloadStory = () => {
    if (!generatedStory) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedStory], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `story-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Story downloaded!');
  };

  const shareOnWhatsApp = () => {
    if (!generatedStory) return;
    
    const text = encodeURIComponent(generatedStory);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    if (!generatedStory) return;
    
    navigator.clipboard.writeText(generatedStory);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gray-50 lang-${language}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
            
            <button
              onClick={() => setShowSavedStories(!showSavedStories)}
              className="btn-outline flex items-center gap-2"
            >
              <BookOpen size={20} />
              {savedStories.length > 0 && (
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
                  {savedStories.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="text-primary-500" size={20} />
                {t(language, 'features.storyMaker.description')}
              </h2>
              
              {/* Topic Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Soil types, Water cycle, Numbers..."
                />
              </div>
              
              {/* Age Group */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="3-5">3-5 years</option>
                  <option value="6-9">6-9 years</option>
                  <option value="10-12">10-12 years</option>
                </select>
              </div>
              
              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(language, 'features.storyMaker.placeholder')}
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder={t(language, 'features.storyMaker.placeholder')}
                  />
                  
                  {/* Voice Input Button */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute bottom-3 right-3 p-2 rounded-full ${
                      isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>
              </div>
              
              {/* Generate Button */}
              <button
                onClick={generateStory}
                disabled={isGenerating}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {t(language, 'features.storyMaker.generate')}
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Generated Story</h2>
              
              {generatedStory ? (
                <>
                  <div className="prose prose-sm max-w-none mb-6 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
                    <p className="whitespace-pre-wrap">{generatedStory}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={speakStory}
                      className="btn-outline flex items-center justify-center gap-2 text-sm"
                    >
                      <Volume2 size={16} />
                      {isSpeaking ? 'Stop' : t(language, 'features.storyMaker.readAloud')}
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="btn-outline flex items-center justify-center gap-2 text-sm"
                    >
                      <Copy size={16} />
                      {t(language, 'common.copy')}
                    </button>
                    
                    <button
                      onClick={downloadStory}
                      className="btn-outline flex items-center justify-center gap-2 text-sm"
                    >
                      <Download size={16} />
                      {t(language, 'features.storyMaker.download')}
                    </button>
                    
                    <button
                      onClick={shareOnWhatsApp}
                      className="btn-outline flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare size={16} />
                      WhatsApp
                    </button>
                  </div>
                  
                  <button
                    onClick={saveStory}
                    className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {t(language, 'common.save')}
                  </button>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your generated story will appear here</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Saved Stories Sidebar */}
        {showSavedStories && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Saved Stories</h3>
                <button
                  onClick={() => setShowSavedStories(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {savedStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setGeneratedStory(story.content)}
                  >
                    <h4 className="font-medium text-sm mb-1">{story.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Age: {story.ageGroup} | {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {story.content}
                    </p>
                  </div>
                ))}
                
                {savedStories.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No saved stories yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
