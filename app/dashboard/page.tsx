"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  BrainCircuit,
  Heart,
  Loader2,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AnxietyGames } from "../components/games/anxiety-games";
import { MoodForm } from "../components/mood/mood-form";
import { ActivityLogger } from "../components/activity/activity-logger";
import {useRouter} from "next/navigation";
import {useSession} from "@/lib/contexts/session-contexts";
import { getTodayStats } from "@/lib/utils/activity-storage";
import { getTodayAverageMood } from "@/lib/utils/mood-storage";
import { getAllTimeTherapyStats } from "@/lib/utils/therapy-storage";









export default function DashboardPage() {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [activityStats, setActivityStats] = useState({ total: 0, completed: 0, completionRate: 100, totalDuration: 0 });
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [therapySessions, setTherapySessions] = useState(0);
  const {user} = useSession();

  // Load all stats when component mounts and when data changes
  const loadAllStats = () => {
    // Load activity stats
    const stats = getTodayStats();
    setActivityStats(stats);

    // Load mood score
    const avgMood = getTodayAverageMood();
    setMoodScore(avgMood);

    // Load therapy sessions
    const therapyStats = getAllTimeTherapyStats();
    setTherapySessions(therapyStats.totalSessions);
  };







  // Update wellness stats to reflect the changes
  const wellnessStats = [
    {
      title: "Mood Score",
      value: moodScore !== null ? `${moodScore}/100` : "No data",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Today's average mood",
    },
    {
      title: "Completion Rate",
      value: `${activityStats.completionRate}%`,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: `${activityStats.completed} of ${activityStats.total} completed`,
    },
    {
      title: "Therapy Sessions",
      value: therapySessions,
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total sessions completed",
    },
    {
      title: "Total Activities",
      value: activityStats.total,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Logged for today",
    },
  ];

  const router  =  useRouter();

  

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadAllStats(); // Load stats on mount

    // Also refresh stats every 5 seconds to catch any changes
    const statsTimer = setInterval(loadAllStats, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const handleMoodSubmit = async (data :{moodScore: number}) => {
      setIsSavingMood(true);
      try{
        setShowMoodModal(false);
      } catch(error){
          console.error("Eroor saving mood:", error);
      }finally {
        setIsSavingMood(false);
      }  
     };

    const handleAICheckIn = ( ) => {
        setShowActivityLogger(true);
      };

    const handleStartTherapy = () => {
      router.push("/therapy/new");
    };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Container>
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {user?.name || "Here"}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </div>

        {/* main grid layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Quick Actions Card */}
            <Card className="border-primary/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
              <CardContent className="p-4 sm:p-6 relative">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">Quick Actions</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Start your wellness journey
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className={cn(
                      "w-full justify-between items-center p-4 sm:p-6 h-auto group/button",
                      "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
                      "transition-all duration-200 group-hover:translate-y-[-2px]"
                    )}
                    onClick={handleStartTherapy}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm sm:text-base text-white">
                          Start Therapy
                        </div>
                        <div className="text-[10px] sm:text-xs text-white/80">
                          Begin a new session
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover/button:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </Button>
                  {/*heart grid*/}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      className={cn(
                        "flex flex-col h-[100px] sm:h-[120px] px-3 py-2 sm:px-4 sm:py-3 group/mood hover:border-primary/50",
                        "justify-center items-center text-center",
                        "transition-all duration-200 group-hover:translate-y-[-2px]"
                      )}
                      onClick={() => setShowMoodModal(true)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-1 sm:mb-2">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm">Track Mood</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          How are you feeling?
                        </div>
                      </div>
                    </Button>

                    {/*  */}
                    <Button
                      variant="outline"
                      className={cn(
                        "flex flex-col h-[100px] sm:h-[120px] px-3 py-2 sm:px-4 sm:py-3 group/ai hover:border-primary/50",
                        "justify-center items-center text-center",
                        "transition-all duration-200 group-hover:translate-y-[-2px]"
                      )}
                      onClick={handleAICheckIn}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-1 sm:mb-2">
                        <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm">Check-in</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          Quick wellness check
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* wellness metrics  */}
            <Card className="border-primary/10">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Today's Overview</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Your wellness metrics for{" "}
                      {format(new Date(), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={loadAllStats}
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    title="Refresh stats"
                  >
                    <Activity className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4")} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {wellnessStats.map((stat) => (
                    <div
                      key={stat.title}
                      className={cn(
                        "p-3 sm:p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                        stat.bgColor
                      )}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <stat.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", stat.color)} />
                        <p className="text-xs sm:text-sm font-medium">{stat.title}</p>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold mt-1.5 sm:mt-2">{stat.value}</p>
                      <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-right">
                  {/* Last updated: {format(dailyStats.lastUpdated, "h:mm a")} */}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* content grid for games */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {/* anxiety games */}
                <AnxietyGames/>

            </div>
          </div>
        </div>
      </Container>
      {/* mood tracking modal */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="w-[90vw] max-w-[425px] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">How are you feeling?</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Move the slider to track your current mood
            </DialogDescription>
          </DialogHeader>
          {/* moodForm */}
          <MoodForm onSuccess={() => {
            setShowMoodModal(false);
            loadAllStats(); // Refresh all stats after saving mood
          }} />
        </DialogContent>
      </Dialog>
       {/* activity logger */}
       <ActivityLogger
       open={showActivityLogger}
       onOpenChange={setShowActivityLogger}
       onActivitySaved={loadAllStats}
       />
    </div>
  );
}
