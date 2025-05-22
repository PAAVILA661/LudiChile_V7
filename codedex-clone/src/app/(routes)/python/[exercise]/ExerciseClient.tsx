"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Square, Copy, CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Added CheckCircle, XCircle, Loader2
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // 1. Import useAuth

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

const ExerciseClient = ({ exerciseData, exerciseSlug }: ExerciseClientProps) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Can be null initially
  
  // 2. Access Auth Data
  const { user, login, isLoading: isAuthLoading } = useAuth();

  // 4. New State Variables
  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
  const [isExerciseCompletedByUser, setIsExerciseCompletedByUser] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Effect to set initial code and check completion status
  useEffect(() => {
    if (exerciseData?.initialCode) {
      setCode(exerciseData.initialCode);
    }
    if (user?.progress && exerciseSlug) {
      const completed = user.progress.some(
        p => p.exercise?.slug === exerciseSlug && p.status === 'COMPLETED'
      );
      setIsExerciseCompletedByUser(completed);
      if (completed) setIsCorrect(true); // If already completed, assume it was correct
    }
  }, [exerciseData, user?.progress, exerciseSlug]);
  
  // Reset isCorrect if code changes
  useEffect(() => {
    if (!isExerciseCompletedByUser) { // Don't reset if already marked completed
        setIsCorrect(null); 
    }
    setApiMessage(null); // Clear API message on code change
  }, [code, isExerciseCompletedByUser]);


  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    setApiMessage(null); // Clear API message
    setIsCorrect(null); // Reset correctness on new run

    // Simulate code execution with a delay
    setTimeout(() => {
      try {
        // Simple evaluation logic for each exercise
        if (exerciseSlug === '01-setting-up') {
          if (code.includes("print('Hi')") || code.includes('print("Hi")')) {
            setOutput('Hi');
            setIsCorrect(true);
          } else {
            setOutput('Your code didn\'t produce the expected output. Try again!');
            setIsCorrect(false);
          }
        } else if (exerciseSlug === '02-hello-world') {
          if (code.includes("print('Hello, World!')") || code.includes('print("Hello, World!")')) {
            setOutput('Hello, World!');
            setIsCorrect(true);
          } else {
            setOutput('Your code didn\'t produce the expected output. Try printing "Hello, World!"');
            setIsCorrect(false);
          }
        } else if (exerciseSlug === '03-pattern') {
          const asteriskCount = (code.match(/\*/g) || []).length;
          const printCount = (code.match(/print/g) || []).length;

          if (asteriskCount >= 6 && printCount >= 3) {
            setOutput('*\n**\n***');
            setIsCorrect(true);
          } else {
            setOutput('Your pattern doesn\'t match what was expected. Try using three print() statements with asterisks.');
            setIsCorrect(false);
          }
        } else if (exerciseSlug === '04-initials') {
          const printCount = (code.match(/print/g) || []).length;
          if (printCount >= 3) {
            const lines = code.split('\n')
              .filter(line => line.trim().startsWith('print'))
              .map(line => {
                const match = line.match(/print\(['"](.*)["']\)/);
                return match ? match[1] : '';
              })
              .join('\n');
            setOutput(lines || 'Your ASCII art is displayed here!');
            setIsCorrect(true);
          } else {
            setOutput('Try using multiple print statements to create your ASCII art initials.');
            setIsCorrect(false);
          }
        } else {
          setOutput(`Output for ${exerciseData.title}:\nSimulated generic output based on code input.`);
          // For unhandled exercises, let's assume correct if there's some code.
          setIsCorrect(code.trim().length > 0); 
        }
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsCorrect(false);
      }
      setIsRunning(false);
    }, 1000);
  };
  
  // 3. Modify handleCheckAnswer (or create handleCompleteExercise)
  const handleCompleteExercise = async () => {
    if (!isCorrect || !user || isExerciseCompletedByUser || isSubmittingProgress) {
      if (!isCorrect && isCorrect !== null) { // if isCorrect is false (not null)
        setApiMessage({ type: 'error', text: 'Your solution isn\'t quite right. Please run and check your code output.' });
      }
      return;
    }

    setIsSubmittingProgress(true);
    setApiMessage(null);

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, exerciseSlug }),
      });

      const data = await response.json();

      if (response.ok) {
        // Determine XP awarded - using a placeholder for now
        const xpAwarded = exerciseData.expectedOutput ? 10 : 5; // Example: 10 XP for exercises with expected output, 5 otherwise
        setApiMessage({ type: 'success', text: `Progress saved! XP Awarded: ${xpAwarded}. Total XP: ${data.total_xp}` });
        
        // Refresh user data in AuthContext
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const newUserData = await sessionResponse.json();
          if (newUserData.user) {
            login(newUserData.user); // Update AuthContext
            setIsExerciseCompletedByUser(true); // Mark as completed
          } else {
             throw new Error('Failed to fetch updated user session data.');
          }
        } else {
           throw new Error('Failed to fetch updated user session.');
        }

      } else {
        setApiMessage({ type: 'error', text: data.message || 'Failed to save progress. Please try again.' });
      }
    } catch (error) {
      console.error("Error completing exercise:", error);
      setApiMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmittingProgress(false);
    }
  };


  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-codedex-darkNavy">
      <div className="border-b border-codedex-gold/10">
        <div className="codedex-container py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/python" className="text-codedex-gold hover:text-white mr-2">
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
              <div className="whitespace-pre-line">{exerciseData.description}</div>

              <div className="mt-8">
                <h2 className="font-pixel text-white text-xl mb-2">Instructions</h2>
                <div className="text-gray-300 whitespace-pre-line">
                  {exerciseData.instructions}
                </div>

                {exerciseData.expectedOutput && (
                  <div className="mt-6 p-4 bg-codedex-navy rounded-md border border-codedex-gold/10">
                    <p className="text-white font-medium mb-2">Expected Output:</p>
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
              disabled={isExerciseCompletedByUser || isSubmittingProgress}
            />
          </div>

          {/* Editor actions */}
          <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleRunCode}
                className="bg-codedex-teal text-white hover:bg-codedex-teal/80 flex items-center gap-1"
                disabled={isRunning || isExerciseCompletedByUser || isSubmittingProgress}
              >
                {isRunning ? <Square size={16} /> : <Play size={16} />}
                {isRunning ? 'Stop' : 'Run Code'}
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
          <div className="h-48 bg-black p-4 font-mono text-sm text-gray-300 overflow-y-auto flex flex-col"> {/* Increased height and flex-col */}
            <div className="text-gray-500 mb-1">Terminal Output:</div>
            <pre className="whitespace-pre-wrap flex-grow overflow-y-auto">{output || "Run code to see output..."}</pre> {/* Added flex-grow and overflow for output */}
            
            {/* API Message Area */}
            {apiMessage && (
              <div className={`mt-2 p-2 rounded-md text-xs ${apiMessage.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {apiMessage.text}
              </div>
            )}

            {/* Correctness Hint Area */}
            {isCorrect === true && !isExerciseCompletedByUser && !apiMessage?.text.includes("Progress saved!") && (
              <div className="mt-1 p-2 rounded-md text-xs bg-blue-900 text-blue-200">
                Looks correct! Click &quot;Complete Exercise&quot; to save your progress.
              </div>
            )}
            {isCorrect === false && output && ( // Show only if there's output and it's incorrect
              <div className="mt-1 p-2 rounded-md text-xs bg-yellow-900 text-yellow-200">
                Your code ran, but the output isn&apos;t quite right. Check the instructions and expected output.
              </div>
            )}
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
              onClick={handleCompleteExercise} // Changed from handleCheckAnswer
              className={`
                ${isExerciseCompletedByUser ? 'bg-green-600 hover:bg-green-700' : 'bg-codedex-gold hover:bg-codedex-gold/90'}
                text-codedex-darkNavy font-semibold flex items-center gap-2
              `}
              disabled={isAuthLoading || isSubmittingProgress || isRunning || isCorrect === false || (isCorrect === null && !isExerciseCompletedByUser) || isExerciseCompletedByUser}
            >
              {isSubmittingProgress ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isExerciseCompletedByUser ? (
                <CheckCircle size={18} />
              ) : (
                <Play size={18} /> // Placeholder, ideally a "check mark" or "complete" icon
              )}
              {isSubmittingProgress ? 'Submitting...' : isExerciseCompletedByUser ? 'Completed' : 'Complete Exercise'}
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
