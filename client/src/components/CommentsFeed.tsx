import { useQuery } from "@tanstack/react-query";
import { type Comment } from "@shared/schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CommentsFeed() {
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
  });

  if (isLoading) {
    return (
      <Card className="w-full bg-[#1A1A1A] border-[#FFD700]">
        <CardHeader>
          <h2 className="text-xl font-orbitron text-white">Recent Comments</h2>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[#B0B0B0]">Loading comments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#1A1A1A] border-[#FFD700]">
      <CardHeader>
        <h2 className="text-xl font-orbitron text-white">Recent Comments</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {comments?.length === 0 ? (
            <p className="text-center text-[#B0B0B0]">No comments yet. Be the first!</p>
          ) : (
            comments?.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#2A2A2A] rounded-lg border border-[#FFD700]/20"
              >
                <p className="text-white whitespace-pre-wrap">{comment.content}</p>
                <p className="text-sm text-[#FFD700] mt-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
