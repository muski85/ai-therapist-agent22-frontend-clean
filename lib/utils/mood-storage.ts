/**
 * Mood Storage Utility
 *
 * Handles saving and retrieving mood data from localStorage
 * Similar to activity-storage but specifically for mood tracking
 */

// Define what a Mood entry looks like
export interface MoodEntry {
  id: string;              // Unique identifier
  moodScore: number;       // 0-100 scale (0 = very low, 100 = great)
  note?: string;           // Optional note about the mood
  createdAt: string;       // When it was logged
  userId?: string;         // Who logged it
}

// Key to store moods in localStorage
const STORAGE_KEY = 'lumina_moods';

/**
 * Get all mood entries
 */
export function getMoods(): MoodEntry[] {
  try {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting moods:', error);
    return [];
  }
}

/**
 * Get mood entries for today only
 */
export function getTodayMoods(): MoodEntry[] {
  const all = getMoods();
  const today = new Date().toDateString();

  return all.filter(mood => {
    const moodDate = new Date(mood.createdAt).toDateString();
    return moodDate === today;
  });
}

/**
 * Save a new mood entry
 */
export function saveMood(mood: Omit<MoodEntry, 'id' | 'createdAt'>): MoodEntry {
  try {
    const moods = getMoods();

    const newMood: MoodEntry = {
      ...mood,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    moods.push(newMood);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));

    return newMood;
  } catch (error) {
    console.error('Error saving mood:', error);
    throw error;
  }
}

/**
 * Get today's average mood score
 * Returns the score on 0-100 scale
 */
export function getTodayAverageMood(): number | null {
  const todayMoods = getTodayMoods();

  if (todayMoods.length === 0) return null;

  const sum = todayMoods.reduce((total, mood) => total + mood.moodScore, 0);
  const average = sum / todayMoods.length;

  // Round to whole number
  return Math.round(average);
}

/**
 * Get mood statistics for today
 */
export function getTodayMoodStats() {
  const todayMoods = getTodayMoods();
  const averageMood = getTodayAverageMood();

  return {
    totalEntries: todayMoods.length,
    averageMood: averageMood,
    highestMood: todayMoods.length > 0 ? Math.max(...todayMoods.map(m => m.moodScore)) : null,
    lowestMood: todayMoods.length > 0 ? Math.min(...todayMoods.map(m => m.moodScore)) : null,
  };
}

/**
 * Generate a simple unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear all moods (useful for testing)
 */
export function clearAllMoods(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
