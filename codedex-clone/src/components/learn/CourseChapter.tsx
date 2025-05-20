"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Lock, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Exercise {
  number?: number;
  title: string;
  slug?: string;
  isCompleted?: boolean;
  isBonus?: boolean;
  isChallenge?: boolean;
  isLocked?: boolean;
  isClubOnly?: boolean;
}

// Actualizar la interfaz para incluir el id de requisito
interface Requirement {
  id: string;
  text: string;
}

interface CourseChapterProps {
  number: number;
  title: string;
  description: string;
  exercises: Exercise[];
  isOpen?: boolean;
  isClubOnly?: boolean;
  isFinalProject?: boolean;
  isCertificate?: boolean;
  requirements?: Requirement[]; // Cambiar a array de Requirement
}

const CourseChapter: React.FC<CourseChapterProps> = ({
  number,
  title,
  description,
  exercises,
  isOpen = false,
  isClubOnly = false,
  isFinalProject = false,
  isCertificate = false,
  requirements = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-codedex-navy border border-codedex-gold/10 rounded-lg overflow-hidden ${isClubOnly ? "relative" : ""}`}
    >
      {isClubOnly && (
        <div className="absolute top-0 right-0 bg-codedex-gold text-codedex-darkNavy px-3 py-1 text-xs font-medium rounded-bl-lg">
          Club
        </div>
      )}

      <div className="p-6 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="bg-codedex-darkNavy w-8 h-8 rounded-full flex items-center justify-center text-codedex-gold font-pixel">
              {number}
            </div>
            <h3 className="text-xl font-pixel text-codedex-gold">{title}</h3>
          </div>
          <button className="text-codedex-gold">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        <p className="text-gray-300 text-sm ml-12">{description}</p>
      </div>

      {isExpanded && (
        <div className="border-t border-codedex-gold/10 p-4">
          <ul className="space-y-1">
            {exercises.map((exercise, index) => (
              <li
                key={exercise.slug || `exercise-${index}`}
                className="pl-12 py-2"
              >
                {exercise.isBonus || exercise.isChallenge ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-codedex-gold text-xs font-pixel">
                        {exercise.isBonus ? "Bonus Article" : "Challenge Pack"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {exercise.isLocked ? (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Lock size={12} />
                          <span>Complete chapter to unlock</span>
                        </div>
                      ) : (
                        <div className="bg-codedex-purple text-white px-3 py-1 rounded-sm text-xs">
                          View
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-400 w-6">
                        {exercise.number?.toString().padStart(2, "0") || ""}
                      </div>
                      <div className="text-white group-hover:text-codedex-gold transition-colors">
                        {exercise.title}
                      </div>
                    </div>
                    {exercise.isCompleted ? (
                      <div className="text-green-500">
                        <CheckCircle size={16} />
                      </div>
                    ) : (
                      <Link
                        href={exercise.slug ? `/python/${exercise.slug}` : "#"}
                        className="bg-codedex-darkNavy text-codedex-gold hover:bg-codedex-darkNavy/70 px-3 py-1 rounded-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Start
                      </Link>
                    )}
                  </div>
                )}
              </li>
            ))}

            {isCertificate && requirements.length > 0 && (
              <div className="pl-12 pt-4 border-t border-codedex-gold/10 mt-4">
                <h4 className="text-white font-medium mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {requirements.map((req) => (
                    <li
                      key={req.id}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <div className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                      </div>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isFinalProject && (
              <div className="pl-12 pt-4 mt-4 text-center">
                <div className="text-gray-400 text-sm">
                  Complete all exercises to unlock the Final Project
                </div>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseChapter;
