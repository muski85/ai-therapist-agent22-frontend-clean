/**
 * Therapy Session Storage Utility
 *
 * Handles saving and retrieving therapy session data from localStorage
 */

// Define what a Therapy Session looks like
export interface TherapySession {
  id: string;              // Unique identifier
  duration: number;        // Duration in minutes
  note?: string;           // Optional notes from session
  completed: boolean;      // Whether session was completed
  createdAt: string;       // When session started
  userId?: string;         // Who had the session
}

// Key to store sessions in localStorage
const STORAGE_KEY = 'lumina_therapy_sessions';

/**
 * Get all therapy sessions
 */
export function getTherapySessions(): TherapySession[] {
  try {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting therapy sessions:', error);
    return [];
  }
}

/**
 * Get therapy sessions for today only
 */
export function getTodayTherapySessions(): TherapySession[] {
  const all = getTherapySessions();
  const today = new Date().toDateString();

  return all.filter(session => {
    const sessionDate = new Date(session.createdAt).toDateString();
    return sessionDate === today;
  });
}

/**
 * Save a new therapy session
 */
export function saveTherapySession(session: Omit<TherapySession, 'id' | 'createdAt'>): TherapySession {
  try {
    const sessions = getTherapySessions();

    const newSession: TherapySession = {
      ...session,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

    return newSession;
  } catch (error) {
    console.error('Error saving therapy session:', error);
    throw error;
  }
}

/**
 * Get therapy statistics for today
 */
export function getTodayTherapyStats() {
  const todaySessions = getTodayTherapySessions();
  const completedSessions = todaySessions.filter(s => s.completed);

  return {
    totalSessions: todaySessions.length,
    completedSessions: completedSessions.length,
    totalDuration: todaySessions.reduce((sum, s) => sum + s.duration, 0),
  };
}

/**
 * Get all-time therapy statistics
 */
export function getAllTimeTherapyStats() {
  const allSessions = getTherapySessions();
  const completedSessions = allSessions.filter(s => s.completed);

  return {
    totalSessions: completedSessions.length,
    totalDuration: completedSessions.reduce((sum, s) => sum + s.duration, 0),
  };
}

/**
 * Generate a simple unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear all therapy sessions (useful for testing)
 */
export function clearAllTherapySessions(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
