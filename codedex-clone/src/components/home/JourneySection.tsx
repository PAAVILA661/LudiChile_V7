import React from 'react';
import CourseCard from './CourseCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const JourneySection = () => {
  const pythonCourses = [
    {
      title: 'Python',
      description: 'Aprende fundamentos de programación como variables, control de flujo y bucles con el lenguaje de programación más popular y versátil del mundo: ¡Python!',
      imageSrc: 'https://ext.same-assets.com/1748103887/4042239105.gif',
      difficulty: 'BEGINNER',
      href: '/python',
    },
    {
      title: 'Python Intermedio',
      description: 'Comienza a aprender Python intermedio con estructuras de datos.',
      imageSrc: 'https://ext.same-assets.com/592824475/3305476845.gif',
      difficulty: 'INTERMEDIATE',
      href: '/intermediate-python',
    },
    {
      title: 'NumPy',
      description: '¡Aprende los fundamentos de manipulación de datos usando NumPy! Aprende a programar usando NumPy con Codedex, ¡gratis!',
      imageSrc: 'https://ext.same-assets.com/592824475/3419107867.gif',
      difficulty: 'INTERMEDIATE',
      href: '/numpy',
    },
  ];

  const webCourses = [
    {
      title: 'HTML',
      description: 'Crea tu primer sitio web con HTML, los bloques de construcción de la web, y sumérgete en el mundo del desarrollo web.',
      imageSrc: 'https://ext.same-assets.com/1748103887/4277115658.gif',
      difficulty: 'BEGINNER',
      href: '/html',
    },
    {
      title: 'CSS',
      description: '¡Aprende a usar selectores y propiedades CSS para estilizar tus páginas HTML con colores, fuentes, tamaños, diseños y más!',
      imageSrc: 'https://ext.same-assets.com/1748103887/501262131.webp',
      difficulty: 'BEGINNER',
      href: '/css',
    },
    {
      title: 'JavaScript',
      description: '¡Aprende variables, bucles, funciones y eventos para comenzar a construir aplicaciones web interactivas con el lenguaje de programación de la web — JavaScript!',
      imageSrc: 'https://ext.same-assets.com/1748103887/3573002446.webp',
      difficulty: 'BEGINNER',
      href: '/javascript',
    },
  ];

  return (
    <section className="py-16 bg-codedex-darkNavy">
      <div className="codedex-container">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-pixel text-codedex-gold">Recorrido</h2>
          <div className="h-px bg-codedex-gold/20 flex-grow" />
        </div>

        <p className="text-lg text-gray-300 mb-10">
          Aprende a programar con cursos divertidos e interactivos creados por expertos de la industria y educadores.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="border-codedex-gold/30 text-codedex-gold bg-transparent hover:bg-codedex-gold/10 hover:text-white">
            Popular
          </Button>
          <Button className="text-gray-400 hover:text-white hover:bg-codedex-gold/10">
            Desarrollo Web
          </Button>
          <Button className="text-gray-400 hover:text-white hover:bg-codedex-gold/10">
            Ciencia de Datos
          </Button>
          <Button className="text-gray-400 hover:text-white hover:bg-codedex-gold/10">
            Herramientas
          </Button>
        </div>

        {/* Python Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pythonCourses.map((course, index) => (
            <CourseCard
              key={course.title}
              title={course.title}
              description={course.description}
              imageSrc={course.imageSrc}
              difficulty={course.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'}
              href={course.href}
              index={index + 1}
            />
          ))}
        </div>

        {/* Web Development Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {webCourses.map((course, index) => (
            <CourseCard
              key={course.title}
              title={course.title}
              description={course.description}
              imageSrc={course.imageSrc}
              difficulty={course.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'}
              href={course.href}
              index={index + 1}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            className="border-codedex-teal text-codedex-teal bg-transparent hover:bg-codedex-teal/10"
            asChild
          >
            <Link href="/courses">VER TODOS LOS CURSOS</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
