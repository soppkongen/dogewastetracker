import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type Comment, insertCommentSchema, type InsertComment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, SmileIcon } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CommentModal() {
  const { toast } = useToast();
  const [showEmoji, setShowEmoji] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertComment>({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      userId: 1, // Hardcoded for demo
      content: "",
    },
  });

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertComment) => {
      const response = await apiRequest("POST", "/api/comments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      form.reset();
      setIsOpen(false);
      toast({
        title: "Comment Posted!",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment",
      });
    },
  });

  const onEmojiSelect = (emoji: any) => {
    const currentContent = form.getValues("content");
    form.setValue("content", currentContent + emoji.native);
    setShowEmoji(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-[#FFD700] hover:bg-[#FFD700]/90 z-[100]"
          >
            <MessageCircle className="h-6 w-6 text-black" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1A1A1A] border-[#FFD700] z-[100]">
          <DialogHeader>
            <DialogTitle className="text-xl font-orbitron text-white">Leave a Comment</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts... (300 chars max)"
                          className="bg-[#2A2A2A] border-[#FFD700]/50 text-white resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Popover open={showEmoji} onOpenChange={setShowEmoji}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-24 w-10 bg-[#2A2A2A] border-[#FFD700]/50"
                    >
                      <SmileIcon className="h-5 w-5 text-[#FFD700]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-full p-0 border-none z-[100]" 
                    side="right"
                    align="start"
                  >
                    <Picker data={data} onEmojiSelect={onEmojiSelect} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron"
                disabled={mutation.isPending}
              >
                Post Comment
              </Button>
            </form>
          </Form>

          <div className="space-y-4 mt-6 max-h-[300px] overflow-y-auto">
            <h3 className="text-lg font-orbitron text-white">Recent Comments</h3>
            {isLoading ? (
              <p className="text-center text-[#B0B0B0]">Loading comments...</p>
            ) : comments?.length === 0 ? (
              <p className="text-center text-[#B0B0B0]">No comments yet. Be the first!</p>
            ) : (
              comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-[#2A2A2A] rounded-lg border border-[#FFD700]/20"
                >
                  <p className="text-white whitespace-pre-wrap">{comment.content}</p>
                  <p className="text-sm text-[#B0B0B0] mt-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}