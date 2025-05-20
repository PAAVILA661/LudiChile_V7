"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Square, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseData {
  number: number;
  title: string;
  description: string;
  instructions: string;
  expectedOutput: string | null;
  initialCode: string;
  nextExercise: string | null;
  prevExercise: string | null;
}

interface ExerciseClientProps {
  exerciseData: ExerciseData;
  exerciseSlug: string;
}

const ExerciseClient = ({
  exerciseData,
  exerciseSlug,
}: ExerciseClientProps) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (exerciseData?.initialCode) {
      setCode(exerciseData.initialCode);
    }
  }, [exerciseData]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");

    // Simulate code execution with a delay
    setTimeout(() => {
      try {
        // Simple evaluation logic for each exercise
        if (exerciseSlug === "01-setting-up") {
          if (code.includes("print('Hi')") || code.includes('print("Hi")')) {
            setOutput("Hi");
            setIsCorrect(true);
          } else {
            setOutput(
              "Your code didn't produce the expected output. Try again!",
            );
            setIsCorrect(false);
          }
        } else if (exerciseSlug === "02-hello-world") {
          if (
            code.includes("print('Hello, World!')") ||
            code.includes('print("Hello, World!")')
          ) {
            setOutput("Hello, World!");
            setIsCorrect(true);
          } else {
            setOutput(
              'Your code didn\'t produce the expected output. Try printing "Hello, World!"',
            );
            setIsCorrect(false);
          }
        } else if (exerciseSlug === "03-pattern") {
          const expectedPattern = ["*", "**", "***"].join("\n");
          // Check if asterisks pattern is in the code
          const asteriskCount = (code.match(/\*/g) || []).length;
          const printCount = (code.match(/print/g) || []).length;

          if (asteriskCount >= 6 && printCount >= 3) {
            setOutput("*\n**\n***");
            setIsCorrect(true);
          } else {
            setOutput(
              "Your pattern doesn't match what was expected. Try using three print() statements with asterisks.",
            );
            setIsCorrect(false);
          }
        } else if (exerciseSlug === "04-initials") {
          // For initials, we just check that they've used multiple print statements
          const printCount = (code.match(/print/g) || []).length;
          if (printCount >= 3) {
            // Extract and display the actual output
            const lines = code
              .split("\n")
              .filter((line) => line.trim().startsWith("print"))
              .map((line) => {
                const match = line.match(/print\(['"](.*)["']\)/);
                return match ? match[1] : "";
              })
              .join("\n");

            setOutput(lines || "Your ASCII art is displayed here!");
            setIsCorrect(true);
          } else {
            setOutput(
              "Try using multiple print statements to create your ASCII art initials.",
            );
            setIsCorrect(false);
          }
        } else {
          setOutput("Exercise not fully implemented yet. Stay tuned!");
          setIsCorrect(false);
        }
      } catch (error) {
        setOutput(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        setIsCorrect(false);
      }

      setIsRunning(false);
    }, 1000);
  };

  const handleCheckAnswer = () => {
    if (isCorrect) {
      alert(
        "Great job! Your solution is correct. You can move on to the next exercise.",
      );
    } else {
      alert(
        "Your solution isn't quite right. Please try again and check the instructions.",
      );
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-codedex-darkNavy">
      <div className="border-b border-codedex-gold/10">
        <div className="codedex-container py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/python"
              className="text-codedex-gold hover:text-white mr-2"
            >
              <ChevronLeft size={20} />
            </Link>
            <span className="text-white font-medium">
              The Legend of Python / {exerciseData.title}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Left panel - Exercise description */}
        <div className="bg-codedex-darkNavy p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-codedex-teal text-sm">Exercise</span>
            </div>

            <h1 className="text-3xl font-pixel text-codedex-gold">
              {exerciseData.number}. {exerciseData.title}
            </h1>

            <div className="text-gray-300 space-y-4">
              <div className="whitespace-pre-line">
                {exerciseData.description}
              </div>

              <div className="mt-8">
                <h2 className="font-pixel text-white text-xl mb-2">
                  Instructions
                </h2>
                <div className="text-gray-300 whitespace-pre-line">
                  {exerciseData.instructions}
                </div>

                {exerciseData.expectedOutput && (
                  <div className="mt-6 p-4 bg-codedex-navy rounded-md border border-codedex-gold/10">
                    <p className="text-white font-medium mb-2">
                      Expected Output:
                    </p>
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre">
                      {exerciseData.expectedOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Code editor */}
        <div className="bg-codedex-navy flex flex-col">
          {/* Editor top bar */}
          <div className="bg-codedex-darkNavy px-4 py-2 border-b border-gray-800 flex items-center">
            <div className="bg-codedex-navy text-white px-3 py-1.5 text-sm rounded-t-md font-mono">
              script.py
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-grow">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#001429] text-gray-300 p-4 focus:outline-none font-mono text-sm resize-none"
              spellCheck="false"
            />
          </div>

          {/* Editor actions */}
          <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleRunCode}
                className="bg-codedex-teal text-white hover:bg-codedex-teal/80 flex items-center gap-1"
                disabled={isRunning}
              >
                {isRunning ? <Square size={16} /> : <Play size={16} />}
                {isRunning ? "Stop" : "Run"}
              </Button>

              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={handleCopyCode}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          {/* Terminal */}
          <div className="h-40 bg-black p-4 font-mono text-sm text-gray-300 overflow-auto">
            <div className="text-gray-500 mb-2">Terminal</div>
            <div className="whitespace-pre-line">{output}</div>
          </div>

          {/* Bottom navigation */}
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              asChild
              disabled={!exerciseData.prevExercise}
            >
              {exerciseData.prevExercise ? (
                <Link href={`/python/${exerciseData.prevExercise}`}>
                  <ChevronLeft size={16} className="mr-1" />
                  Prev
                </Link>
              ) : (
                <span>
                  <ChevronLeft size={16} className="mr-1" />
                  Prev
                </span>
              )}
            </Button>

            <Button
              onClick={handleCheckAnswer}
              className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90"
            >
              Check Answer
            </Button>

            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              asChild
              disabled={!exerciseData.nextExercise}
            >
              {exerciseData.nextExercise ? (
                <Link href={`/python/${exerciseData.nextExercise}`}>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              ) : (
                <span>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseClient;
