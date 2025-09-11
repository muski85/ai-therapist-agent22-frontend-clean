"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Waves, Volume2, VolumeX, Play, Pause, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const BREATH_DURATION = 8; // seconds for one breath cycle
const SESSION_DURATION = 5 * 60; // 5 minutes in seconds

interface OceanWavesProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export function OceanWaves({ onComplete, onClose }: OceanWavesProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [isComplete, setIsComplete] = useState(false);
  const waveControls = useAnimation();
  const [audio] = useState(new Audio("/sounds/waves.mp3"));

  useEffect(() => {
    audio.loop = true;
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const newProgress = ((SESSION_DURATION - newTime) / SESSION_DURATION) * 100;
          setProgress(newProgress);
          
          // Check if session is complete
          if (newTime <= 0) {
            setIsComplete(true);
            setIsPlaying(false);
            audio.pause();
            waveControls.stop();
          }
          
          return newTime;
        });
      }, 1000);

      // Animate waves
      waveControls.start({
        y: [0, -20, 0],
        transition: {
          duration: BREATH_DURATION,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      waveControls.stop();
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setTimeLeft(SESSION_DURATION);
    setProgress(0);
    setIsComplete(false);
    setIsPlaying(false);
    audio.pause();
    audio.currentTime = 0;
    waveControls.stop();
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      handleReset();
    }
  };

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-blue-500" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Ocean waves session complete!</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          You've spent 5 minutes flowing with the rhythm of the ocean. How do you feel after this calming experience?
        </p>
        <div className="flex gap-3">
          <Button onClick={handleComplete} className="mt-4">
            {onComplete ? "Continue to Chat" : "Start Again"}
          </Button>
          {onComplete && (
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Another Session
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8 relative">
      {/* Add close button when integrated with chat */}
      {onClose && (
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              // Stop audio and animation before closing
              audio.pause();
              waveControls.stop();
              onClose();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Exit Early
          </Button>
        </div>
      )}

      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-xl" />
        <motion.div
          animate={waveControls}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative">
            <Waves className="w-24 h-24 text-blue-600" />
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: BREATH_DURATION,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-blue-400/10 blur-xl rounded-full"
            />
          </div>
        </motion.div>
      </div>

      <div className="w-64 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
            />
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formatTime(timeLeft)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            {formatTime(SESSION_DURATION)}
          </span>
        </div>
      </div>
    </div>
  );
}