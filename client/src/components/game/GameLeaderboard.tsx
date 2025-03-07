import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  alias: z.string().min(3, "Alias must be at least 3 characters").max(20, "Alias must be less than 20 characters"),
});

interface LeaderboardEntry {
  alias: string;
  score: number;
}

export default function GameLeaderboard() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { alias: "WasteHunter", score: 1500000 },
    { alias: "EcoWarrior", score: 1200000 },
    { alias: "GreenHero", score: 900000 }
  ]);
  const { toast } = useToast();

  // Load user data and leaderboard on mount
  useEffect(() => {
    const storedAlias = localStorage.getItem('gameUserAlias');
    const storedEmail = localStorage.getItem('gameUserEmail');
    if (storedAlias && storedEmail) {
      setIsSignedUp(true);
    }

    // Load leaderboard data
    const storedLeaderboard = localStorage.getItem('gameLeaderboard');
    if (storedLeaderboard) {
      const parsedLeaderboard = JSON.parse(storedLeaderboard);
      setLeaderboard(prev => [...prev, ...parsedLeaderboard]);
    }
  }, []);

  // Update leaderboard when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLeaderboard = localStorage.getItem('gameLeaderboard');
      if (storedLeaderboard) {
        const parsedLeaderboard = JSON.parse(storedLeaderboard);
        setLeaderboard(prev => {
          const baseEntries = [
            { alias: "WasteHunter", score: 1500000 },
            { alias: "EcoWarrior", score: 1200000 },
            { alias: "GreenHero", score: 900000 }
          ];
          return [...baseEntries, ...parsedLeaderboard];
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      alias: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // In a real app, this would make an API call to store the email and alias
      console.log("Form submitted:", values);

      // Add the new player to the leaderboard with an initial score
      setLeaderboard(prev => [...prev, { alias: values.alias, score: 0 }]);

      setIsSignedUp(true);
      toast({
        title: "Success!",
        description: "You've been added to the leaderboard as " + values.alias + "!",
      });

      // Store in localStorage for persistence
      localStorage.setItem('gameUserAlias', values.alias);
      localStorage.setItem('gameUserEmail', values.email);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign up. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full bg-[#2A2A2A] border-[#FFD700]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#FFD700]" />
          <h2 className="text-xl font-orbitron text-white">Top Waste Sorters</h2>
        </div>
      </CardHeader>
      <CardContent>
        {!isSignedUp ? (
          <div className="space-y-4">
            <p className="text-[#B0B0B0]">
              Sign up to track your progress and compete with other waste hunters!
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="bg-[#1A1A1A] border-[#FFD700] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Alias</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose your leaderboard name"
                          className="bg-[#1A1A1A] border-[#FFD700] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron"
                >
                  Join Leaderboard
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard
              .filter((entry, index, self) => 
                index === self.findIndex((t) => t.alias === entry.alias)
              )
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-[#FFD700]/20 last:border-0">
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-[#FFD700]" />
                    <span className="font-orbitron text-white">{entry.alias}</span>
                  </div>
                  <span className="text-[#FFD700] font-orbitron">{entry.score.toLocaleString()}</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}