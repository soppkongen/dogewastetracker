import { useState } from "react";
import { Share2, DollarSign, MapPin, Calendar, Image, Shield, UserCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import { type WasteItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import DonateModal from "./DonateModal";

interface WasteCardProps {
  waste: WasteItem;
}

export default function WasteCard({ waste }: WasteCardProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const card = document.getElementById(`waste-card-${waste.id}`);
      if (card) {
        const canvas = await html2canvas(card);
        const image = canvas.toDataURL("image/png");

        if (navigator.share) {
          await navigator.share({
            title: "Check this waste!",
            text: `${waste.title} - ${waste.description}`,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(
            `Check this government waste: ${waste.title} - ${waste.description}`
          );
          toast({
            title: "Copied to clipboard!",
            description: "Share this with others!",
          });
        }

        await apiRequest("POST", `/api/waste/${waste.id}/share`, {});
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing",
        description: "Could not share the waste item.",
      });
    } finally {
      setIsSharing(false);
      setShowPreview(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02, rotateX: 2 }}
        className="transform transition-all duration-200 perspective-1000"
      >
        <Card
          id={`waste-card-${waste.id}`}
          className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#FFD700] border-2 hover:shadow-xl hover:shadow-[#FFD700]/30"
        >
          <CardContent className="p-6 space-y-4 relative">
            {/* Source Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#1A1A1A]/80 px-3 py-1 rounded-full border border-[#FFD700]/30 backdrop-blur-sm">
              {waste.source === 'official' ? (
                <Shield className="h-4 w-4 text-[#FFD700]" />
              ) : waste.source === 'social' ? (
                <span className="text-[#1DA1F2] text-lg">𝕏</span>
              ) : (
                <UserCircle2 className="h-4 w-4 text-[#4CAF50]" />
              )}
              <span className="text-xs font-medium text-white capitalize">
                {waste.source === 'social' ? 'X.com' : waste.source}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="relative flex-1"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] opacity-30 blur"
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <h2
                  className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent relative z-10"
                  style={{ fontFamily: "Orbitron" }}
                >
                  {(waste.amount / 1000000).toFixed(1)}M
                </h2>
                <h3 className="text-xl text-white mt-2 font-semibold relative z-10">
                  {waste.title}
                </h3>
                {waste.authorHandle && waste.postUrl && (
                  <a
                    href={waste.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1DA1F2] hover:underline text-sm mt-1 inline-block"
                  >
                    {waste.authorHandle}
                  </a>
                )}
              </motion.div>

              <motion.div
                className="flex gap-2 ml-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {waste.evidence && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-[#1A1A1A] border-[#FFD700] hover:bg-[#1A1A1A]/90 hover:scale-110 transition-transform"
                    onClick={() => setShowEvidence(true)}
                  >
                    <Image className="h-5 w-5 text-[#FFD700]" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#FF4500] border-none hover:bg-[#FF4500]/90 hover:scale-110 transition-transform"
                  onClick={() => setShowPreview(true)}
                  disabled={isSharing}
                >
                  <Share2 className="h-5 w-5 text-white" />
                </Button>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#B0B0B0] font-roboto text-lg leading-relaxed mt-6"
            >
              {waste.description}
            </motion.p>

            <motion.div
              className="flex items-center gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-2 rounded-full border border-[#FFD700]/20">
                <MapPin className="h-4 w-4 text-[#FFD700]" />
                <span className="text-[#B0B0B0]">{waste.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-2 rounded-full border border-[#FFD700]/20">
                <Calendar className="h-4 w-4 text-[#FFD700]" />
                <span className="text-[#B0B0B0]">{waste.year}</span>
              </div>
            </motion.div>

            {/* Add Donate Button */}
            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className="w-[100px] h-[40px] bg-[#6930C3] text-white hover:bg-[#6930C3]/90 font-orbitron text-[18px]"
                onClick={() => setShowDonate(true)}
              >
                Donate Pi
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-[#0D0D0D] border-[#FFD700] w-[400px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-orbitron text-white">Share this waste report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Card Preview */}
            <Card className="bg-[#1A1A1A] border-[#FFD700] border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-12 w-12 text-[#FFD700]" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{waste.title}</h3>
                      <p className="text-[#FFD700] text-3xl font-bold mt-1">
                        {(waste.amount / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                  <p className="text-[#B0B0B0]">{waste.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#B0B0B0]">{waste.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* X Frame Preview */}
            <div className="rounded-xl border border-[#1DA1F2]/20 p-4 bg-[#1A1A1A]">
              <div className="flex items-center gap-2 mb-3">
                <img src="https://abs.twimg.com/responsive-web/client-web/icon-svg.168b89da.svg"
                     alt="X logo"
                     className="w-5 h-5" />
                <span className="text-[#1DA1F2]">Post Preview</span>
              </div>
              <textarea
                className="w-full h-[100px] bg-white text-black p-3 rounded-lg resize-none"
                defaultValue={`Check out this government waste: ${waste.title} - ${waste.description}`}
              />
            </div>

            <Button
              className="w-[100px] mx-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-orbitron text-[18px]"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
              ) : (
                "Share"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEvidence} onOpenChange={setShowEvidence}>
        <DialogContent className="bg-[#1A1A1A] border-[#FFD700]">
          <DialogHeader>
            <DialogTitle className="text-white">Evidence</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[300px] rounded-lg overflow-hidden bg-black/10">
            {waste.evidence && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={waste.evidence}
                alt="Waste evidence"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <DonateModal show={showDonate} onClose={() => setShowDonate(false)} />
    </>
  );
}