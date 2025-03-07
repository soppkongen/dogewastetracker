import { useState } from "react";
import WasteSortingGame from "@/components/game/WasteSortingGame";
import GameLeaderboard from "@/components/game/GameLeaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle } from "lucide-react";

export default function GamePage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="game" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto bg-[#1A1A1A]">
          <TabsTrigger value="game" className="font-orbitron">Play Game</TabsTrigger>
          <TabsTrigger value="about" className="font-orbitron">About</TabsTrigger>
        </TabsList>

        <TabsContent value="game">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WasteSortingGame />
            </div>
            <div>
              <GameLeaderboard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card className="bg-[#2A2A2A] border-[#FFD700]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <Recycle className="h-8 w-8 text-[#FFD700]" />
                <h2 className="text-2xl font-orbitron text-white">About DOGE Waste</h2>
              </div>

              <div className="space-y-6 text-[#B0B0B0]">
                <p>
                  Sort government waste items into their proper categories and track the financial impact. Higher value items mean higher scores!
                </p>

                <div>
                  <h3 className="text-white font-orbitron mb-2">Categories:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-[#FF4500]">General Waste</span> - Non-recyclable items</div>
                    <div><span className="text-[#4CAF50]">Recyclable</span> - Reusable materials</div>
                    <div><span className="text-[#F44336]">Hazardous</span> - Dangerous materials</div>
                    <div><span className="text-[#2196F3]">Special Handling</span> - Specific disposal</div>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FFD700] mt-8">
                  <h3 className="text-[#FFD700] font-orbitron mb-4">Pi Network Integration 🌟</h3>
                  <div className="space-y-4">
                    <p>
                      We're proud to be part of the Pi Network ecosystem, supporting their vision of creating an inclusive digital economy that rewards meaningful contributions.
                    </p>
                    <p>
                      <span className="text-[#FFD700]">Monthly Pi Rewards Program:</span> Each month, we distribute 25% of all Pi donations to our top performers, creating a meritocratic system that rewards both fiscal oversight and gaming skill.
                    </p>
                    <p>
                      By participating in our game and reward system, you're not just tracking government waste - you're helping build Pi Network's utility and supporting their mission of making cryptocurrency accessible to everyone.
                    </p>
                    <p>
                      Our integration with Pi Network demonstrates how blockchain technology can incentivize civic engagement and create positive social impact through gamification.
                    </p>
                    <div className="mt-4 p-4 bg-[#2A2A2A] rounded-lg">
                      <p className="text-sm">
                        <span className="text-[#FFD700]">💡 Pro Tip:</span> Register with your email to be eligible for Pi rewards. Your score directly influences your share of the monthly Pi distribution!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}