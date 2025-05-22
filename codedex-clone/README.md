This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview: Codedex Clone

This project is a clone of Codedex, focusing on providing a platform for learning Python through interactive exercises. It includes user authentication, progress tracking, and an admin interface for management.

### Key Features

*   **User Authentication**:
    *   User registration and login functionality.
    *   Session management using JWT (JSON Web Tokens) stored in cookies.

*   **Python Learning Module**:
    *   A structured Python course with chapters and individual exercises.
    *   View for individual exercises with instructions, a code editor, and a terminal for output.

*   **User Progress System**:
    *   Tracks completion status for each exercise.
    *   Awards Experience Points (XP) for completing exercises.
    *   A badge system (database schema in place, UI displays earned badges).

*   **User Profiles**:
    *   Displays user information including name, email, and join date.
    *   Shows user's total XP, count of completed exercises, and earned badges.
    *   Allows users to edit their display name.

*   **Admin Area**:
    *   Basic structure for managing users, courses, static pages, and site settings (CRUD interfaces are placeholders or under development).
    *   An API endpoint (`GET /api/admin/stats`) provides platform statistics:
        *   Total number of users.
        *   Total number of exercises marked 'COMPLETED' across all users.
        *   Total XP accumulated by all users.
    *   *Note*: The Admin Dashboard UI for displaying these statistics (`admin/dashboard/page.tsx`) is implemented in code but its deployment was blocked by a tool limitation regarding file paths with parentheses. The API endpoint is functional.

*   **Testing**:
    *   The project includes unit and integration tests for key API endpoints and frontend components using Jest and React Testing Library.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/PAAVILA661/LudiChile_V7)
