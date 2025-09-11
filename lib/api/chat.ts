// lib/api/chat.ts
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
    analysis?: {
      emotionalState: string;
      themes: string[];
      riskLevel: number;
      recommendedApproach: string;
      progressIndicators: string[];
    };
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  topic?: string; // ← NEW: AI-generated topic
}

export interface ApiResponse {
  message: string;
  response?: string;
  analysis?: {
    emotionalState: string;
    themes: string[];
    riskLevel: number;
    recommendedApproach: string;
    progressIndicators: string[];
  };
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
  };
}

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:3001";

// Enhanced auth token retrieval with debugging
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check for token in multiple possible keys
  const possibleTokenKeys = ['token', 'authToken', 'auth_token', 'jwt_token', 'access_token'];
  
  for (const key of possibleTokenKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      // //console.log(`🔑 Found auth token with key: ${key}`);
      return token;
    }
  }
  
  //console.warn('⚠️ No auth token found in localStorage');
  return null;
};

// Enhanced auth headers with better debugging
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  // console.log('📡 Request headers:', {
    // 'Content-Type': headers['Content-Type'],
    //'Authorization': token ? 'Bearer [TOKEN_PRESENT]' : '[NO_TOKEN]'
  // });
  
  return headers;
};

// CORRECTED handleResponseError FUNCTION with auth-specific handling
const handleResponseError = async (response: Response, functionName: string) => {
  const errorDetails = `Status: ${response.status}, StatusText: ${response.statusText}`;
  //console.error(`🔴 API Error in ${functionName}: ${errorDetails}`);

  // Handle auth errors specifically
  if (response.status === 401) {
    //console.error('🚨 Authentication Error: Token may be missing, expired, or invalid');
    
    // Check what token we're currently using
    const currentToken = getAuthToken();
    if (!currentToken) {
      //console.error('❌ No authentication token found. Please log in.');
    } else {
      //console.error('❌ Authentication token is present but invalid. Token may be expired.');
      // Optionally clear the invalid token
      // localStorage.removeItem('token');
    }
  }

  // Read the body as text first to avoid 'body stream already read' error
  let errorText = "";
  try {
    errorText = await response.text();
  } catch (err) {
    //console.error("Failed to read response body text.", err);
    throw new Error(
      `Failed to complete API call: ${errorDetails}. Could not read response body.`
    );
  }

  // Try to parse the text as JSON
  try {
    const errorData = JSON.parse(errorText);
    const errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
    //console.error("Parsed error data:", errorMessage);
    
    // Throw specific error messages for auth issues
    if (response.status === 401) {
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
    
    throw new Error(errorMessage);
  } catch (parseError) {
    // If JSON parsing fails, the raw text is the error
    //console.error("Could not parse JSON. Raw response body:", errorText);
    
    if (response.status === 401) {
      throw new Error(`Authentication failed: ${errorText.substring(0, 100)}`);
    }
    
    throw new Error(
      `Unexpected server response: ${errorText.substring(0, 100)}...`
    );
  }
};

// Add a function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Add a function to debug authentication
// export const debugAuth = () => {
  //console.log('🔧 Authentication Debug:');
  //console.log('- Token present:', isAuthenticated());
  //console.log('- API Base URL:', API_BASE);
  
  // if (typeof window !== 'undefined') {
//     console.log('- localStorage keys:', Object.keys(localStorage));
//     console.log('- Possible token keys found:', 
//       ['token', 'authToken', 'auth_token', 'jwt_token', 'access_token']
//         .filter(key => localStorage.getItem(key))
//     );
//   }
// };

// ========== NEW: AI TOPIC GENERATION FUNCTION ==========
/**
 * Generate a topic for a chat session based on the messages
 */
const generateTopicFromMessages = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Take first few messages to get context
    const contextMessages = messages.slice(0, 6).map(msg => ({
      role: msg.role,
      content: msg.content.substring(0, 200) // Limit content length
    }));

    //console.log("🤖 Generating topic for messages:", contextMessages);

    if (!isAuthenticated()) {
      throw new Error('No authentication token found.');
    }

    const response = await fetch(`${API_BASE}/chat/generate-topic`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ messages: contextMessages }),
    });

    if (!response.ok) {
      await handleResponseError(response, "generateTopicFromMessages");
    }

    const data = await response.json();
    //console.log("✅ Generated topic:", data.topic);
    return data.topic || "General Discussion";
  } catch (error) {
    //console.error("❌ Error generating topic:", error);
    // Fallback to simple topic generation
    return generateSimpleTopic(messages);
  }
};

/**
 * Fallback simple topic generation (client-side)
 */
const generateSimpleTopic = (messages: ChatMessage[]): string => {
  if (!messages.length) return "New Chat";
  
  const userMessages = messages.filter(msg => msg.role === "user");
  if (!userMessages.length) return "New Chat";
  
  const firstMessage = userMessages[0].content.toLowerCase();
  
  // Simple keyword matching
  const topicMap: Record<string, string> = {
    'anxiety': '💭 Anxiety Support',
    'stress': '😰 Stress Management',
    'sleep': '😴 Sleep Issues',
    'depression': '🌧️ Depression Support',
    'work': '💼 Work-Life Balance',
    'relationship': '💕 Relationship Help',
    'panic': '⚡ Panic Management',
    'overwhelmed': '🌊 Feeling Overwhelmed',
    'sad': '😢 Emotional Support',
    'angry': '😡 Anger Management',
    'lonely': '🤗 Loneliness Support',
    'confidence': '💪 Building Confidence',
  };
  
  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (firstMessage.includes(keyword)) {
      return topic;
    }
  }
  
  // Default fallback
  const words = firstMessage.split(' ').slice(0, 3).join(' ');
  return `💬 ${words.charAt(0).toUpperCase() + words.slice(1)}`;
};

// ========== UPDATED FUNCTIONS ==========

export const createChatSession = async (): Promise<string> => {
  try {
    //console.log("🆕 Creating new chat session...");
    
    // Check auth before making request
    if (!isAuthenticated()) {
      throw new Error('No authentication token found. Please log in first.');
    }
    
    const response = await fetch(`${API_BASE}/chat/sessions`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleResponseError(response, "createChatSession");
    }

    const data = await response.json();
    //console.log("✅ Chat session created:", data);
    return data.sessionId;
  } catch (error) {
    //console.error("❌ Error creating chat session:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  try {
    //console.log(`💬 Sending message to session ${sessionId}:`, message);
    
    // Check auth before making request
    if (!isAuthenticated()) {
      throw new Error('No authentication token found. Please log in first.');
    }
    
    const response = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      await handleResponseError(response, "sendChatMessage");
    }

    const data = await response.json();
    //console.log("✅ Message sent successfully:", data);
    return data;
  } catch (error) {
    //console.error("❌ Error sending chat message:", error);
    throw error;
  }
};

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  try {
    //console.log(`📜 Fetching chat history for session ${sessionId}`);
    
    // Check auth before making request
    if (!isAuthenticated()) {
      throw new Error('No authentication token found. Please log in first.');
    }
    
    const response = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/history`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      await handleResponseError(response, "getChatHistory");
    }

    const data = await response.json();
    //console.log("✅ Received chat history:", data);

    if (!Array.isArray(data)) {
      //console.error("Invalid chat history format:", data);
      throw new Error("Invalid chat history format");
    }

    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      metadata: msg.metadata,
    }));
  } catch (error) {
    //console.error("❌ Error fetching chat history:", error);
    throw error;
  }
};

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  try {
    //console.log("📋 Fetching all chat sessions...");
    
    // Check auth before making request
    if (!isAuthenticated()) {
      //console.warn('⚠️ No authentication token found, returning empty sessions array');
      return []; // Return empty array instead of throwing error for better UX
    }
    
    const response = await fetch(`${API_BASE}/chat/sessions`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleResponseError(response, "getAllChatSessions");
    }

    const data = await response.json();
    //console.log("✅ Received chat sessions:", data);
    //console.log("📊 Sessions data type:", typeof data, "Array?", Array.isArray(data));
    //console.log("📊 Sessions length:", Array.isArray(data) ? data.length : 'N/A');

    // Handle different possible response formats
    const sessionsArray = Array.isArray(data) ? data : (data.sessions || data.data || []);
    
    if (!Array.isArray(sessionsArray)) {
      //console.warn("⚠️ Sessions data is not an array, returning empty array");
      return [];
    }

    return sessionsArray.map((session: any) => {
      const createdAt = new Date(session.createdAt || Date.now());
      const updatedAt = new Date(session.updatedAt || Date.now());

      return {
        ...session,
        createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
        topic: session.topic, // ← NEW: Include topic from backend
        messages: (session.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || Date.now()),
        })),
      };
    });
  } catch (error) {
    //console.error("❌ Error fetching chat sessions:", error);
    
    // For auth errors, return empty array instead of throwing
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Authentication failed') || 
        errorMessage.includes('No authentication token')) {
      //console.warn('⚠️ Authentication issue, returning empty sessions array');
      return [];
    }
    
    throw error;
  }
};
// Add this function to your lib/api/chat.ts file:

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  try {
    //console.log(`🗑️ Deleting chat session: ${sessionId}`);
    
    // Check auth before making request
    if (!isAuthenticated()) {
      throw new Error('No authentication token found. Please log in first.');
    }
    
    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleResponseError(response, "deleteChatSession");
    }

    const data = await response.json();
    //console.log("✅ Session deleted successfully:", data);
  } catch (error) {
    //console.error("❌ Error deleting chat session:", error);
    throw error;
  }
};

// ========== NEW: TOPIC GENERATION HELPER ==========
/**
 * Generate and update topic for a session after enough messages
 * Call this after sending a few messages (3-4 messages)
 */
export const generateAndUpdateTopic = async (
  sessionId: string,
  messages: ChatMessage[]
): Promise<string | null> => {
  try {
    // Only generate topic after we have enough context (3+ messages)
    if (messages.length < 3) {
      return null;
    }

    // Check if topic already exists
    const sessions = await getAllChatSessions();
    const currentSession = sessions.find(s => s.sessionId === sessionId);
    if (currentSession?.topic) {
      //console.log("📝 Topic already exists:", currentSession.topic);
      return currentSession.topic;
    }

    //console.log("🎯 Generating topic for session:", sessionId);
    const topic = await generateTopicFromMessages(messages);

    // Update the session with the new topic
    if (!isAuthenticated()) {
      throw new Error('No authentication token found.');
    }

    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}/topic`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      //console.warn("⚠️ Failed to update topic on server, using client-side topic");
      return topic; // Still return the generated topic even if update fails
    }

    //console.log("✅ Topic updated successfully:", topic);
    return topic;
  } catch (error) {
    //console.error("❌ Error generating/updating topic:", error);
    return null;
  }
};

// Helper function to handle login redirect or token refresh
export const handleAuthError = () => {
  //console.log('🔄 Handling authentication error...');
  
  // Clear invalid token
  if (typeof window !== 'undefined') {
    ['token', 'authToken', 'auth_token', 'jwt_token', 'access_token'].forEach(key => {
      if (localStorage.getItem(key)) {
        //console.log(`🗑️ Clearing potentially invalid token: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }
  
  // You can add redirect logic here
  // window.location.href = '/login';
};