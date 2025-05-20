import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const CoursesPage = () => {
  return (
    <div className="codedex-container py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-pixel text-codedex-gold mb-4">
          Explore the world of
        </h1>
        <h2 className="text-5xl font-pixel text-codedex-gold mb-6">Codédex</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Start your coding journey with 200+ hours of interactive programming
          exercises paired with real-world projects. Explore for free!
        </p>
      </div>

      {/* The Legend of Python */}
      <div className="mb-16">
        <h3 className="text-2xl font-pixel text-white mb-8 border-l-4 border-codedex-teal pl-4">
          The Legend of Python
        </h3>
        <p className="text-gray-300 mb-8">
          Get started with Python, a beginner-friendly programming language great
          for learning the basics of code and analyzing data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="Python"
            description="Learn programming fundamentals such as variables, control flow, and loops with the world's most popular and versatile coding language — Python!"
            imageSrc="https://ext.same-assets.com/1748103887/4042239105.gif"
            difficulty="BEGINNER"
            href="/python"
          />
          <CourseCard
            title="Intermediate Python"
            description="Begin learning intermediate Python with data structures."
            imageSrc="https://ext.same-assets.com/592824475/3305476845.gif"
            difficulty="INTERMEDIATE"
            href="/intermediate-python"
          />
          <CourseCard
            title="NumPy"
            description="Learn the fundamentals of data manipulation using NumPy! Learn to code using NumPy with Codedex -- for free!"
            imageSrc="https://ext.same-assets.com/592824475/3419107867.gif"
            difficulty="INTERMEDIATE"
            href="/numpy"
          />
        </div>
      </div>

      {/* The Origins Trilogy */}
      <div className="mb-16">
        <h3 className="text-2xl font-pixel text-white mb-8 border-l-4 border-codedex-blue pl-4">
          The Origins Trilogy
        </h3>
        <p className="text-gray-300 mb-8">
          Want to create your own website? Learn the three core technologies that make up the web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="HTML"
            description="Create your first website with HTML, the building blocks of the web and dive into the world of web development."
            imageSrc="https://ext.same-assets.com/1748103887/4277115658.gif"
            difficulty="BEGINNER"
            href="/html"
          />
          <CourseCard
            title="CSS"
            description="Learn to use CSS selectors and properties to stylize your HTML pages with colors, fonts, sizing, layouts, and more!"
            imageSrc="https://ext.same-assets.com/1748103887/501262131.webp"
            difficulty="BEGINNER"
            href="/css"
          />
          <CourseCard
            title="JavaScript"
            description="Learn variables, loops, functions, and events to start building interactive web apps with the programming language of the web — JavaScript!"
            imageSrc="https://ext.same-assets.com/1748103887/3573002446.webp"
            difficulty="BEGINNER"
            href="/javascript"
          />
        </div>
      </div>

      {/* All Courses */}
      <div>
        <h3 className="text-2xl font-pixel text-white mb-8 border-l-4 border-codedex-purple pl-4">
          All Courses
        </h3>

        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-transparent text-codedex-gold border border-codedex-gold/30 px-4 py-2 rounded-md hover:bg-codedex-gold/10">
            Python
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Web Development
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Data Science
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Tools
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Creative Coding
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Beginner
          </button>
          <button className="bg-transparent text-gray-400 px-4 py-2 rounded-md hover:bg-gray-700/30 hover:text-white">
            Intermediate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="Data Structures & Algorithms"
            description="Learn fundamental concepts for organizing, storing, and processing data in Python to ace technical interviews, LeetCode problems, or a college DSA class!"
            imageSrc="https://ext.same-assets.com/592824475/3042034358.png"
            difficulty="INTERMEDIATE"
            href="/data-structures-and-algorithms"
            isNew
          />
          <CourseCard
            title="Node.js"
            description="Combine JavaScript with the power of Node.js—unleash your full-stack potential with server-side programming & dynamic web applications!"
            imageSrc="https://ext.same-assets.com/592824475/402310742.png"
            difficulty="INTERMEDIATE"
            href="/nodejs"
            isNew
          />
          <CourseCard
            title="Java"
            description="Master Java by exploring object-oriented programming and essential data structures, building skills to create efficient and scalable applications!"
            imageSrc="https://ext.same-assets.com/592824475/3042034358.png"
            difficulty="BEGINNER"
            href="/java"
            isNew
          />
        </div>
      </div>
    </div>
  );
};

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  difficulty: string;
  href: string;
  isNew?: boolean;
}

const CourseCard = ({
  title,
  description,
  imageSrc,
  difficulty,
  href,
  isNew = false,
}: CourseCardProps) => {
  return (
    <Card className="bg-codedex-navy border border-codedex-gold/20 overflow-hidden transition-transform hover:-translate-y-1 duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
        {isNew && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-pixel px-2 py-1 rounded">
            NEW!
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="text-xs text-gray-400 uppercase mb-1">COURSE</div>
        <h4 className="text-codedex-gold font-pixel text-xl mb-2">{title}</h4>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between">
          <div
            className={`text-white text-xs px-2 py-1 rounded-sm font-pixel ${
              difficulty === "BEGINNER"
                ? "bg-codedex-teal"
                : difficulty === "INTERMEDIATE"
                ? "bg-codedex-blue"
                : "bg-codedex-purple"
            }`}
          >
            {difficulty}
          </div>
          <Link
            href={href}
            className="text-codedex-gold border border-codedex-gold/30 px-3 py-1 text-sm rounded-sm hover:bg-codedex-gold/10"
          >
            EXPLORE
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursesPage;
