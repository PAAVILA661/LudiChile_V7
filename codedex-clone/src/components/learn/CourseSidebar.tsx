import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Static data for total exercises, projects, XP, and badges for the course
// This could eventually come from a course configuration or API
const TOTAL_COURSE_EXERCISES = 25; // Example value
const TOTAL_COURSE_PROJECTS = 2;   // Example value
const TOTAL_COURSE_XP = 5000;      // Example value
const TOTAL_COURSE_BADGES = 8;     // Corresponds to the static `courseBadgesData`

interface CourseSidebarProps {
  level: number; // Level might still be relevant as a prop or derived differently
  cheatSheets: {
    id: string;
    title: string;
    unlocksAfter: number;
    isUnlocked: boolean;
  }[];
  // Removed username and progress, as they will come from AuthContext
}

// Define static badge data, assuming badge names from DB match these ids for mapping
const courseBadgesData = [
  { id: 'Hello, World!', name: 'Hello, World!', image: 'https://ext.same-assets.com/1748103887/326291293.png' },
  { id: 'Variables & Data Types', name: 'Variables & Data Types', image: 'https://ext.same-assets.com/1748103887/3042823545.png' },
  { id: 'Control Flow', name: 'Control Flow', image: 'https://ext.same-assets.com/1748103887/3320105460.png' },
  { id: 'Loops', name: 'Loops', image: 'https://ext.same-assets.com/1748103887/1524852266.png' },
  { id: 'Lists & Dictionaries', name: 'Lists & Dictionaries', image: 'https://ext.same-assets.com/1748103887/1524852266.png' }, // Assuming 'lists' maps to this
  { id: 'Functions & Scope', name: 'Functions & Scope', image: 'https://ext.same-assets.com/1748103887/159953230.png' }, // Assuming 'functions' maps to this
  { id: 'Classes & Objects', name: 'Classes & Objects', image: 'https://ext.same-assets.com/1748103887/2484803668.png' },
  { id: 'Modules & Packages', name: 'Modules & Packages', image: 'https://ext.same-assets.com/1748103887/159953230.png' }, // Assuming 'modules' maps to this
];


const CourseSidebar: React.FC<CourseSidebarProps> = ({
  level, // Keep level as a prop for now
  cheatSheets,
}) => {
  const { user, isLoading } = useAuth();

  const displayName = user?.name || user?.email || 'Learner';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const userXP = user?.user_xp?.total_xp || 0;
  
  const completedExercisesCount = React.useMemo(() => {
    return user?.progress?.filter(p => p.status === 'COMPLETED' && p.exercise_id !== null).length || 0;
  }, [user?.progress]);

  const earnedBadges = React.useMemo(() => {
    if (!user?.user_badges) return [];
    const earnedBadgeNames = user.user_badges.map(ub => ub.badge.name);
    return courseBadgesData.map(badge => ({
      ...badge,
      isEarned: earnedBadgeNames.includes(badge.name),
    }));
  }, [user?.user_badges]);

  const earnedBadgesCount = earnedBadges.filter(b => b.isEarned).length;

  // For projects, we'll use a static 0/TOTAL_COURSE_PROJECTS as per instructions
  // until backend provides this data via user progress.
  const completedProjectsCount = 0; 

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* User Profile Skeleton */}
        <Card className="bg-codedex-navy border-codedex-gold/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2 bg-gray-700" />
              <Skeleton className="h-5 w-2/3 mb-1 bg-gray-700" />
              <Skeleton className="h-4 w-1/3 mb-4 bg-gray-700" />
              <Skeleton className="h-10 w-full bg-gray-700" />
            </div>
          </CardContent>
        </Card>
        {/* Course Progress Skeleton */}
        <Card className="bg-codedex-navy border-codedex-gold/10">
          <CardContent className="p-6">
            <Skeleton className="h-5 w-1/3 mb-4 bg-gray-700" /> {/* Title */}
            {[...Array(3)].map((_, i) => ( // 3 sections: Exercises, Projects, XP
              <React.Fragment key={i}>
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-4 w-1/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/6 bg-gray-700" />
                </div>
                <Skeleton className="w-full h-2 mb-4 bg-gray-700 rounded-full" />
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
        {/* Course Badges Skeleton */}
        <Card className="bg-codedex-navy border-codedex-gold/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-1/3 bg-gray-700" /> {/* Title */}
              <Skeleton className="h-4 w-1/6 bg-gray-700" /> {/* Count */}
            </div>
            <Skeleton className="h-4 w-full mb-4 bg-gray-700" /> {/* Description */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(TOTAL_COURSE_BADGES)].map((_, i) => (
                <Skeleton key={i} className="w-12 h-12 rounded-full bg-gray-700" />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Cheat Sheets (static, so no skeleton needed if not dependent on user) */}
        {/* Need Help (static, so no skeleton) */}
      </div>
    );
  }
  
  // If not loading and user is null (e.g. not logged in, though this component might be on protected routes)
  // You could show a "Please log in" message or a more restricted view.
  // For now, assuming `user` will be present if `isLoading` is false on a page using this sidebar.

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card className="bg-codedex-navy border-codedex-gold/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-codedex-gold rounded-full flex items-center justify-center mb-2">
              <span className="text-codedex-darkNavy font-bold text-xl">
                {displayInitial}
              </span>
            </div>
            <h3 className="text-white text-lg font-medium mb-1">{displayName}</h3>
            <div className="text-sm text-gray-400 mb-4">Level {level}</div>
            <Button
              variant="outline"
              className="w-full border-codedex-gold/30 text-codedex-gold"
              asChild
            >
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress */}
      <Card className="bg-codedex-navy border-codedex-gold/10">
        <CardContent className="p-6">
          <h3 className="text-white font-medium mb-4">Course Progress</h3>

          {/* Exercises */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-300 text-sm">Exercises</div>
            <div className="text-gray-300 text-sm">{completedExercisesCount} / {TOTAL_COURSE_EXERCISES}</div>
          </div>
          <div className="w-full bg-codedex-darkNavy rounded-full h-2 mb-4">
            <div
              className="bg-codedex-teal h-2 rounded-full"
              style={{ width: `${TOTAL_COURSE_EXERCISES > 0 ? (completedExercisesCount / TOTAL_COURSE_EXERCISES) * 100 : 0}%` }}
            />
          </div>

          {/* Projects Completed */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-300 text-sm">Projects Completed</div>
            <div className="text-gray-300 text-sm">{completedProjectsCount} / {TOTAL_COURSE_PROJECTS}</div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {/* Static project icons for now */}
            <div className={`w-6 h-6 bg-codedex-darkNavy rounded-full flex items-center justify-center ${completedProjectsCount < 1 ? 'opacity-50' : ''}`}>
              <Image
                src="https://ext.same-assets.com/1748103887/3771528755.svg"
                alt="Checkpoint Project"
                width={16}
                height={16}
              />
            </div>
            <div className={`w-6 h-6 bg-codedex-darkNavy rounded-full flex items-center justify-center ${completedProjectsCount < 2 ? 'opacity-50' : ''}`}>
              <Image
                src="https://ext.same-assets.com/1748103887/3281843955.svg"
                alt="Final Project"
                width={16}
                height={16}
              />
            </div>
          </div>

          {/* XP Earned */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-300 text-sm">XP Earned</div>
            <div className="text-gray-300 text-sm">{userXP} / {TOTAL_COURSE_XP}</div>
          </div>
          <div className="w-full bg-codedex-darkNavy rounded-full h-2 mb-4">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${TOTAL_COURSE_XP > 0 ? (userXP / TOTAL_COURSE_XP) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Course Badges */}
      <Card className="bg-codedex-navy border-codedex-gold/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Course Badges</h3>
            <div className="text-gray-400 text-sm">{earnedBadgesCount} / {TOTAL_COURSE_BADGES}</div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Complete a chapter to earn a badge - collect 'em all!
          </p>
          <div className="grid grid-cols-4 gap-2">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id} // Use badge.id (which is badge.name from DB)
                className={`w-12 h-12 rounded-full overflow-hidden ${badge.isEarned ? '' : 'opacity-30 grayscale'}`}
              >
                <Image
                  src={badge.image}
                  alt={badge.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cheat Sheets */}
      <Card className="bg-codedex-navy border-codedex-gold/10">
        <CardContent className="p-6">
          <h3 className="text-white font-medium mb-4">Cheat Sheets</h3>
          <div className="space-y-3">
            {cheatSheets.map((sheet) => (
              <div key={sheet.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 rounded-sm border border-gray-500" />
                </div>
                <div className="flex-grow text-sm">
                  {sheet.isUnlocked ? (
                    <div className="text-codedex-gold">{sheet.title}</div>
                  ) : (
                    <div className="text-gray-400">
                      Unlock after Ch. {sheet.unlocksAfter}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card className="bg-codedex-navy border-codedex-gold/10">
        <CardContent className="p-6">
          <h3 className="text-white font-medium mb-2">Need Python Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Ask questions in our community!
          </p>
          <Button
            variant="outline"
            className="w-full border-codedex-gold/30 text-codedex-gold"
            asChild
          >
            <Link href="/community/python">Go to Community</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSidebar;
