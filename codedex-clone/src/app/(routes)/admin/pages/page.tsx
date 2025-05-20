"use client";

import React, { useEffect, useState, useCallback } from 'react';
import withAdminAuth from '@/components/auth/withAdminAuth';
import type { AdminPageProps } from '@/types/admin';
import type { StaticPageAdminInfo } from '@/types/staticPageAdmin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

const PREDEFINED_PAGES: Array<{ slug: string; title: string; description: string }> = [
  { slug: "about", title: "About Us", description: "Content about your platform." },
  { slug: "terms", title: "Terms of Service", description: "Your platform's terms and conditions." },
  { slug: "privacy", title: "Privacy Policy", description: "Your platform's privacy policy." },
  { slug: "faq", title: "FAQ", description: "Frequently Asked Questions and answers." },
];

const AdminStaticPagesOverviewPage: React.FC<AdminPageProps> = ({ user: adminUser }) => {
  const [pagesInfo, setPagesInfo] = useState<StaticPageAdminInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPagesInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/static-pages');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pages info');
      }
      const data = await response.json();
      setPagesInfo(data);
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPagesInfo();
  }, [fetchPagesInfo]);

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-pixel text-codedex-gold">Manage Static Pages</h1>
          <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-center text-lg">Loading page information...</p>}
        {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PREDEFINED_PAGES.map(p => {
              const dbInfo = pagesInfo.find(dbP => dbP.slug === p.slug);
              return (
                <div key={p.slug} className="bg-codedex-navy p-6 rounded-lg shadow-lg flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-codedex-teal mb-2">{dbInfo?.title || p.title}</h2>
                    <p className="text-gray-400 text-sm mb-1">Slug: <code className="bg-codedex-darkNavy/50 px-1 py-0.5 rounded text-xs">{p.slug}</code></p>
                    <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                  </div>
                  <div className="mt-auto">
                    <Button className="w-full bg-codedex-gold/80 hover:bg-codedex-gold text-codedex-darkNavy" asChild>
                      <Link href={`/admin/pages/${p.slug}`}>
                        <Edit size={16} className="mr-2" /> Edit Page Content
                      </Link>
                    </Button>
                    {dbInfo?.updated_at && <p className="text-xs text-gray-500 mt-2 text-right">Last updated: {new Date(dbInfo.updated_at).toLocaleDateString()}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAdminAuth(AdminStaticPagesOverviewPage);
