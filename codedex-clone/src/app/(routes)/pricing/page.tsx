import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const PricingPage = () => {
  return (
    <div className="bg-gradient-to-b from-codedex-darkNavy to-codedex-navy">
      <div className="codedex-container py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-pixel text-codedex-gold mb-4">Join the Club!</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Unlock your full potential with our tailored plans designed for every stage of your coding journey.
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex bg-codedex-navy/50 p-1 rounded-md">
              <button className="px-4 py-2 rounded-md bg-codedex-gold text-codedex-darkNavy font-medium">
                Yearly
              </button>
              <button className="px-4 py-2 rounded-md text-gray-300">
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-codedex-navy border border-codedex-gold/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Image
                    src="https://ext.same-assets.com/1771893057/3884250779.svg"
                    alt="Explorer"
                    width={80}
                    height={80}
                  />
                </div>
                <h2 className="font-pixel text-2xl text-white mb-1 text-center">Explorer</h2>
                <div className="text-center mb-6">
                  <span className="text-gray-400">Free forever</span>
                </div>
                <p className="text-gray-300 mb-6 text-center">
                  Explore the world of coding with basic access to our learning content and community.
                </p>
                <div className="flex justify-center mb-8">
                  <Button className="w-full bg-transparent text-codedex-gold border border-codedex-gold/30 hover:bg-codedex-gold/10" asChild>
                    <Link href="/signup">Start for free</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Access to first few chapters in many courses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Access to community and events</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Club Plan */}
          <Card className="bg-codedex-navy border-2 border-codedex-gold overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-codedex-gold text-codedex-darkNavy px-3 py-1 text-xs font-medium">
              SAVE 36%
            </div>
            <CardContent className="p-0">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Image
                    src="https://ext.same-assets.com/1771893057/3592764143.svg"
                    alt="Club"
                    width={80}
                    height={80}
                  />
                </div>
                <h2 className="font-pixel text-2xl text-codedex-gold mb-1 text-center">CLUB</h2>
                <div className="text-center mb-6">
                  <span className="text-3xl font-pixel text-white">$7.99</span>
                  <span className="text-gray-400"> / month</span>
                </div>
                <p className="text-gray-300 mb-6 text-center">
                  Explore the world of coding with basic access to our learning content and community.
                </p>
                <div className="flex justify-center mb-8">
                  <Button className="w-full bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90" asChild>
                    <Link href="/signup">Join Club</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Everything in <span className="font-bold">Explorer</span>, plus...</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Full access to Club-only content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">One-on-one support from experts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">and more!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <h2 className="text-3xl font-pixel text-codedex-gold mb-8 text-center">Compare Features</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-normal">Learning Content</th>
                  <th className="text-center py-4 px-6 w-48">
                    <div className="flex justify-center mb-2">
                      <Image
                        src="https://ext.same-assets.com/1771893057/3884250779.svg"
                        alt="Explorer"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="text-white font-pixel">Explorer</div>
                  </th>
                  <th className="text-center py-4 px-6 w-48 bg-codedex-navy/50">
                    <div className="flex justify-center mb-2">
                      <Image
                        src="https://ext.same-assets.com/1771893057/3592764143.svg"
                        alt="Club"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="text-codedex-gold font-pixel">CLUB</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-codedex-gold/10">
                  <td className="py-4 px-6 text-white">
                    <div className="font-medium">Access to Courses</div>
                    <div className="text-sm text-gray-400">Access to our library of standard and Club-only courses</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-sm text-gray-400">Access to early chapters</div>
                  </td>
                  <td className="py-4 px-6 text-center bg-codedex-navy/50">
                    <div className="text-green-500 font-medium">Full Access</div>
                  </td>
                </tr>
                <tr className="border-t border-codedex-gold/10">
                  <td className="py-4 px-6 text-white">
                    <div className="font-medium">Project Tutorials</div>
                    <div className="text-sm text-gray-400">Choose from a catalog of real-world projects</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center bg-codedex-navy/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-t border-codedex-gold/10">
                  <td className="py-4 px-6 text-white">
                    <div className="font-medium">Code Mentors</div>
                    <div className="text-sm text-gray-400">Get live help from senior devs 24/7 with any coding questions</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-gray-500 text-2xl">-</div>
                  </td>
                  <td className="py-4 px-6 text-center bg-codedex-navy/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-t border-codedex-gold/10">
                  <td className="py-4 px-6 text-white">
                    <div className="font-medium">Certificates</div>
                    <div className="text-sm text-gray-400">Earn certificates for completing courses</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-gray-500 text-2xl">-</div>
                  </td>
                  <td className="py-4 px-6 text-center bg-codedex-navy/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-pixel text-codedex-gold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-codedex-navy border border-codedex-gold/10 rounded-lg p-4">
              <h3 className="text-white font-medium flex items-center justify-between cursor-pointer">
                What is Codedex Club?
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
            <div className="bg-codedex-navy border border-codedex-gold/10 rounded-lg p-4">
              <h3 className="text-white font-medium flex items-center justify-between cursor-pointer">
                How can I get in contact with someone from the Codedex team?
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
            <div className="bg-codedex-navy border border-codedex-gold/10 rounded-lg p-4">
              <h3 className="text-white font-medium flex items-center justify-between cursor-pointer">
                How do I cancel my subscription?
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="text-gray-400 mb-4">Still have more questions?</div>
            <Button className="bg-codedex-blue text-white hover:bg-codedex-blue/90" asChild>
              <Link href="https://codedex.notion.site/Welcome-to-the-Cod-dex-Help-Center-c8afe2966ea9490d9377bce826d22eb7">
                Go to Help Center
              </Link>
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-gradient-to-r from-codedex-purple to-codedex-blue rounded-lg p-8 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-pixel text-2xl text-white mb-2">
                Start your coding adventure today.
              </h3>
              <p className="text-white/80">
                Commit to your goals with Codedex Club—for as low as $7.99/month.
              </p>
            </div>
            <Button className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel" size="lg" asChild>
              <Link href="/signup">Join Club</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
