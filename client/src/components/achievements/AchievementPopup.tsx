import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Share2, Twitter, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

interface AchievementPopupProps {
  title: string;
  description: string;
  type: "achievement" | "badge";
  show: boolean;
  onClose: () => void;
}

export default function AchievementPopup({
  title,
  description,
  type,
  show,
  onClose,
}: AchievementPopupProps) {
  const shareToTwitter = () => {
    try {
      const shareText = type === "achievement" 
        ? `🎮 Just unlocked "${title}" achievement in DOGE Waste! 🏆\n${description}\n\nJoin me in tracking government waste!`
        : `🎮 Just reached ${title} rank in DOGE Waste! 🏆\n${description}\n\nJoin me in tracking government waste!`;

      const url = window.location.origin;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

      const twitterWindow = window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      if (twitterWindow) twitterWindow.opener = null;
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
    }
  };

  const shareToFacebook = () => {
    try {
      const url = window.location.origin;
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

      const fbWindow = window.open(fbUrl, '_blank', 'noopener,noreferrer');
      if (fbWindow) fbWindow.opener = null;
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
    }
  };

  const downloadBadge = async () => {
    const badgeElement = document.getElementById('achievement-badge');
    if (badgeElement) {
      try {
        const canvas = await html2canvas(badgeElement, {
          backgroundColor: '#1A1A1A',
          scale: 2,
          logging: false,
          useCORS: true
        });

        // Create blob from canvas
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `doge-waste-${type}-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error generating badge:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-20 right-4 z-50"
          onAnimationComplete={() => {
            setTimeout(onClose, 5000);
          }}
        >
          <Card id="achievement-badge" className="w-80 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#FFD700]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {type === "achievement" ? (
                    <Trophy className="h-8 w-8 text-[#FFD700]" />
                  ) : (
                    <Star className="h-8 w-8 text-[#FFD700]" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {type === "achievement" ? "Achievement Unlocked!" : "New Rank!"}
                  </h3>
                  <p className="text-[#FFD700] font-semibold">{title}</p>
                  <p className="text-sm text-[#B0B0B0] mt-1">{description}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#FFD700]/20">
                <p className="text-sm text-[#B0B0B0] mb-2">Share your achievement:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                    onClick={shareToTwitter}
                  >
                    <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#1877F2] hover:bg-[#1877F2]/10"
                    onClick={shareToFacebook}
                  >
                    <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFD700] hover:bg-[#FFD700]/10"
                    onClick={downloadBadge}
                  >
                    <Share2 className="h-4 w-4 text-[#FFD700]" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}