"use client";

import React from 'react';
import withAdminAuth from '@/components/auth/withAdminAuth';
import type { AdminPageProps } from '@/types/admin'; // Usamos el tipo que definimos
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminDashboardPage: React.FC<AdminPageProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <h1 className="text-3xl font-pixel text-codedex-gold mb-8">Admin Dashboard</h1>
        <p className="text-lg mb-4">Welcome, Admin {user.name || user.email}!</p>

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
