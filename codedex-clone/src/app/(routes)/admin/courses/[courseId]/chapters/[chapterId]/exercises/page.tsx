"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import withAdminAuth from "@/components/auth/withAdminAuth";
import type { AdminPageProps } from "@/types/admin";
import type {
  ExerciseForAdminList,
  ExerciseFormData,
} from "@/types/exerciseAdmin";
import type { Course, Chapter } from "@prisma/client";
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
import { ArrowLeft, PlusCircle, Edit, Trash2, ListOrdered } from "lucide-react";

const AdminChapterExercisesPage: React.FC<AdminPageProps> = ({
  user: adminUser,
}) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [exercises, setExercises] = useState<ExerciseForAdminList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentExercise, setCurrentExercise] =
    useState<ExerciseFormData | null>(null);
  const [formData, setFormData] = useState<Partial<ExerciseFormData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchParentDetails = useCallback(async () => {
    if (!courseId || !chapterId) return;
    setIsLoading(true);
    try {
      const courseRes = await fetch(`/api/admin/courses/${courseId}`);
      if (!courseRes.ok) throw new Error("Failed to fetch course details");
      setCourse(await courseRes.json());

      const chapterRes = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}`,
      );
      if (!chapterRes.ok) throw new Error("Failed to fetch chapter details");
      setChapter(await chapterRes.json());
    } catch (err: unknown) {
      setError((err as Error).message);
    }
    // setIsLoading(false) se maneja en fetchExercises
  }, [courseId, chapterId]);

  const fetchExercises = useCallback(async () => {
    if (!courseId || !chapterId) return;
    setIsLoading(true); // Asegurar que isLoading se maneje aquí también
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/exercises`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch exercises");
      }
      const data = await response.json();
      setExercises(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
    setIsLoading(false);
  }, [courseId, chapterId]);

  useEffect(() => {
    fetchParentDetails();
    fetchExercises();
  }, [fetchParentDetails, fetchExercises]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const val =
      name === "order" || name === "xp_value"
        ? Number.parseInt(value, 10) || 0
        : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentExercise(null);
    setFormData({
      title: "",
      slug: "",
      order: exercises.length + 1,
      xp_value: 10,
      description: "",
      instructions: "",
      initial_code: "",
      expected_output: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (exercise: ExerciseForAdminList) => {
    setModalMode("edit");
    setFormError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/exercises/${exercise.id}`,
      );
      if (!res.ok)
        throw new Error("Failed to fetch exercise details for editing");
      const fullExerciseData: ExerciseFormData = await res.json();
      setCurrentExercise(fullExerciseData);
      setFormData(fullExerciseData);
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
        ? `/api/admin/courses/${courseId}/chapters/${chapterId}/exercises`
        : `/api/admin/courses/${courseId}/chapters/${chapterId}/exercises/${currentExercise?.id}`;
    const method = modalMode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalMode} exercise`);
      }
      await fetchExercises();
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!window.confirm("Are you sure you want to delete this exercise?"))
      return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/exercises/${exerciseId}`,
        { method: "DELETE" },
      );
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete exercise");
      }
      await fetchExercises();
    } catch (err: unknown) {
      setFormError((err as Error).message);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && (!course || !chapter))
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-white text-xl">
        Loading content...
      </div>
    );
  if (error && (!course || !chapter))
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center text-red-500 text-xl">
        Error loading details: {error}
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
              onClick={() => router.push(`/admin/courses/${courseId}/chapters`)}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Chapters (
              {course?.title})
            </Button>
            <h1 className="text-3xl font-pixel text-codedex-gold">
              Manage Exercises
            </h1>
            {chapter && (
              <p className="text-codedex-teal">Chapter: {chapter.title}</p>
            )}
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-codedex-teal hover:bg-codedex-teal/80"
          >
            <PlusCircle size={18} className="mr-2" /> Create New Exercise
          </Button>
        </div>

        {isLoading && exercises.length === 0 && (
          <p className="text-center text-lg">Loading exercises...</p>
        )}
        {error && exercises.length === 0 && (
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
                  <th className="px-4 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    XP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-codedex-gold/10">
                {exercises.map((exercise) => (
                  <tr
                    key={exercise.id}
                    className="hover:bg-codedex-darkNavy/30 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 w-16 text-center">
                      {exercise.order}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {exercise.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {exercise.slug}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {exercise.xp_value}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                      <Button
                        variant="link"
                        className="text-codedex-gold hover:text-codedex-gold/80 p-0 h-auto"
                        onClick={() => openEditModal(exercise)}
                        title="Edit Exercise"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="link"
                        className="text-red-500 hover:text-red-500/80 p-0 h-auto"
                        onClick={() => handleDeleteExercise(exercise.id)}
                        title="Delete Exercise"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {exercises.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No exercises found for this chapter.
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
          <DialogContent className="bg-codedex-navy border-codedex-gold/20 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-codedex-gold font-pixel">
                {modalMode === "create"
                  ? "Create New Exercise"
                  : "Edit Exercise"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {modalMode === "create"
                  ? `For chapter: ${chapter?.title}`
                  : `Editing: ${currentExercise?.title}`}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 py-3 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-codedex-darkNavy border-gray-700 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-codedex-darkNavy border-gray-700 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="order"
                    className="block text-xs font-medium text-gray-300 mb-1"
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
                    className="bg-codedex-darkNavy border-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="xp_value"
                    className="block text-xs font-medium text-gray-300 mb-1"
                  >
                    XP Value
                  </label>
                  <Input
                    id="xp_value"
                    name="xp_value"
                    type="number"
                    value={
                      formData.xp_value === undefined ? "" : formData.xp_value
                    }
                    onChange={handleInputChange}
                    required
                    className="bg-codedex-darkNavy border-gray-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-codedex-darkNavy border-gray-700 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="instructions"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Instructions (Optional)
                </label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-codedex-darkNavy border-gray-700 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="initial_code"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Initial Code (Optional)
                </label>
                <Textarea
                  id="initial_code"
                  name="initial_code"
                  value={formData.initial_code || ""}
                  onChange={handleInputChange}
                  rows={5}
                  className="bg-codedex-darkNavy border-gray-700 font-mono text-xs"
                />
              </div>
              <div>
                <label
                  htmlFor="expected_output"
                  className="block text-xs font-medium text-gray-300 mb-1"
                >
                  Expected Output (Optional)
                </label>
                <Textarea
                  id="expected_output"
                  name="expected_output"
                  value={formData.expected_output || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-codedex-darkNavy border-gray-700 font-mono text-xs"
                />
              </div>

              {formError && (
                <p className="text-red-400 text-xs">Error: {formError}</p>
              )}
              <DialogFooter className="mt-4 pt-4 border-t border-codedex-gold/10">
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
                      ? "Create Exercise"
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

export default withAdminAuth(AdminChapterExercisesPage);
