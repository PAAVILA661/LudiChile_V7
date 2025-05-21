"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react"; // Added useMemo
import Image from 'next/image'; // Added Image import

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  // Calculate completed exercises count
  const completedExercisesCount = useMemo(() => {
    if (!user?.progress) return 0;
    return user.progress.filter(p => p.status === 'COMPLETED' && p.exercise_id !== null).length;
  }, [user?.progress]);

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
      <div className="codedex-container max-w-3xl mx-auto"> {/* Centered and max-width for better layout */}
        <h1 className="text-3xl font-pixel text-codedex-gold mb-8 text-center">My Profile</h1>
        
        {/* User Details Card */}
        <div className="bg-codedex-navy p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-codedex-teal mb-4 border-b border-codedex-gold/20 pb-2">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-semibold text-gray-300">Name:</span> {user.name || 'Not set'}</div>
            <div><span className="font-semibold text-gray-300">Email:</span> {user.email}</div>
            <div><span className="font-semibold text-gray-300">Role:</span> {user.role}</div>
            <div><span className="font-semibold text-gray-300">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</div>
          </div>
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
