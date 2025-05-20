import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const CommunityPage = () => {
  const posts = [
    {
      id: 1,
      author: 'Steve Harvey',
      authorImage: 'https://ext.same-assets.com/107982090/96718151.svg',
      authorUsername: 'steveharvey',
      rank: 'Bronze',
      date: 'Apr 15th, 2025 at 1:24 PM',
      timeAgo: '9h',
      channel: 'General',
      content: "my pet died, im on steve harvey jr the third, the other two died",
      likes: 6,
      comments: 2,
    },
    {
      id: 2,
      author: 'Sonny Li',
      authorImage: 'https://ext.same-assets.com/107982090/3009309067.svg',
      authorUsername: 'sonny',
      rank: 'Gold',
      date: 'Apr 14th, 2025 at 2:31 PM',
      timeAgo: '1d',
      channel: 'General',
      content: "Guess who just rode into town (NYC)!\n\nDrop a 🚀 emoji comment if you know :)",
      likes: 18,
      comments: 4,
    },
    {
      id: 3,
      author: 'naomi lee',
      authorImage: 'https://ext.same-assets.com/107982090/4279778090.svg',
      authorUsername: 'naomixlee',
      rank: 'Bronze',
      date: 'Apr 14th, 2025 at 9:48 PM',
      timeAgo: '1d',
      channel: 'General',
      content: "#30NitesOfCode Pets turned Action Figures\n\nWe hopped on the AI action figure trend and these are the cutesttt 'lil pets.",
      image: "https://ext.same-assets.com/107982090/4227111582.jpeg",
      likes: 4,
      comments: 6,
    },
  ];

  const channels = [
    { name: 'General', href: '/community/main' },
    { name: 'Question of the Week', href: '/community/question-of-the-week' },
    { name: 'Introductions', href: '/community/introduction' },
    { name: 'Python', href: '/community/python' },
    { name: 'JavaScript', href: '/community/javascript' },
    { name: 'Web Development', href: '/community/web-dev' },
    { name: 'Career', href: '/community/career' },
    { name: 'Memes', href: '/community/meme' },
    { name: 'Pets', href: '/community/pets' },
    { name: '30NitesOfCode', href: '/community/30-nites-of-code' },
  ];

  const events = [
    {
      date: 'Apr 16',
      title: 'Smash Karts Tournament',
      time: 'Wed Apr 16th @ 3:00pm ET',
    },
    {
      date: 'Apr 23',
      title: 'Node.js Workshop',
      time: 'Wed Apr 23rd @ 3:00pm ET',
    },
    {
      date: 'May 7',
      title: 'Resume Review Workshop',
      time: 'Wed May 7th @ 3:00pm ET',
    },
  ];

  const news = [
    {
      title: 'Codedex Update - March 2025',
      date: 'Apr 11th | Blog',
      href: 'https://www.codedex.io/blog/codedex-update-march-2025',
    },
    {
      title: 'The Joy of Making with Ellie',
      date: 'Apr 8th | Video',
      href: 'https://www.youtube.com/watch?v=g0X-wafmQTo',
    },
    {
      title: 'Introducing Localized Pricing',
      date: 'Apr 5th | Blog',
      href: 'https://www.codedex.io/blog/introducing-localized-pricing',
    },
  ];

  return (
    <div className="min-h-screen bg-codedex-darkNavy">
      <div className="bg-gradient-to-b from-indigo-900/50 to-codedex-darkNavy pt-10 pb-4 mb-8">
        <div className="codedex-container">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://ext.same-assets.com/107982090/2244271743.gif"
              alt="Community"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-pixel text-white">Coddex Community</h1>
              <p className="text-gray-300">Let's make magic together</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <button className="bg-codedex-gold text-codedex-darkNavy px-4 py-2 rounded-md font-medium">
              Top Posts
            </button>
            <button className="text-gray-300 hover:bg-gray-700/50 px-4 py-2 rounded-md">
              Newest
            </button>
          </div>
        </div>
      </div>

      <div className="codedex-container pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 space-y-4">
            <div className="bg-codedex-navy p-4 rounded-lg shadow-md">
              <h3 className="font-pixel text-white mb-4">Channels</h3>
              <ul className="space-y-2">
                {channels.map((channel) => (
                  <li key={channel.name}>
                    <Link
                      href={channel.href}
                      className="text-gray-300 hover:text-white flex items-center gap-2 py-1"
                    >
                      <span className="text-gray-500">#</span> {channel.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-codedex-navy border-codedex-gold/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 relative">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/@${post.authorUsername}`} className="font-semibold text-white hover:underline">
                          {post.author}
                        </Link>
                        <span className={`text-xs px-2 py-0.5 rounded ${post.rank === 'Gold' ? 'bg-yellow-700' : 'bg-amber-900'}`}>
                          {post.rank} rank
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href={`/@${post.authorUsername}`} className="hover:underline">
                          @{post.authorUsername}
                        </Link>
                        • {post.timeAgo}
                      </div>
                      <div className="mt-2 text-gray-300 whitespace-pre-line">
                        {post.content}
                      </div>
                      {post.image && (
                        <div className="mt-3 rounded-md overflow-hidden">
                          <Image
                            src={post.image}
                            alt="Post image"
                            width={500}
                            height={300}
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex items-center gap-4">
                        <button className="text-gray-400 hover:text-codedex-gold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="text-gray-400 hover:text-codedex-gold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <Card className="bg-codedex-navy border-codedex-gold/10">
              <CardHeader>
                <CardTitle className="text-white font-pixel text-lg">Codedex News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {news.map((item) => (
                    <li key={item.title}>
                      <Link href={item.href} className="block hover:bg-codedex-gold/5 p-2 rounded-md transition-colors">
                        <h4 className="text-white font-medium text-sm">{item.title}</h4>
                        <p className="text-gray-400 text-xs">{item.date}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-codedex-navy border-codedex-gold/10">
              <CardHeader>
                <CardTitle className="text-white font-pixel text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {events.map((event) => (
                    <li key={event.title} className="flex items-start gap-3">
                      <div className="bg-codedex-purple text-white text-center p-2 rounded-md w-12 text-xs">
                        {event.date}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{event.title}</h4>
                        <p className="text-gray-400 text-xs">{event.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-codedex-navy border-codedex-gold/10">
              <CardHeader>
                <CardTitle className="text-white font-pixel text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/code-of-conduct"
                  className="text-codedex-gold hover:underline text-sm flex items-center gap-2"
                >
                  Review our Code of Conduct
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
