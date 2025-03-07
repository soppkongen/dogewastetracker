import { useQuery } from "@tanstack/react-query";
import { type WasteItem } from "@shared/schema";
import WasteCard from "../components/WasteCard";
import DashboardStats from "../components/DashboardStats";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseIcon, UserIcon, TrendingUpIcon } from "lucide-react";
import DogeLogo from "../components/DogeLogo";
import CommentsFeed from "../components/CommentsFeed";
import { motion, AnimatePresence } from "framer-motion";

export default function WasteFeed() {
  const { data: wasteItems, isLoading, isError } = useQuery<WasteItem[]>({
    queryKey: ["/api/waste"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const { data: comments } = useQuery({
    queryKey: ["/api/comments"],
    refetchInterval: 15000, // Refresh comments more frequently
  });


  const officialItems = wasteItems?.filter(item => item.source === "official") || [];
  const userSubmittedItems = wasteItems?.filter(item => item.source === "user-submitted") || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-[#0D0D0D] bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <DogeLogo />
        <DashboardStats stats={stats}/>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#1A1A1A] border-[#FFD700] border-2">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-[#0D0D0D] bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <DogeLogo />
        <DashboardStats stats={stats}/>
        <Card className="bg-[#1A1A1A] border-[#FFD700] border-2">
          <div className="p-6">
            <p className="text-red-500">Failed to load waste items. Please try again later.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 bg-[#0D0D0D] bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <DogeLogo />
        <DashboardStats stats={stats}/>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="official" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-[#1A1A1A] p-1 rounded-xl border-2 border-[#FFD700] backdrop-blur-sm">
                <TabsTrigger
                  value="official"
                  className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black rounded-lg transition-all duration-300 font-orbitron"
                >
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  Official Data
                </TabsTrigger>
                <TabsTrigger
                  value="user-submitted"
                  className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black rounded-lg transition-all duration-300 font-orbitron"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Community Tips
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <TabsContent value="official" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {officialItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <WasteCard waste={item} />
                      </motion.div>
                    ))}
                    {officialItems.length === 0 && (
                      <Card className="bg-[#1A1A1A] border-[#FFD700] border-2">
                        <div className="p-6">
                          <p className="text-gray-400">No official waste data available.</p>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
                <TabsContent value="user-submitted" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {userSubmittedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <WasteCard waste={item} />
                      </motion.div>
                    ))}
                    {userSubmittedItems.length === 0 && (
                      <Card className="bg-[#1A1A1A] border-[#FFD700] border-2">
                        <div className="p-6">
                          <p className="text-gray-400">No community tips submitted yet.</p>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
          <div className="lg:sticky lg:top-4 lg:self-start">
            <CommentsFeed comments={comments}/>
          </div>
        </div>
      </div>
    </div>
  );
}