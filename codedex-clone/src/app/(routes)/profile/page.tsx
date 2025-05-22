"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react"; // Added useState
import Image from 'next/image'; 
import { Button } from "@/components/ui/button"; // Added Button
import { Input } from "@/components/ui/input"; // Added Input
import { Edit3, Save, XCircle as XIcon, Loader2 } from "lucide-react"; // Added Icons

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, login } = useAuth(); // Added login to update context
  const router = useRouter();

  // State for editing name
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
    // Initialize editableName when user data is loaded or changes (if not currently editing)
    if (user && !isEditing) {
      setEditableName(user.name || '');
    }
  }, [isLoading, isAuthenticated, router, user, isEditing]);

  const completedExercisesCount = useMemo(() => {
    if (!user?.progress) return 0;
    return user.progress.filter(p => p.status === 'COMPLETED' && p.exercise_id !== null).length;
  }, [user?.progress]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditableName(user?.name || '');
    setEditMessage(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditMessage(null);
  };

  const handleSaveClick = async () => {
    if (editableName.trim() === '') {
      setEditMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    if (!user) {
        setEditMessage({ type: 'error', text: 'User not found. Please re-login.' });
        return;
    }

    setIsSaving(true);
    setEditMessage(null);

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editableName.trim() }), // API uses userId from token
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user); // Update AuthContext with the new user data
        setIsEditing(false);
        setEditMessage({ type: 'success', text: 'Name updated successfully!' });
      } else {
        setEditMessage({ type: 'error', text: data.message || 'Failed to update name.' });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setEditMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  const totalXP = user.user_xp?.total_xp || 0;

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container max-w-3xl mx-auto"> 
        <h1 className="text-3xl font-pixel text-codedex-gold mb-8 text-center">My Profile</h1>
        
        {/* User Details Card */}
        <div className="bg-codedex-navy p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-codedex-gold/20 pb-2">
            <h2 className="text-2xl font-semibold text-codedex-teal">User Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEditClick} className="text-codedex-gold border-codedex-gold/50 hover:bg-codedex-gold/10">
                <Edit3 size={16} className="mr-2" /> Edit Name
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {isEditing ? (
              <>
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-1">Display Name</label>
                  <Input
                    id="name"
                    type="text"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    className="bg-codedex-darkNavy border-codedex-gold/30 text-white focus:ring-codedex-gold focus:border-codedex-gold"
                    maxLength={50}
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={handleCancelClick} className="text-gray-300 hover:bg-gray-700">
                    <XIcon size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveClick} 
                    disabled={isSaving || editableName.trim() === ''}
                    className="bg-codedex-teal hover:bg-codedex-teal/80 text-white"
                  >
                    {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    Save
                  </Button>
                </div>
                {editMessage && (
                  <div className={`md:col-span-2 mt-2 text-sm ${editMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {editMessage.text}
                  </div>
                )}
              </>
            ) : (
              <div><span className="font-semibold text-gray-300">Name:</span> {user.name || 'Not set'}</div>
            )}
            <div><span className="font-semibold text-gray-300">Email:</span> {user.email}</div>
            <div><span className="font-semibold text-gray-300">Role:</span> {user.role}</div>
            <div><span className="font-semibold text-gray-300">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</div>
          </div>
           {!isEditing && editMessage && editMessage.type === 'success' && (
             <div className="mt-4 text-sm text-green-400">
               {editMessage.text}
             </div>
           )}
        </div>

        {/* Progress & Stats Card */}
        <div className="bg-codedex-navy p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-codedex-teal mb-4 border-b border-codedex-gold/20 pb-2">My Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-gray-300">Total XP:</span> 
              <span className="text-xl text-yellow-400 ml-2">{totalXP} XP</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">Exercises Completed:</span>
              <span className="text-xl text-green-400 ml-2">{completedExercisesCount}</span>
            </div>
          </div>
        </div>

        {/* Badges Card */}
        <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-codedex-teal mb-4 border-b border-codedex-gold/20 pb-2">My Badges</h2>
          {user.user_badges && user.user_badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {user.user_badges.map(userBadge => (
                <div key={userBadge.badge_id} className="flex flex-col items-center text-center p-3 bg-codedex-darkNavy rounded-md hover:bg-codedex-darkNavy/70 transition-colors">
                  {userBadge.badge.image_url && (
                    <div className="w-16 h-16 relative mb-2 rounded-full overflow-hidden shadow-md">
                       <Image
                        src={userBadge.badge.image_url}
                        alt={userBadge.badge.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <span className="text-xs text-gray-300">{userBadge.badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No badges earned yet. Keep learning to unlock them!</p>
          )}
        </div>

      </div>
    </div>
  );
}
