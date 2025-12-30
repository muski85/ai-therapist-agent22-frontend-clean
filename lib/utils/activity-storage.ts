/**
 * Activity Storage Utility
 *
 * This file handles saving and retrieving activities from browser localStorage
 * Think of localStorage like a simple database that lives in your browser
 */

// Define what an Activity looks like (TypeScript interface)
export interface Activity {
  id: string;              // Unique identifier (like a serial number)
  type: string;            // Type of activity (meditation, exercise, etc.)
  name: string;            // Custom name user gives
  duration: number;        // How long in minutes
  description?: string;    // Optional notes
  completed: boolean;      // Did they finish it?
  createdAt: string;       // When it was logged
  userId?: string;         // Who logged it (for future use)
}

// Key to store activities in localStorage (like a folder name)
const STORAGE_KEY = 'lumina_activities';

/**
 * Get all activities from storage
 * Returns an array of activities
 */
export function getActivities(): Activity[] {
  try {
    // Check if we're in a browser (not server)
    if (typeof window === 'undefined') return [];

    // Get the data from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);

    // If nothing stored yet, return empty array
    if (!stored) return [];

    // Convert JSON string back to JavaScript array
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
}

/**
 * Get activities for today only
 */
export function getTodayActivities(): Activity[] {
  const all = getActivities();
  const today = new Date().toDateString();

  return all.filter(activity => {
    const activityDate = new Date(activity.createdAt).toDateString();
    return activityDate === today;
  });
}

/**
 * Save a new activity
 */
export function saveActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Activity {
  try {
    // Get existing activities
    const activities = getActivities();

    // Create new activity with ID and timestamp
    const newActivity: Activity = {
      ...activity,
      id: generateId(), // Create unique ID
      createdAt: new Date().toISOString(), // Current date/time
    };

    // Add to the list
    activities.push(newActivity);

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));

    return newActivity;
  } catch (error) {
    console.error('Error saving activity:', error);
    throw error;
  }
}

/**
 * Update an activity (mark as complete, edit, etc.)
 */
export function updateActivity(id: string, updates: Partial<Activity>): Activity | null {
  try {
    const activities = getActivities();
    const index = activities.findIndex(a => a.id === id);

    if (index === -1) return null;

    // Update the activity
    activities[index] = { ...activities[index], ...updates };

    // Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));

    return activities[index];
  } catch (error) {
    console.error('Error updating activity:', error);
    return null;
  }
}

/**
 * Delete an activity
 */
export function deleteActivity(id: string): boolean {
  try {
    const activities = getActivities();
    const filtered = activities.filter(a => a.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting activity:', error);
    return false;
  }
}

/**
 * Get statistics for today
 */
export function getTodayStats() {
  const todayActivities = getTodayActivities();
  const completed = todayActivities.filter(a => a.completed);

  return {
    total: todayActivities.length,
    completed: completed.length,
    completionRate: todayActivities.length > 0
      ? Math.round((completed.length / todayActivities.length) * 100)
      : 0, // 0% if no activities yet
    totalDuration: todayActivities.reduce((sum, a) => sum + a.duration, 0),
  };
}

/**
 * Generate a simple unique ID
 * In production, you'd use UUID library, but this works for now
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear all activities (useful for testing)
 */
export function clearAllActivities(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
