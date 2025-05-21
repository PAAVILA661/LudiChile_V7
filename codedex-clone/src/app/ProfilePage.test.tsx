import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './(routes)/profile/page'; // Adjusted import path
import { useAuth } from '@/context/AuthContext'; // To be mocked
import { useRouter } from 'next/navigation'; // To be mocked

// --- Mocks ---
jest.mock('@/context/AuthContext');
const mockUseAuth = useAuth as jest.Mock;

jest.mock('next/navigation');
const mockUseRouter = useRouter as jest.Mock;

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

// --- Test Setup ---
type AuthenticatedUser = NonNullable<ReturnType<typeof useAuth>['user']>;
const mockPush = jest.fn();

const renderProfilePage = (
  mockUser: Partial<AuthenticatedUser> | null, 
  isLoading = false, 
  isAuthenticated = !!mockUser
) => {
  const baseUserMock: AuthenticatedUser = {
      id: 'user1', name: 'Test User', email: 'test@example.com', role: 'USER', 
      created_at: new Date('2023-01-01T10:00:00Z'), 
      updated_at: new Date('2023-01-02T10:00:00Z'), 
      github_id: null,
      progress: [], 
      user_xp: { userId:'user1', total_xp: 0 }, 
      user_badges: [],
  };
  
  const effectiveUser = mockUser ? { ...baseUserMock, ...mockUser } : null;

  mockUseAuth.mockReturnValue({
    user: effectiveUser,
    isLoading: isLoading,
    isAuthenticated: isAuthenticated,
    login: jest.fn(), 
    logout: jest.fn(), 
  });
  mockUseRouter.mockReturnValue({
    push: mockPush,
    // Add other router methods if used by the component
  });
  mockPush.mockClear(); // Clear push mock calls before each render
  return render(<ProfilePage />);
};

describe('ProfilePage Component (Test File in src/app)', () => {
  // Test 1: Loading State
  it('displays loading message when isLoading is true', () => {
    renderProfilePage(null, true, false);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  // Test 2: Redirect if not authenticated
  it('redirects to login if not authenticated and not loading', async () => {
    renderProfilePage(null, false, false);
    // The component itself returns null if !isAuthenticated, useEffect handles redirect.
    // We check if push was called by the useEffect hook.
    await waitFor(() => { // useEffect runs after initial render
        expect(mockPush).toHaveBeenCalledWith('/login?redirect=/profile');
    });
  });
  
  // Test 3: User Information Display
  describe('User Information Display', () => {
    const testUser: Partial<AuthenticatedUser> = {
      id: 'userTest1',
      name: 'Alice Wonderland',
      email: 'alice@wonderland.com',
      role: 'ADMIN',
      created_at: new Date('2022-05-10T12:00:00Z'),
      user_xp: { userId: 'userTest1', total_xp: 1250 },
      progress: [
        { userId: 'userTest1', exerciseId: 'ex1', status: 'COMPLETED', completed_at: new Date(), exercise: { id:'ex1', slug:'s1', title:'T1', xp_value:10, chapterId:'c1'}},
        { userId: 'userTest1', exerciseId: 'ex2', status: 'COMPLETED', completed_at: new Date(), exercise: { id:'ex2', slug:'s2', title:'T2', xp_value:10, chapterId:'c1'}},
        { userId: 'userTest1', exerciseId: 'exNull', status: 'COMPLETED', completed_at: new Date(), exercise_id: null, exercise: null } // Progress without exercise_id
      ],
      user_badges: [
        { userId: 'userTest1', badge_id: 'badge1', assigned_at: new Date(), badge: { id: 'badge1', name: 'Pioneer', image_url: 'pioneer.png', description: 'Desc1' } },
        { userId: 'userTest1', badge_id: 'badge2', assigned_at: new Date(), badge: { id: 'badge2', name: 'Achiever', image_url: 'achiever.png', description: 'Desc2' } },
      ],
    };

    beforeEach(() => {
      renderProfilePage(testUser, false, true);
    });

    it('displays user name, email, role, and join date', () => {
      expect(screen.getByText(testUser.name!)).toBeInTheDocument();
      expect(screen.getByText(testUser.email!)).toBeInTheDocument();
      expect(screen.getByText(testUser.role!)).toBeInTheDocument();
      expect(screen.getByText(new Date(testUser.created_at!).toLocaleDateString())).toBeInTheDocument();
    });

    it('displays total XP correctly', () => {
      expect(screen.getByText(`${testUser.user_xp!.total_xp} XP`)).toBeInTheDocument();
    });

    it('displays completed exercises count correctly (ignoring those with null exercise_id)', () => {
      // user has 3 progress items, but one has exercise_id: null. So, 2 completed.
      expect(screen.getByText('2')).toBeInTheDocument(); // Just the number
      expect(screen.getByText('Exercises Completed:')).toBeInTheDocument();
    });

    it('displays earned badges with names and images', () => {
      expect(screen.getByText('My Badges')).toBeInTheDocument();
      
      const badge1Name = screen.getByText('Pioneer');
      const badge1Image = screen.getByAltText('Pioneer');
      expect(badge1Name).toBeInTheDocument();
      expect(badge1Image).toBeInTheDocument();
      expect(badge1Image).toHaveAttribute('src', 'pioneer.png');

      const badge2Name = screen.getByText('Achiever');
      const badge2Image = screen.getByAltText('Achiever');
      expect(badge2Name).toBeInTheDocument();
      expect(badge2Image).toBeInTheDocument();
      expect(badge2Image).toHaveAttribute('src', 'achiever.png');
    });
  });

  // Test 4: No Badges Earned
  it('displays "no badges earned" message if user has no badges', () => {
    const userNoBadges: Partial<AuthenticatedUser> = {
      user_badges: [],
    };
    renderProfilePage(userNoBadges, false, true);
    expect(screen.getByText('No badges earned yet. Keep learning to unlock them!')).toBeInTheDocument();
  });
  
  // Test 5: Handles user with minimal data (e.g. only email, no XP/progress/badges)
  it('handles user with minimal data gracefully', () => {
    const minimalUser: Partial<AuthenticatedUser> = {
      id: 'minUser',
      email: 'minimal@example.com',
      name: null, // No name
      role: 'USER',
      created_at: new Date('2024-01-01T00:00:00Z'),
      user_xp: null, // No XP record
      progress: [],  // No progress
      user_badges: [] // No badges
    };
    renderProfilePage(minimalUser, false, true);

    expect(screen.getByText('minimal@example.com')).toBeInTheDocument();
    expect(screen.getByText('Not set')).toBeInTheDocument(); // For name
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText(new Date('2024-01-01T00:00:00Z').toLocaleDateString())).toBeInTheDocument();
    
    expect(screen.getByText('Total XP:')).toBeInTheDocument();
    expect(screen.getByText('0 XP')).toBeInTheDocument(); // XP defaults to 0

    expect(screen.getByText('Exercises Completed:')).toBeInTheDocument();
    expect(screen.getAllByText('0')[1]).toBeInTheDocument(); // Completed exercises defaults to 0 (the first 0 is for XP)
    
    expect(screen.getByText('No badges earned yet. Keep learning to unlock them!')).toBeInTheDocument();
  });
});
