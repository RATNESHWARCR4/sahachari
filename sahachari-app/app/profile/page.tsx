'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react'; // Import ArrowLeft

export default function ProfilePage() {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [teacherId, setTeacherId] = useState(user?.teacherId || '');
  const [schoolAddress, setSchoolAddress] = useState(user?.schoolAddress || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Update state when user data changes (e.g., after login or update)
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setTeacherId(user.teacherId || '');
      setSchoolAddress(user.schoolAddress || '');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      phone: phone === '' ? undefined : phone, // Save as undefined if empty to remove from Firestore
      teacherId: teacherId === '' ? undefined : teacherId,
      schoolAddress: schoolAddress === '' ? undefined : schoolAddress,
    };

    const result = await updateUserProfile(updates);

    if (result.success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 mb-8">
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
                Profile
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              ) : (
                <p className="text-lg text-gray-900">{user.phone || 'N/A'}</p>
              )}
            </div>

            {/* Teacher ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher ID</label>
              {isEditing ? (
                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              ) : (
                <p className="text-lg text-gray-900">{user.teacherId || 'N/A'}</p>
              )}
            </div>

            {/* School Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">School Address</label>
              {isEditing ? (
                <textarea
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              ) : (
                <p className="text-lg text-gray-900">{user.schoolAddress || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  'Save'
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
