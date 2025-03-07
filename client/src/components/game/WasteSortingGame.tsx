import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Recycle, Package, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Waste categories with their respective icons and colors
const CATEGORIES = {
  GENERAL: {
    id: "general",
    name: "General Waste",
    icon: Trash2,
    color: "#FF4500",
  },
  RECYCLABLE: {
    id: "recyclable",
    name: "Recyclable",
    icon: Recycle,
    color: "#4CAF50",
  },
  HAZARDOUS: {
    id: "hazardous",
    name: "Hazardous",
    icon: Zap,
    color: "#F44336",
  },
  SPECIAL: {
    id: "special",
    name: "Special Handling",
    icon: Package,
    color: "#2196F3",
  },
} as const;

type CategoryId = typeof CATEGORIES[keyof typeof CATEGORIES]["id"];

// Sample waste items for the game
const WASTE_ITEMS = [
  {
    id: 1,
    name: "Unused Smart Devices",
    description: "Brand new tablets and phones left in storage",
    category: "special" as CategoryId,
    amount: 500000,
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Excess paper and ink cartridges ordered but never used",
    category: "recyclable" as CategoryId,
    amount: 250000,
  },
  {
    id: 3,
    name: "Chemical Solutions",
    description: "Expired cleaning chemicals requiring disposal",
    category: "hazardous" as CategoryId,
    amount: 750000,
  },
  {
    id: 4,
    name: "Cafeteria Waste",
    description: "Expired food and packaging from overstocking",
    category: "general" as CategoryId,
    amount: 100000,
  },
  {
    id: 5,
    name: "Obsolete Equipment",
    description: "Out-of-date computers and electronics",
    category: "special" as CategoryId,
    amount: 850000,
  },
  {
    id: 6,
    name: "Construction Materials",
    description: "Unused building materials from cancelled projects",
    category: "recyclable" as CategoryId,
    amount: 1200000,
  },
  {
    id: 7,
    name: "Laboratory Waste",
    description: "Unused research chemicals past expiration",
    category: "hazardous" as CategoryId,
    amount: 980000,
  },
  {
    id: 8,
    name: "Office Furniture",
    description: "Damaged furniture from poor storage",
    category: "general" as CategoryId,
    amount: 320000,
  },
  {
    id: 9,
    name: "Medical Equipment",
    description: "Expired medical supplies requiring special disposal",
    category: "special" as CategoryId,
    amount: 1500000,
  },
  {
    id: 10,
    name: "Paper Records",
    description: "Duplicate printed documents never used",
    category: "recyclable" as CategoryId,
    amount: 150000,
  },
  {
    id: 11,
    name: "Industrial Cleaners",
    description: "Bulk cleaning agents stored improperly",
    category: "hazardous" as CategoryId,
    amount: 430000,
  },
  {
    id: 12,
    name: "Event Decorations",
    description: "Single-use decorations from cancelled events",
    category: "general" as CategoryId,
    amount: 75000,
  },
];

export default function WasteSortingGame() {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState(WASTE_ITEMS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const { toast } = useToast();

  // Load user alias and previous score from localStorage
  const userAlias = localStorage.getItem('gameUserAlias');
  const previousScore = parseInt(localStorage.getItem('userGameScore') || '0');

  useEffect(() => {
    if (userAlias && previousScore > 0) {
      setScore(previousScore);
    }
  }, [userAlias]);

  // Update leaderboard score when the game ends
  const updateLeaderboard = (finalScore: number) => {
    if (userAlias) {
      const leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard') || '[]');
      const userIndex = leaderboard.findIndex((entry: any) => entry.alias === userAlias);

      // Store user's current score
      localStorage.setItem('userGameScore', finalScore.toString());

      if (userIndex >= 0) {
        // Update existing score if new score is higher
        if (finalScore > leaderboard[userIndex].score) {
          leaderboard[userIndex].score = finalScore;
          toast({
            title: "New High Score! 🎉",
            description: `You've beaten your previous record!`,
          });
        }
      } else {
        // Add new entry
        leaderboard.push({ alias: userAlias, score: finalScore });
        toast({
          title: "Score Saved! 📝",
          description: `Your score has been added to the leaderboard!`,
        });
      }

      localStorage.setItem('gameLeaderboard', JSON.stringify(leaderboard));
    }
  };

  const handleGameEnd = () => {
    const finalScore = score;
    updateLeaderboard(finalScore);
    setGameComplete(true);
    toast({
      title: "Game Over! 🎮",
      description: `Final Score: $${finalScore.toLocaleString()}`,
    });
  };

  const handleRestart = () => {
    const startingScore = userAlias ? parseInt(localStorage.getItem('userGameScore') || '0') : 0;
    setScore(startingScore);
    setCurrentItem(WASTE_ITEMS[0]);
    setIsSelectionEnabled(true);
    setSelectedCategory(null);
    setGameComplete(false);
  };

  const handleCategorySelect = (category: CategoryId) => {
    if (!isSelectionEnabled || gameComplete) return;

    setSelectedCategory(category);
    setIsSelectionEnabled(false);

    if (category === currentItem.category) {
      // Get category details
      const categoryEntry = Object.entries(CATEGORIES).find(
        ([_, value]) => value.id === category
      );

      // Correct sorting
      toast({
        title: "Correct! 🎉",
        description: categoryEntry ? `That was ${categoryEntry[1].name}!` : "Well done!",
      });
      setScore(score + currentItem.amount);

      // Move to next item
      const nextIndex = WASTE_ITEMS.findIndex(item => item.id === currentItem.id) + 1;
      if (nextIndex < WASTE_ITEMS.length) {
        setTimeout(() => {
          setCurrentItem(WASTE_ITEMS[nextIndex]);
          setIsSelectionEnabled(true);
          setSelectedCategory(null);
        }, 1000);
      } else {
        // Game complete - update leaderboard
        const finalScore = score + currentItem.amount;
        updateLeaderboard(finalScore);
        setGameComplete(true);

        toast({
          title: "Game Complete! 🏆",
          description: `You've sorted waste worth $${finalScore.toLocaleString()}!`,
        });
      }
    } else {
      // Incorrect sorting
      toast({
        variant: "destructive",
        title: "Try Again! 🤔",
        description: "That wasn't the right category. Give it another shot!",
      });

      // Enable selection after cooldown
      setTimeout(() => {
        setIsSelectionEnabled(true);
        setSelectedCategory(null);
      }, 1000);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-orbitron text-white mb-2">Waste Sorting Challenge</h2>
        <p className="text-[#B0B0B0]">Double-tap/click a category to sort the waste!</p>
        <div className="mt-4">
          <span className="text-[#FFD700] font-orbitron text-xl">
            Score: ${score.toLocaleString()}
          </span>
          {userAlias && (
            <p className="text-[#B0B0B0] mt-2">
              Playing as: <span className="text-[#FFD700]">{userAlias}</span>
            </p>
          )}
        </div>
      </div>

      {/* Current Item */}
      {!gameComplete && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <Card className="w-[300px] bg-[#1A1A1A] border-[#FFD700]">
              <CardContent className="p-6">
                <h3 className="text-xl font-orbitron text-white mb-2">
                  {currentItem.name}
                </h3>
                <p className="text-[#B0B0B0] mb-4">{currentItem.description}</p>
                <p className="text-[#FFD700] font-orbitron">
                  ${currentItem.amount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Category Bins */}
      {!gameComplete && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(CATEGORIES).map((category) => (
            <motion.div
              key={category.id}
              className="flex flex-col items-center"
              whileHover={{ scale: isSelectionEnabled ? 1.05 : 1 }}
              whileTap={{ scale: isSelectionEnabled ? 0.95 : 1 }}
              animate={{
                scale: selectedCategory === category.id ? 0.95 : 1,
                opacity: !isSelectionEnabled ? 0.6 : 1,
              }}
              onClick={() => isSelectionEnabled && handleCategorySelect(category.id)}
              style={{ cursor: isSelectionEnabled ? 'pointer' : 'not-allowed' }}
            >
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: category.color }}
              >
                <category.icon className="w-12 h-12 text-white" />
              </div>
              <span className="text-white font-orbitron text-sm text-center">
                {category.name}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        <Button
          className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron"
          onClick={handleRestart}
        >
          Restart Game
        </Button>
        <Button
          className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90 font-orbitron"
          onClick={handleGameEnd}
        >
          Quit Game
        </Button>
      </div>

      {/* Game Complete Message */}
      {gameComplete && (
        <Card className="bg-[#1A1A1A] border-[#FFD700]">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-orbitron text-white mb-4">Game Over!</h3>
            <p className="text-[#FFD700] font-orbitron text-xl mb-2">
              Final Score: ${score.toLocaleString()}
            </p>
            <p className="text-[#B0B0B0]">
              Thanks for helping track government waste! Try again to beat your high score.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}