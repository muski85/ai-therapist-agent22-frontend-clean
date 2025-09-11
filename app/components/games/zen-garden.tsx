"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { type: "rock", icon: "🪨" },
  { type: "flower", icon: "🌸" },
  { type: "tree", icon: "🌲" },
  { type: "bamboo", icon: "🎋" },
];

interface ZenGardenProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export function ZenGarden({ onComplete, onClose }: ZenGardenProps) {
  const [placedItems, setPlacedItems] = useState<
    Array<{
      type: string;
      icon: string;
      x: number;
      y: number;
    }>
  >([]);

  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [isComplete, setIsComplete] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItems = [...placedItems, { ...selectedItem, x, y }];
    setPlacedItems(newItems);

    // Consider garden complete after placing 8+ items (optional threshold)
    if (newItems.length >= 8) {
      setTimeout(() => {
        setIsComplete(true);
      }, 500); // Small delay to let the last item animate in
    }
  };

  const handleReset = () => {
    setPlacedItems([]);
    setIsComplete(false);
    setSelectedItem(items[0]);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      handleReset();
    }
  };

  const handleManualComplete = () => {
    setIsComplete(true);
  };

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-rose-500" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Beautiful garden created!</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          You've mindfully arranged {placedItems.length} elements in your zen garden. 
          How does this peaceful creation make you feel?
        </p>
        <div className="flex gap-3">
          <Button onClick={handleComplete} className="mt-4">
            {onComplete ? "Continue to Chat" : "Create Another"}
          </Button>
          {onComplete && (
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Start Fresh Garden
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Add close button when integrated with chat */}
      {onClose && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Exit Early
          </Button>
        </div>
      )}

      {/* Item selection */}
      <div className="flex justify-center gap-4">
        {items.map((item) => (
          <motion.button
            key={item.type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item)}
            className={`p-3 rounded-lg transition-colors ${
              selectedItem.type === item.type ? "bg-primary/20" : "bg-primary/5"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
          </motion.button>
        ))}
      </div>

      {/* Garden canvas */}
      <div
        onClick={handleCanvasClick}
        className="relative w-full h-[300px] bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg cursor-pointer overflow-hidden border-2 border-dashed border-green-200 dark:border-green-800"
      >
        <div className="absolute inset-4 text-center text-green-600/50 dark:text-green-400/50 text-sm font-medium pointer-events-none">
          {placedItems.length === 0 && "Click anywhere to place elements in your zen garden"}
        </div>

        {placedItems.map((item, index) => (
          <motion.div
            key={`${item.type}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10 
            }}
            style={{
              position: "absolute",
              left: item.x - 12,
              top: item.y - 12,
            }}
            className="text-2xl pointer-events-none"
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {placedItems.length} elements placed
        </div>
        
        <div className="flex gap-2">
          {placedItems.length >= 3 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualComplete}
            >
              I'm Done
            </Button>
          )}
          
          {placedItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}