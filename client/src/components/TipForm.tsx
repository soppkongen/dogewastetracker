import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTipSchema, type InsertWasteTip } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import confetti from 'canvas-confetti';
import AchievementPopup from "./achievements/AchievementPopup";
import { motion } from "framer-motion";

export default function TipForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [achievementData, setAchievementData] = useState({ title: "", description: "" });
  const [badgeData, setBadgeData] = useState({ name: "", description: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<InsertWasteTip>({
    resolver: zodResolver(insertTipSchema),
    defaultValues: {
      userId: 1, // Hardcoded for demo
      title: "",
      description: "",
      amount: 0,
      location: "",
    },
  });

  // Get user's current achievements and badges
  const { data: achievements } = useQuery({
    queryKey: ["/api/users/1/achievements"],
  });

  const { data: badges } = useQuery({
    queryKey: ["/api/users/1/badges"],
  });

  const prevAchievementsCount = achievements?.length || 0;
  const prevBadgesCount = badges?.length || 0;

  const handleImageCapture = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create an image element to resize the image
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max width/height of 1024px)
          let width = img.width;
          let height = img.height;
          const maxSize = 1024;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          // Set canvas dimensions and draw resized image
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Get the resized image as base64
          const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(resizedImage);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertWasteTip) => {
      try {
        // Create FormData object
        const formData = new FormData();

        // Add all form fields with proper type conversions
        formData.append('userId', '1'); // Hardcoded for demo
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('amount', data.amount.toString());
        formData.append('location', data.location);

        // Add the image if it exists
        if (imagePreview) {
          // Remove the data:image/... prefix from the base64 string
          const base64Data = imagePreview.split(',')[1];
          formData.append('evidence', base64Data);
        }

        console.log('Submitting form data:', Object.fromEntries(formData.entries()));

        const response = await apiRequest("POST", "/api/tips", formData);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit tip');
        }
        return response.json();
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      // Refetch achievements and badges
      const [newAchievements, newBadges] = await Promise.all([
        queryClient.fetchQuery({ queryKey: ["/api/users/1/achievements"] }),
        queryClient.fetchQuery({ queryKey: ["/api/users/1/badges"] })
      ]);

      // Check for new achievements
      if (newAchievements?.length > prevAchievementsCount) {
        const latestAchievement = newAchievements[0];
        setAchievementData({
          title: latestAchievement.title,
          description: latestAchievement.description
        });
        setShowAchievement(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Check for new badges (rank up)
      if (newBadges?.length > prevBadgesCount) {
        const latestBadge = newBadges[0];
        setBadgeData({
          name: latestBadge.name,
          description: `You've reached ${latestBadge.name} status!`
        });
        setShowBadge(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500']
        });
      }

      // Invalidate waste items cache to show the new tip
      queryClient.invalidateQueries({ queryKey: ["/api/waste"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });

      toast({
        title: "Tip Submitted!",
        description: "Thank you for helping track government waste.",
      });
      form.reset();
      setImagePreview(null);
    },
    onError: (error) => {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit tip. Please try again.",
      });
    }
  });

  return (
    <>
      <Card className="w-full bg-[#1A1A1A] border-[#FFD700]">
        <CardHeader>
          <h2 className="text-xl font-orbitron text-white">Submit a Waste Tip</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black placeholder:text-gray-500"
                        placeholder="What was wasted?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black placeholder:text-gray-500"
                        placeholder="Provide details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-white text-black placeholder:text-gray-500"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Location</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black placeholder:text-gray-500"
                        placeholder="Where did this happen?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black/10">
                  <img
                    src={imagePreview}
                    alt="Evidence preview"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <motion.div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-[40px] h-[40px] rounded-full bg-[#FF4500] border-none p-0 hover:bg-[#FF4500]/90"
                  onClick={handleImageCapture}
                >
                  <Camera className="h-5 w-5 text-white" />
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AchievementPopup
        title={achievementData.title}
        description={achievementData.description}
        type="achievement"
        show={showAchievement}
        onClose={() => setShowAchievement(false)}
      />

      <AchievementPopup
        title={badgeData.name}
        description={badgeData.description}
        type="badge"
        show={showBadge}
        onClose={() => setShowBadge(false)}
      />
    </>
  );
}