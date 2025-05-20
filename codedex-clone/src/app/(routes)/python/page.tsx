import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Components para el curso de Python
import CourseHeader from '@/components/learn/CourseHeader';
import CourseChapter from '@/components/learn/CourseChapter';
import CourseSidebar from '@/components/learn/CourseSidebar';
import CourseProjects from '@/components/learn/CourseProjects';

const PythonCoursePage = () => {
  return (
    <div className="bg-codedex-darkNavy min-h-screen pb-16">
      {/* Course Header */}
      <CourseHeader
        title="Python"
        description="Learn programming fundamentals such as variables, control flow, and loops with the world's most popular and versatile coding language — Python!"
        image="https://ext.same-assets.com/1748103887/4042239105.gif"
        level="BEGINNER"
      />

      <div className="codedex-container grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hello World Chapter */}
          <CourseChapter
            number={1}
            title="Hello World"
            description="Learn how to write your first line of Python by printing messages to the terminal."
            exercises={[
              { number: 1, title: 'Setting Up', slug: '01-setting-up', isCompleted: false },
              { number: 2, title: 'Hello World', slug: '02-hello-world', isCompleted: false },
              { number: 3, title: 'Pattern', slug: '03-pattern', isCompleted: false },
              { number: 4, title: 'Initials', slug: '04-initials', isCompleted: false },
              { number: 5, title: 'Snail Mail', slug: '05-snail-mail', isCompleted: false },
              { isBonus: true, title: 'Bonus Article', isLocked: true }
            ]}
            isOpen={true}
          />

          {/* Variables Chapter */}
          <CourseChapter
            number={2}
            title="Variables"
            description="Create variables and learn about data types, arithmetic operators, and user input."
            exercises={[
              { number: 6, title: 'Data Types', slug: '06-data-types', isCompleted: false },
              { number: 7, title: 'Temperature', slug: '07-temperature', isCompleted: false },
              { number: 8, title: 'BMI', slug: '08-bmi', isCompleted: false },
              { number: 9, title: 'Pythagorean', slug: '09-pythagorean', isCompleted: false },
              { number: 10, title: 'Currency', slug: '10-currency', isCompleted: false },
              { isBonus: true, title: 'Bonus Article', isLocked: true }
            ]}
          />

          {/* Control Flow Chapter */}
          <CourseChapter
            number={3}
            title="Control Flow"
            description="Explore how programs 'make decisions' with if/else statements, relational operators, and logical operators."
            exercises={[
              { number: 11, title: 'Coin Flip', slug: '11-coin-flip', isCompleted: false },
              { number: 12, title: 'Grades', slug: '12-grades', isCompleted: false },
              { number: 13, title: 'pH Levels', slug: '13-ph-levels', isCompleted: false },
              { number: 14, title: 'Magic 8 Ball', slug: '14-magic-8-ball', isCompleted: false },
              { number: 15, title: 'The Cyclone', slug: '15-the-cyclone', isCompleted: false },
              { number: 16, title: 'Sorting Hat', slug: '16-sorting-hat', isCompleted: false },
              { isBonus: true, title: 'Bonus Article', isLocked: true },
              { isChallenge: true, title: 'Challenge Pack', isLocked: true }
            ]}
          />

          {/* Loops Chapter */}
          <CourseChapter
            number={4}
            title="Loops"
            description="Repeat a block of code with while loops and for loops over, and over, and over again."
            exercises={[
              { number: 17, title: 'Enter PIN', slug: '17-enter-pin', isCompleted: false },
              { number: 18, title: 'Guess Number', slug: '18-guess-number', isCompleted: false },
              { number: 19, title: 'Detention', slug: '19-detention', isCompleted: false },
              { number: 20, title: '99 Bottles', slug: '20-99-bottles', isCompleted: false },
              { number: 21, title: 'Fizz Buzz', slug: '21-fizz-buzz', isCompleted: false },
              { isBonus: true, title: 'Bonus Article', isLocked: true },
              { isChallenge: true, title: 'Challenge Pack', isLocked: true }
            ]}
          />

          {/* Checkpoint Project - Club Only */}
          <CourseChapter
            number={5}
            title="Checkpoint Project"
            description="Practice your Python chops with a checkpoint project! Choose from one of three projects and when you're done, submit your code for review by one of our mentors."
            exercises={[]}
            isClubOnly={true}
          />

          {/* Lists - Club Only */}
          <CourseChapter
            number={6}
            title="Lists"
            description="Store different items in lists and learn to use built-in functions and methods."
            exercises={[
              { number: 22, title: 'Grocery', slug: '22-grocery', isCompleted: false, isClubOnly: true },
              { number: 23, title: 'To-Do', slug: '23-to-do', isCompleted: false, isClubOnly: true },
              { number: 24, title: 'Inventory', slug: '24-inventory', isCompleted: false, isClubOnly: true },
              { number: 25, title: 'Reading', slug: '25-reading', isCompleted: false, isClubOnly: true },
              { number: 26, title: 'Mixtape', slug: '26-mixtape', isCompleted: false, isClubOnly: true },
              { number: 27, title: 'Bucket List', slug: '27-bucket-list', isCompleted: false, isClubOnly: true },
              { isBonus: true, title: 'Bonus Article', isLocked: true, isClubOnly: true },
              { isChallenge: true, title: 'Challenge Pack', isLocked: true, isClubOnly: true }
            ]}
            isClubOnly={true}
          />

          {/* Functions - Club Only */}
          <CourseChapter
            number={7}
            title="Functions"
            description="Define and call a function — reusable block of code that performs a specific task."
            exercises={[
              { number: 28, title: 'D.R.Y.', slug: '28-dry', isCompleted: false, isClubOnly: true },
              { number: 29, title: 'Fortune Cookie', slug: '29-fortune-cookie', isCompleted: false, isClubOnly: true },
              { number: 30, title: 'Mars Orbiter', slug: '30-mars-orbiter', isCompleted: false, isClubOnly: true },
              { number: 31, title: 'Calculator', slug: '31-calculator', isCompleted: false, isClubOnly: true },
              { number: 32, title: 'Stonks', slug: '32-stonks', isCompleted: false, isClubOnly: true },
              { number: 33, title: 'Drive-Thru', slug: '33-drive-thru', isCompleted: false, isClubOnly: true },
              { isBonus: true, title: 'Bonus Article', isLocked: true, isClubOnly: true },
              { isChallenge: true, title: 'Challenge Pack', isLocked: true, isClubOnly: true }
            ]}
            isClubOnly={true}
          />

          {/* Classes & Objects - Club Only */}
          <CourseChapter
            number={8}
            title="Classes & Objects"
            description="Create your own data types and use them to model everyday objects with unique characteristics and behaviors."
            exercises={[
              { number: 34, title: 'Restaurants', slug: '34-restaurants', isCompleted: false, isClubOnly: true },
              { number: 35, title: "Bob's Burgers", slug: '35-bobs-burgers', isCompleted: false, isClubOnly: true },
              { number: 36, title: 'Favorite Cities', slug: '36-favorite-cities', isCompleted: false, isClubOnly: true },
              { number: 37, title: 'Bank Accounts', slug: '37-bank-accounts', isCompleted: false, isClubOnly: true },
              { number: 38, title: 'Pokedex', slug: '38-pokedex', isCompleted: false, isClubOnly: true }
            ]}
            isClubOnly={true}
          />

          {/* Modules - Club Only */}
          <CourseChapter
            number={9}
            title="Modules"
            description="Import built-in modules and learn how to create our own."
            exercises={[
              { number: 39, title: 'Slot Machine', slug: '39-slot-machine', isCompleted: false, isClubOnly: true },
              { number: 40, title: 'Solar System', slug: '40-solar-system', isCompleted: false, isClubOnly: true },
              { number: 41, title: 'Countdown', slug: '41-countdown', isCompleted: false, isClubOnly: true },
              { number: 42, title: 'Forty Two', slug: '42-forty-two', isCompleted: false, isClubOnly: true },
              { number: 43, title: 'Zen of Python', slug: '43-zen-of-python', isCompleted: false, isClubOnly: true }
            ]}
            isClubOnly={true}
          />

          {/* Final Project - Club Only */}
          <CourseChapter
            number={10}
            title="Final Project"
            description="Complete all exercises to unlock the Final Project. Ready to start building? Use the skills you've gained throughout the course to build out a fully-fledged Python project! When you're done, submit it for review by a code mentor."
            exercises={[]}
            isClubOnly={true}
            isFinalProject={true}
          />

          {/* Certificate - Club Only */}
          <CourseChapter
            number={11}
            title="Course Certificate"
            description="Finished with this course? Request a certificate to celebrate your hard work! To be eligible to request a certificate, make sure you submit the following project(s) and have them reviewed by a code mentor."
            exercises={[]}
            isClubOnly={true}
            isCertificate={true}
            requirements={[
              { id: 'req-1', text: 'Checkpoint Project reviewed' },
              { id: 'req-2', text: 'Final Project reviewed' }
            ]}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <CourseSidebar
            username="Your Name"
            level={1}
            progress={{
              exercises: { completed: 0, total: 43 },
              projects: { completed: 0, total: 2 },
              xp: { earned: 0, total: 685 },
              badges: { earned: 0, total: 8 }
            }}
            cheatSheets={[
              { id: 'cheat-1', title: 'Python functions and concepts', unlocksAfter: 4, isUnlocked: false },
              { id: 'cheat-2', title: 'Python advanced concepts', unlocksAfter: 8, isUnlocked: false }
            ]}
          />

          <CourseProjects
            title="What you'll build"
            description="Gain the skills you need to build full-fledged, real-world projects. Plus, receive personalized code reviews from experts who are here to support your journey."
            projects={[
              { id: 'proj-1', title: 'Create a Discord Bot with Python', image: 'https://ext.same-assets.com/1748103887/322324277.gif' },
              { id: 'proj-2', title: 'Generate a Blog with OpenAI', image: 'https://ext.same-assets.com/1748103887/322324277.gif' },
              { id: 'proj-3', title: 'Create a GIF with Python', image: 'https://ext.same-assets.com/1748103887/322324277.gif' }
            ]}
          />

          {/* Join Club Call to Action */}
          <div className="bg-gradient-to-r from-codedex-purple to-codedex-blue rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-pixel text-white mb-2">Join the Club</h3>
              <p className="text-white/80 text-sm mb-4">
                Want to take your learning to the next level?
                Get full access to all courses and more for as low as $7.99 / month.
              </p>
              <Button
                className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel w-full"
                asChild
              >
                <Link href="/pricing">Join Club now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonCoursePage;
