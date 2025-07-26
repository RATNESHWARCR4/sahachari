'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { 
  BookOpen, 
  FileText, 
  Brain, 
  Image, 
  Mic, 
  Gamepad2, 
  Calendar, 
  Users,
  Globe,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const features = [
  {
    icon: BookOpen,
    key: 'storyMaker',
    href: '/story-maker',
    color: 'bg-blue-500',
  },
  {
    icon: FileText,
    key: 'worksheetCreator',
    href: '/worksheet-creator',
    color: 'bg-green-500',
  },
  {
    icon: Brain,
    key: 'gyanKosh',
    href: '/gyan-kosh',
    color: 'bg-purple-500',
  },
  {
    icon: Image,
    key: 'rupdrishti',
    href: '/rupdrishti',
    color: 'bg-orange-500',
  },
  {
    icon: Mic,
    key: 'readingAssessment',
    href: '/reading-assessment',
    color: 'bg-red-500',
  },
  {
    icon: Gamepad2,
    key: 'gameGenerator',
    href: '/game-generator',
    color: 'bg-indigo-500',
  },
  {
    icon: Calendar,
    key: 'lessonPlanner',
    href: '/lesson-planner',
    color: 'bg-pink-500',
  },
  {
    icon: Users,
    key: 'teacherCircles',
    href: '/teacher-circles',
    color: 'bg-teal-500',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language, setLanguage } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="ml-2 text-2xl font-bold text-primary-600">
                {t(language, 'app.name')}
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                <User size={20} className="inline mr-1" />
                {t(language, 'nav.profile')}
              </Link>
              
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="mr">मराठी</option>
              </select>
              
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-gray-700 hover:text-primary-600"
              >
                <LogOut size={20} />
              </button>
            </nav>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <User size={20} className="inline mr-2" />
                {t(language, 'nav.profile')}
              </Link>
              
              <div className="px-3 py-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t(language, 'auth.selectLanguage')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              
              <button
                onClick={() => router.push('/auth/signin')}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={20} className="inline mr-2" />
                {t(language, 'nav.logout')}
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              {t(language, 'app.tagline')}
            </h2>
            <p className="text-xl opacity-90">
              {t(language, 'app.description')}
            </p>
            <div className="mt-6">
              <p className="text-lg">
                {t(language, 'common.welcome')}, <span className="font-semibold">{user.name}</span>!
              </p>
              {user.school && (
                <p className="text-sm opacity-75 mt-1">{user.school}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {t(language, `features.${feature.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {t(language, `features.${feature.key}.description`)}
                    </p>
                    <div className="flex items-center text-primary-600 text-sm font-medium">
                      {t(language, 'common.getStarted')}
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Offline Mode Indicator */}
      {useStore.getState().isOffline && (
        <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{t(language, 'common.offlineMode')}</p>
        </div>
      )}
    </div>
  );
}