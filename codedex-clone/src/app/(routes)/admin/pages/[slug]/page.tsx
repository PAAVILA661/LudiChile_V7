"use client";

import React, { useEffect, useState, useCallback } from 'react';
import withAdminAuth from '@/components/auth/withAdminAuth';
import type { AdminPageProps } from '@/types/admin';
import type { StaticPageFormData } from '@/types/staticPageAdmin';
import type { StaticPage as PrismaStaticPage } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

const AdminEditStaticPage: React.FC<AdminPageProps> = ({ user: adminUser }) => {
  const router = useRouter();
  const params = useParams();
  const pageSlug = params.slug as string;

  const [pageData, setPageData] = useState<PrismaStaticPage | null>(null);
  const [formData, setFormData] = useState<StaticPageFormData>({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const PREDEFINED_TITLES: { [key: string]: string } = {
    about: "About Us",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    faq: "Frequently Asked Questions",
  };

  const fetchPageData = useCallback(async () => {
    if (!pageSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/static-pages/${pageSlug}`);
      if (response.status === 404) {
        // Página no encontrada, inicializar para creación
        setPageData(null); // Indicar que no existe en BD
        setFormData({ title: PREDEFINED_TITLES[pageSlug] || 'New Page', content: '' });
      } else if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch page data');
      } else {
        const data: PrismaStaticPage = await response.json();
        setPageData(data);
        setFormData({ title: data.title, content: data.content });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [pageSlug, PREDEFINED_TITLES]);

  useEffect(() => {
    fetchPageData();
  }, [pageSlug, fetchPageData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMessage(null); // Limpiar mensaje de éxito al editar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/static-pages/${pageSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save page content');
      }
      setPageData(data); // Actualizar pageData con la respuesta (puede tener updated_at nuevo)
      setFormData({ title: data.title, content: data.content });
      setSuccessMessage('Page content saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-white text-xl">Loading page editor...</div>;
  // No mostramos error principal si la página no existe aún, solo el form vacío.
  // if (error && !pageData && formData.title === '') return <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-red-500 text-xl">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 mb-2" onClick={() => router.push('/admin/pages')}>
                <ArrowLeft size={16} className="mr-2" /> Back to Pages List
            </Button>
            <h1 className="text-3xl font-pixel text-codedex-gold">Edit Page: {formData.title || pageSlug}</h1>
          </div>
        </div>

        {error && <p className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-md text-sm">Error: {error}</p>}
        {successMessage && <p className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-md text-sm">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="bg-codedex-navy p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Page Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-codedex-darkNavy border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Page Content (Markdown supported)</label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={20}
              className="bg-codedex-darkNavy border-gray-700 font-mono text-sm"
              placeholder="Enter page content here. Markdown will be rendered on the public page."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-codedex-teal hover:bg-codedex-teal/80">
              <Save size={16} className="mr-2" /> {isSaving ? 'Saving...' : 'Save Content'}
            </Button>
          </div>
        </form>

        {pageData?.updated_at && (
            <p className="text-xs text-gray-500 mt-4">Last saved: {new Date(pageData.updated_at).toLocaleString()}</p>
        )}

      </div>
    </div>
  );
};

export default withAdminAuth(AdminEditStaticPage);
