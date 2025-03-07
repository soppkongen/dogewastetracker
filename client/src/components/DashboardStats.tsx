import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type WasteItem } from "@shared/schema";
import { ChartBar, Star, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

interface Stats {
  totalImpact: number;
  tipOfTheDay: WasteItem | null;
  activeHunters: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading, isError } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-[#FFD700]">
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-24 bg-gray-700 mb-2" />
              <Skeleton className="h-8 w-32 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-[#1A1A1A] border-[#FFD700] mb-6">
        <CardContent className="pt-6">
          <p className="text-red-500">Failed to load stats. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card className="bg-[#1A1A1A] border-[#FFD700] relative overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-[#FFD700]" />
            <h3 className="text-lg font-orbitron text-white">Total Impact</h3>
          </div>
          <motion.p
            key={stats?.totalImpact}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mt-2 text-[36px] font-orbitron text-[#FF4500]"
          >
            {stats?.totalImpact ? formatAmount(stats.totalImpact) : "$0"}
          </motion.p>
          <p className="text-sm text-[#B0B0B0]">Waste tracked by community</p>
          <Link href="/hunt">
            <Button
              className="mt-4 w-[150px] h-[50px] bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron text-[18px]"
              asChild
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Join the Hunt
              </motion.a>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-[#2A2A2A] border-[#FFD700] w-[350px]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Star className="h-5 w-5 text-[#FFD700]" />
            </motion.div>
            <h3 className="text-lg font-orbitron text-white">Tip of the Day</h3>
          </div>
          {stats?.tipOfTheDay ? (
            <div className="mt-2">
              <p className="text-[24px] font-orbitron text-white">
                {stats.tipOfTheDay.title}
              </p>
              <p className="text-[16px] font-roboto text-[#B0B0B0] mt-2">
                {stats.tipOfTheDay.description}
              </p>
              <p className="text-sm text-[#FFD700] mt-2">
                Location: {stats.tipOfTheDay.location}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#B0B0B0]">No tips yet today</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#FFD700]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#FFD700]" />
            <h3 className="text-lg font-orbitron text-white">Active Hunters</h3>
          </div>
          <motion.p
            key={stats?.activeHunters}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-2 text-3xl font-orbitron text-[#FF4500]"
          >
            {stats?.activeHunters || 0}
          </motion.p>
          <p className="text-sm text-[#B0B0B0]">Hunters this week</p>
        </CardContent>
      </Card>
    </div>
  );
}