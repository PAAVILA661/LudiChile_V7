"use client";

import React, { useEffect, useState, useCallback } from 'react';
import withAdminAuth from '@/components/auth/withAdminAuth';
import type { AdminPageProps } from '@/types/admin';
import type { CourseForAdminList, CourseFormData } from '@/types/courseAdmin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowLeft, PlusCircle, Edit, Trash2, BookOpen } from 'lucide-react';

const AdminCoursesPage: React.FC<AdminPageProps> = ({ user: adminUser }) => {
  const [courses, setCourses] = useState<CourseForAdminList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentCourse, setCurrentCourse] = useState<CourseFormData | null>(null);
  const [formData, setFormData] = useState<Partial<CourseFormData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/courses');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentCourse(null);
    setFormData({ title: '', slug: '', description: '', image_url: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (course: CourseForAdminList) => {
    setModalMode('edit');
    setFormError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/courses/${course.id}`);
      if(!response.ok) throw new Error('Failed to fetch course details');
      const fullCourseData: CourseFormData = await response.json();
      setCurrentCourse(fullCourseData);
      setFormData(fullCourseData);
      setIsModalOpen(true);
    } catch (err:any) {
      setFormError(err.message || 'Could not load course data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url = modalMode === 'create' ? '/api/admin/courses' : `/api/admin/courses/${currentCourse?.id}`;
    const method = modalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalMode} course`);
      }
      await fetchCourses();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This may affect related chapters and exercises.')) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to delete course');
      }
      await fetchCourses();
    } catch (err:any) {
      setFormError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-pixel text-codedex-gold">Course Management</h1>
          <div className="flex items-center gap-4">
            <Button onClick={openCreateModal} className="bg-codedex-teal hover:bg-codedex-teal/80">
              <PlusCircle size={18} className="mr-2" /> Create New Course
            </Button>
            <Button variant="outline" className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {isLoading && <p className="text-center text-lg">Loading courses...</p>}
        {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}
        {formError && <p className="text-center text-red-500 text-lg mb-4">Form Error: {formError}</p>}

        {!isLoading && !error && (
          <div className="bg-codedex-navy shadow-xl rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-codedex-darkNavy/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-codedex-gold/10">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-codedex-darkNavy/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(course.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                      <Button variant="link" className="text-sky-400 hover:text-sky-400/80 p-0 h-auto" asChild>
                        <Link href={`/admin/courses/${course.id}/chapters`} title="Manage Chapters & Exercises">
                          <BookOpen size={14} className="mr-1" /> Chapters
                        </Link>
                      </Button>
                      <Button variant="link" className="text-codedex-gold hover:text-codedex-gold/80 p-0 h-auto" onClick={() => openEditModal(course)} title="Edit Course Details">
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="link" className="text-red-500 hover:text-red-500/80 p-0 h-auto" onClick={() => handleDeleteCourse(course.id)} title="Delete Course">
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-10 text-gray-500">No courses found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-codedex-navy border-codedex-gold/20 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-codedex-gold font-pixel">
                {modalMode === 'create' ? 'Create New Course' : 'Edit Course'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {modalMode === 'create' ? 'Fill in the details for the new course.' : `Editing: ${currentCourse?.title}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} required className="bg-codedex-darkNavy border-gray-700" />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                <Input id="slug" name="slug" value={formData.slug || ''} onChange={handleInputChange} required className="bg-codedex-darkNavy border-gray-700" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="bg-codedex-darkNavy border-gray-700" />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">Image URL (Optional)</label>
                <Input id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} className="bg-codedex-darkNavy border-gray-700" />
              </div>
              {formError && <p className="text-red-400 text-xs">Error: {formError}</p>}
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700/50">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting} className="bg-codedex-teal text-white hover:bg-codedex-teal/80">
                  {isSubmitting ? 'Saving...' : (modalMode === 'create' ? 'Create Course' : 'Save Changes')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default withAdminAuth(AdminCoursesPage);
