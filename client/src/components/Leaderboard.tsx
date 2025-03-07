import { useQuery } from "@tanstack/react-query";
import { type User, type Achievement, type Badge } from "@shared/schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Star, Award, Target, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DetailedUser extends User {
  achievements: Achievement[];
  badges: Badge[];
  verificationRate: number;
  totalImpact: number;
  tipCount: number;
}

export default function Leaderboard() {
  const { data: detailedUsers, isLoading } = useQuery<DetailedUser[]>({
    queryKey: ["/api/leaderboard/detailed"],
  });

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const UserRow = ({ user, index }: { user: DetailedUser; index: number }) => (
    <div
      key={user.id}
      className="flex items-center justify-between py-4 border-b border-[#FFD700]/20 last:border-0"
    >
      <div className="flex items-center gap-4">
        <span className="font-orbitron text-xl text-[#FFD700]">{index + 1}</span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-white">{user.username}</span>
            {user.badges.map((badge, i) => (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <Award className="h-5 w-5 text-[#FFD700]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <span className="text-sm text-[#FFD700]">{user.rank}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-[#FF4500]" />
          <span className="font-orbitron text-xl text-[#FF4500]">
            {formatAmount(user.totalImpact)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#B0B0B0]">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{user.points} pts</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>{user.verificationRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-4 text-[#B0B0B0]">
      <p>No waste hunters yet. Be the first!</p>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="w-full bg-[#2A2A2A] border-[#FFD700]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[#FFD700]" />
            <h2 className="text-xl font-orbitron text-white">Loading...</h2>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#2A2A2A] border-[#FFD700]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#FFD700]" />
          <h2 className="text-xl font-orbitron text-white">Top Waste Hunters</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {detailedUsers?.length ? (
            detailedUsers.map((user, index) => (
              <UserRow key={user.id} user={user} index={index} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
}