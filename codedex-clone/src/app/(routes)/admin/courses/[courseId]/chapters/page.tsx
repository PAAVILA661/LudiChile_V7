"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import withAdminAuth from "@/components/auth/withAdminAuth";
import type { AdminPageProps } from "@/types/admin";
import type {
  ChapterForAdminList,
  ChapterFormData,
} from "@/types/chapterAdmin";
import type { Course } from "@prisma/client"; // Para los detalles del curso
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  PlusCircle,
  Edit,
  Trash2,
  BookText,
  ListOrdered,
} from "lucide-react";

const AdminCourseChaptersPage: React.FC<AdminPageProps> = ({
  user: _adminUser,
}) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<ChapterForAdminList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentChapter, setCurrentChapter] = useState<ChapterFormData | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<ChapterFormData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course details");
      const data = await response.json();
      setCourse(data);
    } catch (err: unknown) {
      setError((err as Error).message); // Podría ser un error diferente para detalles del curso
    }
  }, [courseId]);

  const fetchChapters = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/chapters`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch chapters");
      }
      const data = await response.json();
      setChapters(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
    fetchChapters();
  }, [fetchCourseDetails, fetchChapters]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const val = name === "order" ? Number.parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentChapter(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      order: chapters.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (chapter: ChapterForAdminList) => {
    setModalMode("edit");
    setFormError(null);
    // Fetch full chapter details if list doesn't have all fields (e.g., description)
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapter.id}`,
      );
      if (!res.ok)
        throw new Error("Failed to fetch chapter details for editing");
      const fullChapterData: ChapterFormData = await res.json();
      setCurrentChapter(fullChapterData);
      setFormData(fullChapterData);
      setIsModalOpen(true);
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url =
      modalMode === "create"
        ? `/api/admin/courses/${courseId}/chapters`
        : `/api/admin/courses/${courseId}/chapters/${currentChapter?.id}`;
    const method = modalMode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalMode} chapter`);
      }
      await fetchChapters();
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this chapter? All exercises within it will also be affected (potentially deleted if cascade is on).",
      )
    )
      return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}`,
        { method: "DELETE" },
      );
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete chapter");
      }
      await fetchChapters();
    } catch (err: unknown) {
      setFormError((err as Error).message);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: Implement reorder logic if needed

  if (isLoading && !course)
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-white text-xl">
        Loading course content...
      </div>
    );
  if (error && !course)
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-red-500 text-xl">
        Error loading course: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200 mb-2"
              onClick={() => router.push("/admin/courses")}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Courses
            </Button>
            <h1 className="text-3xl font-pixel text-codedex-gold">
              Manage Chapters
            </h1>
            {course && (
              <p className="text-codedex-teal">Course: {course.title}</p>
            )}
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-codedex-teal hover:bg-codedex-teal/80"
          >
            <PlusCircle size={18} className="mr-2" /> Create New Chapter
          </Button>
        </div>

        {isLoading && chapters.length === 0 && (
          <p className="text-center text-lg">Loading chapters...</p>
        )}
        {error && chapters.length === 0 && (
          <p className="text-center text-red-500 text-lg">Error: {error}</p>
        )}
        {formError && (
          <p className="text-center text-red-500 text-lg mb-4">
            Form Error: {formError}
          </p>
        )}

        {!isLoading && !error && (
          <div className="bg-codedex-navy shadow-xl rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-codedex-darkNavy/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Slug
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">Exercises</th> */}
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-codedex-gold/10">
                {chapters.map((chapter) => (
                  <tr
                    key={chapter.id}
                    className="hover:bg-codedex-darkNavy/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-16 text-center">
                      {chapter.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {chapter.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {chapter.slug}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{chapter._count?.exercises || 0}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-400/80 p-0 h-auto"
                        asChild
                      >
                        <Link
                          href={`/admin/courses/${courseId}/chapters/${chapter.id}/exercises`}
                          title="Manage Exercises"
                        >
                          <ListOrdered size={14} className="mr-1" /> Exercises
                        </Link>
                      </Button>
                      <Button
                        variant="link"
                        className="text-codedex-gold hover:text-codedex-gold/80 p-0 h-auto"
                        onClick={() => openEditModal(chapter)}
                        title="Edit Chapter"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="link"
                        className="text-red-500 hover:text-red-500/80 p-0 h-auto"
                        onClick={() => handleDeleteChapter(chapter.id)}
                        title="Delete Chapter"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {chapters.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      No chapters found for this course.
                    </td>
                  </tr>
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
                {modalMode === "create" ? "Create New Chapter" : "Edit Chapter"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {modalMode === "create"
                  ? `For course: ${course?.title}`
                  : `Editing: ${currentChapter?.title}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-codedex-darkNavy border-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-codedex-darkNavy border-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Order
                </label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order === undefined ? "" : formData.order}
                  onChange={handleInputChange}
                  required
                  className="bg-codedex-darkNavy border-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-codedex-darkNavy border-gray-700"
                />
              </div>
              {formError && (
                <p className="text-red-400 text-xs">Error: {formError}</p>
              )}
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-700/50"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-codedex-teal text-white hover:bg-codedex-teal/80"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Create Chapter"
                      : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default withAdminAuth(AdminCourseChaptersPage);
