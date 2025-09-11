"use client";
//STOP321
import { use, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// 1. Add this import at the top with your other imports:
import { generateAndUpdateTopic } from "@/lib/api/chat";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  X,
  Trophy,
  Star,
  Clock,
  Smile,
  PlusCircle,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  Variants,
  animate,
  scale,
} from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BreathingGame } from "@/app/components/games/breathing-games";
import { ZenGarden } from "@/app/components/games/zen-garden";
import { ForestGame } from "@/app/components/games/forest-game";
import { OceanWaves } from "@/app/components/games/ocean-waves";
import { div } from "framer-motion/client";
import { Badge } from "@/components/ui/badge";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
  deleteChatSession,
} from "@/lib/api/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Wind, Flower2, TreePine, Waves } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface StressPrompt {
  trigger: string;
  activity: {
    type: "breathing" | "garden" | "forest" | "waves";
    title: string;
    description: string;
  };
}
interface ApiResponse {
  message: string;
  metadata: {
    technique: string;
    goal: string;
    progress: any[];
  };
}
const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];
const glowAnimation: Variants = {
  initial: {
    opacity: 0.5,
    scale: 1,
  },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};
const COMPLETION_THRESHOLD = 5;

export default function TherapyPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [stressPrompt, setStressPrompt] = useState<StressPrompt | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showNFTCelebration, setShowNFTCelebration] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionTopics, setSessionTopics] = useState<Record<string, string>>(
    {}
  );
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  
  // FIXED: These state variables are now properly uncommented and integrated
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<'breathing' | 'garden' | 'forest' | 'waves' | null>(null);
  const [originalStressMessage, setOriginalStressMessage] = useState<string>("");

  // Stress Prompt Modal Component - FIXED: Now properly integrated
  const StressPromptModal = ({ 
    stressPrompt, 
    onStartActivity, 
    onContinueChat, 
    onClose 
  }: {
    stressPrompt: StressPrompt;
    onStartActivity: () => void;
    onContinueChat: () => void;
    onClose: () => void;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Take a Mindful Moment</h3>
              <p className="text-sm text-muted-foreground">
                I noticed you mentioned "{stressPrompt.trigger}". A quick calming activity might help.
              </p>
            </div>

            <Card className="text-left">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {stressPrompt.activity.type === 'breathing' && <Wind className="w-5 h-5 text-blue-500" />}
                    {stressPrompt.activity.type === 'garden' && <Flower2 className="w-5 h-5 text-rose-500" />}
                    {stressPrompt.activity.type === 'forest' && <TreePine className="w-5 h-5 text-green-500" />}
                    {stressPrompt.activity.type === 'waves' && <Waves className="w-5 h-5 text-cyan-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{stressPrompt.activity.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stressPrompt.activity.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={onStartActivity} className="flex-1" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Activity
              </Button>
              <Button onClick={onContinueChat} variant="outline" className="flex-1" size="sm">
                Continue Chat
              </Button>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // FIXED: Game Rendering Function - now properly implemented
  const renderGameComponent = () => {
    if (!selectedGameType) return null;
    
    switch (selectedGameType) {
      case 'breathing':
        return <BreathingGame />;
      case 'garden':
        return <ZenGarden />;
      case 'forest':
        return <ForestGame />;
      case 'waves':
        return <OceanWaves />;
      default:
        return null;
    }
  };

  // FIXED: Added the missing handler functions for the stress prompt modal
  const handleStartActivity = () => {
    if (stressPrompt) {
      setSelectedGameType(stressPrompt.activity.type);
      setShowGameModal(true);
      setStressPrompt(null);
      setIsChatPaused(true); // Pause chat while playing game
    }
  };

  const handleContinueChat = async () => {
    if (originalStressMessage && sessionId) {
      setStressPrompt(null);
      // Continue with the original message processing
      await sendMessageWithSession(sessionId, originalStressMessage, true); // Added skipStressCheck flag
    }
  };

  const handleCloseStressPrompt = () => {
    setStressPrompt(null);
    setOriginalStressMessage("");
  };

  const handleCloseGameModal = () => {
    setShowGameModal(false);
    setSelectedGameType(null);
    setIsChatPaused(false); // Resume chat
    
    // Optionally continue processing the original message after game
    if (originalStressMessage && sessionId) {
      sendMessageWithSession(sessionId, originalStressMessage, true);
      setOriginalStressMessage("");
    }
  };

  // Corrected and simplified session initialization logic
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      const urlSessionId = params.sessionId as string;

      if (!urlSessionId || urlSessionId === "new") {
        setSessionId(null);
        setMessages([]);
        setIsLoading(false);
        return;
      }

      try {
        // console.log("Loading existing session:", urlSessionId);
        const history = await getChatHistory(urlSessionId);
        setMessages(
          history.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
        setSessionId(urlSessionId);
      } catch (error) {
        console.error("Failed to load existing session:", error);
        setMessages([
          {
            role: "assistant",
            content:
              "Sorry, I couldn't load this chat. Please start a new session.",
            timestamp: new Date(),
          },
        ]);
        setSessionId(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [params.sessionId]);

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const newSessionId = await createChatSession();
      setSessionId(newSessionId);
      setMessages([]);
      router.push(`/therapy/${newSessionId}`);
    } catch (error) {
      console.error("Failed to create new session:", error);
      setAuthError("Failed to create a new session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load all chat sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllChatSessions();
        setSessions(allSessions);
      } catch (error) {
        console.error(
          "🚨 Failed to load sessions! The server might be down or the API endpoint is incorrect.",
          error
        );
        if (error instanceof SyntaxError) {
          console.error(
            "JSON Parsing Error: The server likely returned an HTML error page (like a 404 or 500) instead of JSON. Check the network tab for the server's response."
          );
        } else if (
          error instanceof TypeError &&
          error.message.includes("fetch")
        ) {
          console.error(
            "Network Error: The server URL might be wrong or the server is not running."
          );
        }
        setSessions([]);
      }
    };
    loadSessions();
  }, [messages, sessionId]); // Added sessionId as a dependency

  useEffect(() => {
    setMounted(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();

    if (!currentMessage || isTyping || isChatPaused) {
      // console.log("Submission blocked:", {
      //   noMessage: !currentMessage,
      //   isTyping,
      //   isChatPaused,
      // });
      return;
    }

    if (!sessionId) {
      // console.log("No session ID, creating new session...");
      try {
        const newSessionId = await createChatSession();
        setSessionId(newSessionId);
        window.history.replaceState(null, "", `/therapy/${newSessionId}`);
        await sendMessageWithSession(newSessionId, currentMessage);
      } catch (error) {
        console.error("Failed to create session for message:", error);
        setAuthError("Failed to send message. Please try again.");
        return;
      }
    } else {
      await sendMessageWithSession(sessionId, currentMessage);
    }
  };

  // FIXED: Updated sendMessageWithSession function with proper stress detection integration
  const sendMessageWithSession = async (
    sessionIdToUse: string,
    messageContent: string,
    skipStressCheck = false // Add flag to skip stress check when continuing after modal
  ) => {
    setMessage("");
    setIsTyping(true);

    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: messageContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // FIXED: Only check for stress if not skipping
      if (!skipStressCheck) {
        const stressCheck = detectStressSignals(messageContent);
        if (stressCheck) {
          setStressPrompt(stressCheck);
          setOriginalStressMessage(messageContent);
          setIsTyping(false);
          return;
        }
      }

      const response = await sendChatMessage(sessionIdToUse, messageContent);
      const aiResponse =
        typeof response === "string" ? JSON.parse(response) : response;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          aiResponse.response ||
          aiResponse.message ||
          "I'm here to support you. Could you tell me more about what's on your mind?",
        timestamp: new Date(),
        metadata: {
          analysis: aiResponse.analysis || {
            emotionalState: "neutral",
            riskLevel: 0,
            themes: [],
            recommendedApproach: "supportive",
          },
          technique: aiResponse.metadata?.technique || "supportive",
          goal: aiResponse.metadata?.currentGoal || "Provide support",
          progress: aiResponse.metadata?.progress || {
            emotionalState: "neutral",
            riskLevel: 0,
          },
        },
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // Generate topic after 3-6 messages (but only once)
      if (updatedMessages.length >= 3 && updatedMessages.length <= 6) {
        try {
          const generatedTopic = await generateAndUpdateTopic(
            sessionIdToUse,
            updatedMessages
          );
          if (generatedTopic) {
            // console.log("Generated topic:", generatedTopic);
            setSessionTopics((prev) => ({
              ...prev,
              [sessionIdToUse]: generatedTopic,
            }));
          }
        } catch (error) {
          console.error("Failed to generate topic:", error);
          // Continue normally even if topic generation fails
        }
      }

      scrollToBottom();
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // FIXED: Stress detection function - properly integrated
  const detectStressSignals = (message: string): StressPrompt | null => {
    const stressKeywords = [
      // Crisis/severe
      "panic attack", "can't breathe", "chest pain", "heart racing",
      "want to hurt myself", "thinking about suicide", "end it all",
      "can't go on", "want to die", "complete breakdown",
      "losing my mind", "can't cope anymore", "everything is falling apart",
      
      // Moderate stress (add these for better coverage)
      "stressed out", "overwhelmed", "anxious", "worried sick",
      "can't handle", "too much pressure", "breaking down",
      "panic", "anxiety", "stress", "nervous", "tense"
    ];

    const lowercaseMsg = message.toLowerCase();
    const foundKeyword = stressKeywords.find((keyword) =>
      lowercaseMsg.includes(keyword)
    );
    
    if (foundKeyword) {
      const activities = [
        {
          type: "breathing" as const,
          title: "Breathing Exercise",
          description: "Follow calming breathing exercises with visual guidance",
        },
        {
          type: "garden" as const,
          title: "Zen Garden",
          description: "Create and maintain your digital peaceful space",
        },
        {
          type: "forest" as const,
          title: "Mindful Forest",
          description: "Take a peaceful walk through a virtual forest",
        },
        {
          type: "waves" as const,
          title: "Ocean Waves",
          description: "Match your breath with gentle ocean waves",
        },
      ];
      return {
        trigger: foundKeyword,
        activity: activities[Math.floor(Math.random() * activities.length)],
      };
    }
    return null;
  };

  const handleSuggestedQuestion = async (text: string) => {
    setMessage(text);

    setTimeout(async () => {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;

      await handleSubmit(fakeEvent);
    }, 0);
  };

  const handleCompleteSession = async () => {
    if (isCompletingSession) return;
    setIsCompletingSession(true);
    try {
      setShowNFTCelebration(true);
    } catch (error) {
      console.error("Error completing session:", error);
    } finally {
      setIsCompletingSession(false);
    }
  };

  const handleSessionSelect = async (selectedSessionId: string) => {
    if (selectedSessionId === sessionId) return;

    try {
      setIsLoading(true);
      const history = await getChatHistory(selectedSessionId);
      if (Array.isArray(history)) {
        const formattedHistory = history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedHistory);
        setSessionId(selectedSessionId);
        window.history.pushState({}, "", `/therapy/${selectedSessionId}`);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add this delete handler function:
  const handleDeleteSession = async (
    sessionIdToDelete: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent selecting the session when clicking delete

    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingSessionId(sessionIdToDelete);

      await deleteChatSession(sessionIdToDelete);

      // Remove session from local state
      setSessions((prev) =>
        prev.filter((s) => s.sessionId !== sessionIdToDelete)
      );

      // If we're currently viewing the deleted session, redirect to new session
      if (sessionId === sessionIdToDelete) {
        setSessionId(null);
        setMessages([]);
        router.push("/therapy/new");
      }

      // console.log("Session deleted successfully");
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session. Please try again.");
    } finally {
      setDeletingSessionId(null);
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* FIXED: Stress Prompt Modal - now properly rendered */}
      <AnimatePresence>
        {stressPrompt && (
          <StressPromptModal
            stressPrompt={stressPrompt}
            onStartActivity={handleStartActivity}
            onContinueChat={handleContinueChat}
            onClose={handleCloseStressPrompt}
          />
        )}
      </AnimatePresence>

      {/* FIXED: Game Modal - now properly rendered */}
      <Dialog open={showGameModal} onOpenChange={setShowGameModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              {selectedGameType === 'breathing' && <Wind className="w-5 h-5 text-blue-500" />}
              {selectedGameType === 'garden' && <Flower2 className="w-5 h-5 text-rose-500" />}
              {selectedGameType === 'forest' && <TreePine className="w-5 h-5 text-green-500" />}
              {selectedGameType === 'waves' && <Waves className="w-5 h-5 text-cyan-500" />}
              Mindfulness Activity
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {renderGameComponent()}
          </div>
          <div className="p-4 border-t">
            <Button onClick={handleCloseGameModal} className="w-full">
              Complete Activity & Return to Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Error Banner */}
      {authError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <X className="w-5 h-5" />
            <div>
              <p className="font-medium">Authentication Error</p>
              <p className="text-sm">{authError}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                onClick={() => {
                  setAuthError(null);
                  // console.log("Redirect to login...");
                  // window.location.href = '/login';
                }}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        {/* Sidebar with chat history */}
        <div className="w-80 flex flex-col border-r bg-muted/30 overflow-hidden">
          <div className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const allSessions = await getAllChatSessions();
                      setSessions(allSessions);
                      // console.log(
                      //   "🔄 Manually refreshed sessions:",
                      //   allSessions.length
                      // );
                    } catch (error) {
                      console.error("Failed to refresh sessions:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="hover:bg-primary/10"
                  disabled={isLoading}
                  title="Refresh Sessions"
                >
                  <Clock className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewSession}
                  className="hover:bg-primary/10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleNewSession}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              New Session
            </Button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {sessions.map((session) => {
                  const displayTopic =
                    session.topic ||
                    sessionTopics[session.sessionId] ||
                    session.messages?.[0]?.content?.slice(0, 30) + "..." ||
                    "New Chat";

                  return (
                    <div
                      key={session.sessionId}
                      className={cn(
                        "group relative p-3 rounded-lg text-sm cursor-pointer hover:bg-primary/5 transition-colors",
                        session.sessionId === sessionId
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10"
                      )}
                      onClick={() => handleSessionSelect(session.sessionId)}
                    >
                      {/* Delete button - only shows on hover */}
                      <button
                        onClick={(e) =>
                          handleDeleteSession(session.sessionId, e)
                        }
                        disabled={deletingSessionId === session.sessionId}
                        className={cn(
                          "absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
                          "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400",
                          deletingSessionId === session.sessionId &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        title="Delete session"
                      >
                        {deletingSessionId === session.sessionId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex items-center gap-2 mb-1 pr-8">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium line-clamp-1">
                          {displayTopic}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground text-xs">
                        {session.messages?.[session.messages.length - 1]
                          ?.content || "No messages yet"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {session.messages?.length || 0} messages
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            try {
                              const date = new Date(session.updatedAt);
                              if (isNaN(date.getTime())) {
                                return "Just now";
                              }
                              return formatDistanceToNow(date, {
                                addSuffix: true,
                              });
                            } catch (error) {
                              return "Just now";
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background rounded-lg border">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">AI Therapist</h2>
                <p className="text-sm text-muted-foreground">
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>
          {/* Messages */}
          {messages.length === 0 ? (
            // Welcome screen with suggested questions
            <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <div className="relative inline-flex flex-col items-center">
                    <motion.div
                      className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={glowAnimation}
                    />
                    <div className="relative flex items-center gap-2 text-2xl font-semibold">
                      <div className="relative">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <motion.div
                          className="absolute inset-0 text-primary"
                          initial="initial"
                          animate="animate"
                          variants={glowAnimation}
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                      </div>
                      <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        AI Therapist
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      How can I assist you today?
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 relative">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  {SUGGESTED_QUESTIONS.map((q, index) => (
                    <motion.div
                      key={q.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 px-6 text-left justify-start hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                        onClick={() => handleSuggestedQuestion(q.text)}
                      >
                        {q.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat messages
            <div className="flex-1 overflow-y-auto scroll-smooth min-h-0">
              <div className="max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "px-6 py-8",
                        msg.role === "assistant"
                          ? "bg-muted/30"
                          : "bg-background"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 shrink-0 mt-1">
                          {msg.role === "assistant" ? (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                              <Bot className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {msg.role === "assistant"
                                ? "AI Therapist"
                                : "You"}
                            </p>
                            {msg.metadata?.technique && (
                              <Badge variant="secondary" className="text-xs">
                                {msg.metadata.technique}
                              </Badge>
                            )}
                          </div>
                          <div className="prose prose-sm dark:prose-invert leading-relaxed">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          {msg.metadata?.goal && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Goal: {msg.metadata.goal}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 py-8 flex gap-4 bg-muted/30"
                  >
                    <div className="w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-sm">AI Therapist</p>
                      <p className="text-sm text-muted-foreground">Typing...</p>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          {/* Input area */}
          <div className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-4 shrink-0">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex gap-4 items-end relative"
            >
              <div className="flex-1 relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isChatPaused
                      ? "Complete the activity to continue..."
                      : "Ask me anything..."
                  }
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-background",
                    "p-3 pr-12 min-h-[48px] max-h-[200px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "transition-all duration-200",
                    "placeholder:text-muted-foreground/70",
                    (isTyping || isChatPaused) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={isTyping || isChatPaused}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-1.5 bottom-3.5 h-[36px] w-[36px]",
                    "rounded-xl transition-all duration-200",
                    "bg-primary hover:bg-primary/90",
                    "shadow-sm shadow-primary/20",
                    (isTyping || isChatPaused || !message.trim()) &&
                      "opacity-50 cursor-not-allowed",
                    "group-hover:scale-105 group-focus-within:scale-105"
                  )}
                  disabled={isTyping || isChatPaused || !message.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Press <kbd className="px-2 py-0.5 rounded bg-muted">Enter ↵</kbd>{" "}
              to send,{" "}
              <kbd className="px-2 py-0.5 rounded bg-muted ml-1">
                Shift + Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}