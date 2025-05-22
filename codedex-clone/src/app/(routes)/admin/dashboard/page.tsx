"use client";

import React, { useState, useEffect } from 'react'; // 1. Import Hooks
import withAdminAuth from '@/components/auth/withAdminAuth';
import type { AdminPageProps } from '@/types/admin'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For stats display

// Define the expected structure for stats
interface PlatformStats {
  totalUsers: number;
  totalCompletedExercises: number;
  totalSystemXP: number;
}

const AdminDashboardPage: React.FC<AdminPageProps> = ({ user }) => {
  // 2. State Variables
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true); // Start with loading true
  const [statsError, setStatsError] = useState<string>('');

  // 3. useEffect for Data Fetching
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      setStatsError('');
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: PlatformStats = await response.json();
        setStats(data);
      } catch (error: any) {
        console.error("Failed to fetch platform stats:", error);
        setStatsError(error.message || 'Failed to load statistics.');
        setStats(null); // Clear any old stats
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);


  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <h1 className="text-3xl font-pixel text-codedex-gold mb-8">Admin Dashboard</h1>
        <p className="text-lg mb-4">Welcome, Admin {user.name || user.email}!</p>

        {/* Platform Statistics Section */}
        <Card className="bg-codedex-navy border-codedex-gold/20 mb-8">
          <CardHeader>
            <CardTitle className="text-codedex-teal">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats && <p className="text-gray-300">Loading statistics...</p>}
            {statsError && <p className="text-red-500">{statsError}</p>}
            {stats && !isLoadingStats && !statsError && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-codedex-darkNavy p-4 rounded-md">
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="bg-codedex-darkNavy p-4 rounded-md">
                  <p className="text-gray-400 text-sm">Completed Exercises</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCompletedExercises}</p>
                </div>
                <div className="bg-codedex-darkNavy p-4 rounded-md">
                  <p className="text-gray-400 text-sm">Total XP on Platform</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSystemXP}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Navigation Links */}
        <h2 className="text-2xl font-semibold text-codedex-teal mb-4">Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-codedex-teal mb-3">User Management</h2>
            <p className="text-gray-400 mb-4">View, edit, and manage user accounts.</p>
            <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>

          <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-codedex-teal mb-3">Course Management</h2>
            <p className="text-gray-400 mb-4">Create, edit, and manage courses and their content.</p>
            <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
              <Link href="/admin/courses">Manage Courses</Link>
            </Button>
          </div>

          <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-codedex-teal mb-3">Static Pages</h2>
            <p className="text-gray-400 mb-4">Edit content for pages like About, Terms, Privacy.</p>
            <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
              <Link href="/admin/pages">Manage Pages</Link>
            </Button>
          </div>

          <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-codedex-teal mb-3">Site Settings</h2>
            <p className="text-gray-400 mb-4">Configure global settings for the platform.</p>
            <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
              <Link href="/admin/settings">Site Settings</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboardPage);
