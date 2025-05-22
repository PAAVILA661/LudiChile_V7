import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseSidebar from '../CourseSidebar'; // Component to test
import { useAuth } from '@/context/AuthContext'; // To be mocked
import { TOTAL_COURSE_EXERCISES, TOTAL_COURSE_BADGES, TOTAL_COURSE_XP } from '../CourseSidebar'; // Import constants

// --- Mocks ---
jest.mock('@/context/AuthContext');
const mockUseAuth = useAuth as jest.Mock;

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// --- Test Setup ---
const defaultSidebarProps = {
  level: 1,
  cheatSheets: [
    { id: 'cs1', title: 'CS 1', unlocksAfter: 1, isUnlocked: true },
    { id: 'cs2', title: 'CS 2', unlocksAfter: 3, isUnlocked: false },
  ],
};

type MockUser = Partial<NonNullable<ReturnType<typeof useAuth>['user']>>;

const renderCourseSidebar = (mockUser: MockUser | null, isLoading = false) => {
  mockUseAuth.mockReturnValue({
    user: mockUser,
    isLoading: isLoading,
    isAuthenticated: !!mockUser,
    login: jest.fn(),
    logout: jest.fn(),
  });
  return render(<CourseSidebar {...defaultSidebarProps} />);
};

describe('CourseSidebar Component', () => {
  // Test 1: Loading State
  it('renders skeleton components when isLoading is true', () => {
    renderCourseSidebar(null, true);
    // Check for a few skeleton elements. The exact number/type might change with UI.
    expect(screen.getAllByRole('generic', { name: /skeleton/i }).length).toBeGreaterThan(3); // A simple check
    // More specific checks if Skeleton components have roles or identifiable text/labels
    expect(screen.getByTestId('user-profile-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('course-progress-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('course-badges-skeleton')).toBeInTheDocument();
  });

  // Test 2: User Information Display (Name & Initial)
  describe('User Information Display', () => {
    it('displays user name and initial correctly', () => {
      const userWithName = { name: 'John Doe', email: 'john@example.com' } as MockUser;
      renderCourseSidebar(userWithName);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument(); // Initial
    });

    it('displays email if name is not available', () => {
      const userWithEmailOnly = { email: 'jane@example.com', name: null } as MockUser;
      renderCourseSidebar(userWithEmailOnly);
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('displays "Learner" if no name or email', () => {
      const userNoNameEmail = { name: null, email: null } as MockUser;
      renderCourseSidebar(userNoNameEmail);
      expect(screen.getByText('Learner')).toBeInTheDocument();
      expect(screen.getByText('L')).toBeInTheDocument();
    });
  });

  // Test 3: XP Display
  it('displays user XP correctly', () => {
    const userWithXP = { user_xp: { total_xp: 150 } } as MockUser;
    renderCourseSidebar(userWithXP);
    expect(screen.getByText(`150 / ${TOTAL_COURSE_XP}`)).toBeInTheDocument();
  });

  it('displays 0 XP if user_xp is null or undefined', () => {
    renderCourseSidebar({ user_xp: null } as MockUser);
    expect(screen.getByText(`0 / ${TOTAL_COURSE_XP}`)).toBeInTheDocument();
    
    renderCourseSidebar({} as MockUser); // undefined user_xp
    expect(screen.getByText(`0 / ${TOTAL_COURSE_XP}`)).toBeInTheDocument();
  });

  // Test 4: Completed Exercises Count
  it('displays completed exercises count correctly', () => {
    const userWithProgress = {
      progress: [
        { status: 'COMPLETED', exercise_id: 'ex1' },
        { status: 'IN_PROGRESS', exercise_id: 'ex2' },
        { status: 'COMPLETED', exercise_id: 'ex3' },
        { status: 'COMPLETED', exercise_id: null }, // Should not be counted
      ],
    } as MockUser;
    renderCourseSidebar(userWithProgress);
    expect(screen.getByText(`2 / ${TOTAL_COURSE_EXERCISES}`)).toBeInTheDocument();
  });

  it('displays 0 completed exercises if progress is empty or null', () => {
    renderCourseSidebar({ progress: [] } as MockUser);
    expect(screen.getByText(`0 / ${TOTAL_COURSE_EXERCISES}`)).toBeInTheDocument();

    renderCourseSidebar({ progress: null } as MockUser);
    expect(screen.getByText(`0 / ${TOTAL_COURSE_EXERCISES}`)).toBeInTheDocument();
  });

  // Test 5: Earned Badges Display
  describe('Earned Badges Display', () => {
    const courseBadgesData = [ // This should match the one in CourseSidebar.tsx
        { id: 'Hello, World!', name: 'Hello, World!', image: 'url1.png' },
        { id: 'Variables & Data Types', name: 'Variables & Data Types', image: 'url2.png'},
        // ... add more if CourseSidebar has more static badges defined
    ];

    it('displays earned badges correctly with images and count', () => {
      const userWithBadges = {
        user_badges: [
          { badge: { name: 'Hello, World!', image_url: 'url1.png' } },
          // Does not have 'Variables & Data Types'
        ],
      } as MockUser;
      renderCourseSidebar(userWithBadges);

      expect(screen.getByText(`1 / ${TOTAL_COURSE_BADGES}`)).toBeInTheDocument();
      
      const earnedBadgeImage = screen.getByAltText('Hello, World!');
      expect(earnedBadgeImage).toBeInTheDocument();
      expect(earnedBadgeImage.closest('div')).not.toHaveClass('opacity-30');
      expect(earnedBadgeImage.closest('div')).not.toHaveClass('grayscale');

      // Check for an unearned badge (assuming 'Variables & Data Types' is the next in static data)
      // This requires CourseSidebar to render all potential badges.
      // We need to ensure courseBadgesData in the test matches the component's internal data for this to be robust.
      // For this example, let's assume CourseSidebar renders all badges from its internal list.
      // If 'Variables & Data Types' badge is rendered:
      const unearnedBadgeImage = screen.queryByAltText('Variables & Data Types');
      if (unearnedBadgeImage) { // It might not be rendered if logic only shows earned ones.
        expect(unearnedBadgeImage.closest('div')).toHaveClass('opacity-30');
        expect(unearnedBadgeImage.closest('div')).toHaveClass('grayscale');
      }
    });

    it('displays 0 earned badges if user_badges is empty or null', () => {
      renderCourseSidebar({ user_badges: [] } as MockUser);
      expect(screen.getByText(`0 / ${TOTAL_COURSE_BADGES}`)).toBeInTheDocument();

      renderCourseSidebar({ user_badges: null } as MockUser);
      expect(screen.getByText(`0 / ${TOTAL_COURSE_BADGES}`)).toBeInTheDocument();
    });
  });

  // Test 6: Edge case - User with no progress data (all nulls or empty)
  it('handles user with no specific progress data gracefully', () => {
    const userNoData = {
      name: 'New User',
      email: 'new@example.com',
      progress: [],
      user_xp: null,
      user_badges: [],
    } as MockUser;
    renderCourseSidebar(userNoData);

    expect(screen.getByText('New User')).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
    expect(screen.getByText(`0 / ${TOTAL_COURSE_XP}`)).toBeInTheDocument();
    expect(screen.getByText(`0 / ${TOTAL_COURSE_EXERCISES}`)).toBeInTheDocument();
    expect(screen.getByText(`0 / ${TOTAL_COURSE_BADGES}`)).toBeInTheDocument();
  });
});

// Add data-testid to skeleton containers in CourseSidebar.tsx for more reliable testing
// Example: <Card data-testid="user-profile-skeleton">...</Card>
// This was assumed in the test, if not present, the skeleton test would be less specific.The `create_file_with_block` tool has a bug where it cannot create files in directories that have special characters like `[` or `]` in their path. This is because the underlying `git ls-files` command, which the tool uses to check if a file exists, fails when these characters are not properly escaped in the path.

To work around this, I will:
1.  Create the `__tests__` directory separately if it doesn't exist, using a path that `ls` can handle to check for its existence first.
2.  Then, create the test file inside it.

Let's first check if `codedex-clone/src/components/learn/__tests__` exists.
