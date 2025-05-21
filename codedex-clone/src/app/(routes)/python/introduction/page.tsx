import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TOPICS = [
  { id: "basics", text: "Fundamentals of Python syntax and basic programming" },
  { id: "conditional", text: "Working with conditional statements and loops" },
  { id: "functions", text: "Creating and using functions" },
  {
    id: "data-structures",
    text: "Lists, dictionaries, and other data structures",
  },
  { id: "oop", text: "Object-oriented programming with classes" },
  { id: "modules", text: "Working with modules and libraries" },
  { id: "projects", text: "Building real-world projects" },
];

const PythonIntroductionPage = () => {
  return (
    <div className="min-h-screen bg-codedex-darkNavy">
      <div className="relative py-24 overflow-hidden">
        {/* Background image with pixel art */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ext.same-assets.com/1748103887/4042239105.gif"
            alt="Python Course Background"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-codedex-darkNavy/50 to-codedex-darkNavy" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 codedex-container text-center">
          <div className="bg-codedex-navy inline-px-4 py-2 rounded-lg mb-4 text-codedex-gold inline-block">
            <span className="font-pixel">THE LEGEND OF PYTHON</span>
          </div>

          <h1 className="text-6xl font-pixel text-codedex-gold mb-8">
            Begin Your Python Adventure
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Learn programming fundamentals with Python, the world's most popular
            and versatile coding language!
          </p>

          <div className="flex flex-col items-center gap-6">
            <Button
              size="lg"
              className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel text-lg px-8 py-6"
              asChild
            >
              <Link href="/python/01-setting-up">Start First Exercise</Link>
            </Button>
            <p className="text-gray-400">
              No experience required - let's start coding!
            </p>
          </div>
        </div>
      </div>

      <div className="codedex-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-codedex-navy p-8 rounded-lg border border-codedex-gold/10">
            <div className="text-4xl font-bold text-codedex-gold mb-4">43+</div>
            <h3 className="text-xl font-pixel text-white mb-2">Exercises</h3>
            <p className="text-gray-300">
              Interactive coding exercises that teach you Python step by step
            </p>
          </div>

          <div className="bg-codedex-navy p-8 rounded-lg border border-codedex-gold/10">
            <div className="text-4xl font-bold text-codedex-gold mb-4">11</div>
            <h3 className="text-xl font-pixel text-white mb-2">Chapters</h3>
            <p className="text-gray-300">
              Structured learning path from the basics to advanced concepts
            </p>
          </div>

          <div className="bg-codedex-navy p-8 rounded-lg border border-codedex-gold/10">
            <div className="text-4xl font-bold text-codedex-gold mb-4">685</div>
            <h3 className="text-xl font-pixel text-white mb-2">XP Points</h3>
            <p className="text-gray-300">
              Earn experience points as you complete exercises and projects
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-pixel text-codedex-gold mb-6">
              What You'll Learn
            </h2>
            <ul className="space-y-4">
              {TOPICS.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-codedex-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-codedex-gold rounded-full" />
                  </div>
                  <span className="text-gray-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-codedex-navy p-6 rounded-lg border border-codedex-gold/10">
            <h3 className="text-xl font-pixel text-white mb-4">Sample Code</h3>
            <div className="bg-[#001429] p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300">
                {`# This is your first Python program
name = input("What is your name? ")

# Greet the user
print(f"Hello, {name}!")
print("Welcome to the world of Python!")

# A simple loop example
for i in range(3):
    print(f"Count: {i + 1}")

# A simple function
def calculate_area(length, width):
    return length * width

# Function call
area = calculate_area(5, 10)
print(f"The area is {area} square units.")`}
              </pre>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-pixel text-codedex-gold mb-8">
            Ready to Begin Your Journey?
          </h2>
          <Button
            size="lg"
            className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel text-lg px-8 py-6"
            asChild
          >
            <Link href="/python/01-setting-up">Start First Exercise</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PythonIntroductionPage;
