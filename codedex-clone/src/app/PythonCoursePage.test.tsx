import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PythonCoursePage from './(routes)/python/page'; // Adjusted import path
import { useAuth } from '@/context/AuthContext'; // To be mocked
import { courseChaptersData } from './(routes)/python/page'; // Adjusted import path

// --- Mocks ---
jest.mock('@/context/AuthContext');
const mockUseAuth = useAuth as jest.Mock;

// Mock child components
jest.mock('@/components/learn/CourseHeader', () => () => <div data-testid="mock-course-header">Mocked CourseHeader</div>);
jest.mock('@/components/learn/CourseSidebar', () => () => <div data-testid="mock-course-sidebar">Mocked CourseSidebar</div>);
jest.mock('@/components/learn/CourseProjects', () => () => <div data-testid="mock-course-projects">Mocked CourseProjects</div>);

// Mock CourseChapter to inspect its props
const mockCourseChapter = jest.fn();
jest.mock('@/components/learn/CourseChapter', () => (props: any) => {
  mockCourseChapter(props);
  // Render something simple or a testid to confirm it's there
  return <div data-testid={`mock-course-chapter-${props.number}`} className="mock-chapter-class">{props.title}</div>;
});

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: {className?: string, [key: string]: any}) => <div {...props} className={`mock-skeleton ${className || ''}`} data-testid="mock-skeleton" />
}));


// --- Test Setup ---
type AuthenticatedUser = NonNullable<ReturnType<typeof useAuth>['user']>;

const renderPythonPage = (mockUser: Partial<AuthenticatedUser> | null, isLoading = false) => {
  const baseUserMock: AuthenticatedUser = {
      id: 'user1', name: 'Test User', email: 'test@example.com', role: 'USER', 
      created_at: new Date(), updated_at: new Date(), github_id: null,
      progress: [], user_xp: { userId:'user1', total_xp: 0 }, user_badges: [],
  };
  
  const effectiveUser = mockUser ? { ...baseUserMock, ...mockUser } : null;

  mockUseAuth.mockReturnValue({
    user: effectiveUser,
    isLoading: isLoading,
    isAuthenticated: !!effectiveUser,
    login: jest.fn(), 
    logout: jest.fn(), 
  });
  mockCourseChapter.mockClear(); 
  return render(<PythonCoursePage />);
};

describe('PythonCoursePage Component (Test File in src/app)', () => {
  // Test 1: Loading State
  it('renders skeleton components for chapters when isLoading is true', () => {
    renderPythonPage(null, true);
    expect(screen.queryByTestId('mock-course-chapter-1')).not.toBeInTheDocument();
    const skeletons = screen.getAllByTestId("mock-skeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(courseChaptersData.length); 
  });

  // Test 2: User Progress Display
  describe('User Progress Display in Chapters', () => {
    const mockUserWithProgress: Partial<AuthenticatedUser> = {
      id: 'user123',
      name: 'Progress User',
      progress: [
        { userId: 'user123', exerciseId: 'exSettings', status: 'COMPLETED', completed_at: new Date(), exercise: { slug: '01-setting-up', id: 'exSettings', title: 'Setting Up', xp_value: 5, chapterId: 'ch1' } },
        { userId: 'user123', exerciseId: 'exDataTypes', status: 'COMPLETED', completed_at: new Date(), exercise: { slug: '06-data-types', id: 'exDataTypes', title: 'Data Types', xp_value: 5, chapterId: 'ch2' } },
        { userId: 'user123', exerciseId: 'exHelloWorld', status: 'IN_PROGRESS', completed_at: null, exercise: { slug: '02-hello-world', id: 'exHelloWorld', title: 'Hello World', xp_value: 5, chapterId: 'ch1' } },
      ],
    };

    it('passes correct isCompleted status to CourseChapter exercises', () => {
      renderPythonPage(mockUserWithProgress, false);

      expect(screen.getByTestId('mock-course-sidebar')).toBeInTheDocument(); 
      expect(screen.getByTestId('mock-course-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-course-projects')).toBeInTheDocument();

      const chapter1Props = mockCourseChapter.mock.calls.find(call => call[0].number === 1);
      expect(chapter1Props).toBeDefined();
      const chapter1Exercises = chapter1Props[0].exercises;
      expect(chapter1Exercises.find((ex: any) => ex.slug === '01-setting-up').isCompleted).toBe(true);
      expect(chapter1Exercises.find((ex: any) => ex.slug === '02-hello-world').isCompleted).toBe(false);
      expect(chapter1Exercises.find((ex: any) => ex.slug === '03-pattern').isCompleted).toBe(false);

      const chapter2Props = mockCourseChapter.mock.calls.find(call => call[0].number === 2);
      expect(chapter2Props).toBeDefined();
      const chapter2Exercises = chapter2Props[0].exercises;
      expect(chapter2Exercises.find((ex: any) => ex.slug === '06-data-types').isCompleted).toBe(true);
      expect(chapter2Exercises.find((ex: any) => ex.slug === '07-temperature').isCompleted).toBe(false);
      
      courseChaptersData.forEach(chapter => {
        const chapterElement = screen.getByTestId(`mock-course-chapter-${chapter.number}`);
        expect(within(chapterElement).getByText(chapter.title)).toBeInTheDocument();
      });
    });

    it('handles user with no progress (all exercises incomplete)', () => {
      const userNoProgress: Partial<AuthenticatedUser> = {
        id: 'user456',
        name: 'No Progress User',
        progress: [], 
      };
      renderPythonPage(userNoProgress, false);

      const chapter1Props = mockCourseChapter.mock.calls.find(call => call[0].number === 1);
      expect(chapter1Props).toBeDefined();
      chapter1Props[0].exercises.forEach((ex: any) => {
        if (ex.slug) { 
          expect(ex.isCompleted).toBe(false);
        }
      });
    });
  });
  
  // Test 3: Rendering all static parts
  it('renders all chapters defined in courseChaptersData when not loading', () => {
    renderPythonPage(null, false); 
    courseChaptersData.forEach(chapter => {
      const chapterElement = screen.getByTestId(`mock-course-chapter-${chapter.number}`);
      expect(within(chapterElement).getByText(chapter.title)).toBeInTheDocument();
    });
  });
});
