import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Datos de ejercicios
const exercisesData = {
  "01-setting-up": {
    number: 1,
    title: "Setting Up",
    description: `Welcome to the first chapter of The Legend of Python!

The programming language we are learning is called Python, created by a developer named Guido van Rossum in the early 90s.

Python is designed to be easy for us to read, which makes it the perfect coding language for beginners.

It's also super versatile and used in the following:
• Data analysis & visualization
• Artificial intelligence (AI)
• Machine learning (ML)
• Web development
• And more!

All the code we write in this course will be in Python files, with the .py extension. And we write them inside a code editor.

A code editor is a text editor where we can write and execute code.`,
    instructions: `Copy and paste this line of code in line 3:

print('Hi')

And then press the "Run" button and wait 1-2 seconds.`,
    expectedOutput: "Hi",
    initialCode: "# Write code below ⌨️\n\n\n",
    nextExercise: "02-hello-world",
    prevExercise: null,
  },
  "02-hello-world": {
    number: 2,
    title: "Hello World",
    description: `In the previous exercise, you used the print() function to output the message "Hi" to the console.

The print() function in Python is used to output text to the screen. It's one of the most basic and commonly used functions.

The "Hello, World!" program is often the first program written by people learning to code. It's a simple program that outputs the text "Hello, World!" to the screen.`,
    instructions: `Write a program that prints the message "Hello, World!" to the console.

Remember to use the print() function and to enclose the text in quotes.`,
    expectedOutput: "Hello, World!",
    initialCode: "# Write your Hello World program below\n\n",
    nextExercise: "03-pattern",
    prevExercise: "01-setting-up",
  },
  "03-pattern": {
    number: 3,
    title: "Pattern",
    description: `Now that you know how to use the print() function, let's create something more interesting: a pattern!

The print() function can be used multiple times to output different lines of text.

When you call print() multiple times, each call will print on a new line.`,
    instructions: `Create a simple triangle pattern using asterisks (*) like this:

*
**
***

Use three print() statements, one for each line of the pattern.`,
    expectedOutput: "*\n**\n***",
    initialCode: "# Create a triangle pattern with asterisks\n\n\n",
    nextExercise: "04-initials",
    prevExercise: "02-hello-world",
  },
  "04-initials": {
    number: 4,
    title: "Initials",
    description: `ASCII art is a graphic design technique that uses computers for presentation and consists of pictures pieced together from printable characters defined by the ASCII standard.

You can create simple ASCII art using multiple print() statements with text to form patterns or images.`,
    instructions: `Create ASCII art of your initials.

For example, if your name is John Doe, you might create something like this:

  JJJJJ  DDDD
    J    D   D
    J    D   D
  J J    D   D
  JJJ    DDDD

Use multiple print() statements to create the art.`,
    expectedOutput: null, // No specific expected output for this one as it depends on the user's initials
    initialCode: "# Create ASCII art of your initials\n\n\n",
    nextExercise: "05-snail-mail",
    prevExercise: "03-pattern",
  },
};

// Función para generar los parámetros estáticos
export function generateStaticParams() {
  return Object.keys(exercisesData).map((exercise) => ({
    exercise,
  }));
}

interface ExercisePageProps {
  params: {
    exercise: string;
  };
}

// Importando el cliente desde una ruta relativa correcta
import ExerciseClient from "./ExerciseClient";

export default function ExercisePage({ params }: ExercisePageProps) {
  const exerciseSlug = params.exercise;
  const exerciseData =
    exercisesData[exerciseSlug as keyof typeof exercisesData];

  // Si el ejercicio no existe
  if (!exerciseData) {
    return <ExerciseNotFound />;
  }

  return (
    <ExerciseClient exerciseData={exerciseData} exerciseSlug={exerciseSlug} />
  );
}

function ExerciseNotFound() {
  return (
    <div className="min-h-screen bg-codedex-darkNavy flex flex-col items-center justify-center">
      <h1 className="text-3xl font-pixel text-codedex-gold mb-4">
        Exercise Not Found
      </h1>
      <p className="text-gray-300 mb-6">
        Sorry, we couldn't find the exercise you're looking for.
      </p>
      <Button asChild>
        <Link href="/python">Return to Python Course</Link>
      </Button>
    </div>
  );
}
