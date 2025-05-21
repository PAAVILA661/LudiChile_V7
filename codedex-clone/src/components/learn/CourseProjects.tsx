import type React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  id: string; // ID único para cada proyecto
  title: string;
  image: string;
}

interface CourseProjectsProps {
  title: string;
  description: string;
  projects: Project[];
}

const CourseProjects: React.FC<CourseProjectsProps> = ({
  title,
  description,
  projects,
}) => {
  return (
    <Card className="bg-codedex-navy border-codedex-gold/10">
      <CardContent className="p-6">
        <h3 className="text-white font-medium mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{description}</p>

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-codedex-darkNavy border border-codedex-gold/10 rounded-md p-3 flex items-center gap-3 hover:bg-codedex-darkNavy/70 transition-colors cursor-pointer"
            >
              {project.image && (
                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h4 className="text-codedex-gold text-sm">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProjects;
