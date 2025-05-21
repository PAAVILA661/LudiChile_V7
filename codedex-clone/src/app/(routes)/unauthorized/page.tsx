"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-codedex-darkNavy flex flex-col items-center justify-center text-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-pixel text-red-500 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-300 mb-8">
          You do not have permission to view this page.
        </p>
        <Button
          asChild
          className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90"
        >
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
