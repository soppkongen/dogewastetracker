import { useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DonateModalProps {
  show: boolean;
  onClose: () => void;
}

export default function DonateModal({ show, onClose }: DonateModalProps) {
  const [amount, setAmount] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const PI_WALLET_ADDRESS = "GB4LZKV6JXFSSV5W64CZKG653UFUAKOFDCQA5ELODWJLELIRFAREKBZ6";
  const PI_REFERRAL_URL = "https://minepi.com/ninjasopp";

  const handleDonate = () => {
    setIsProcessing(true);

    // Simulate Pi Browser opening and transaction process
    toast({
      title: "Opening Pi Browser",
      description: `Preparing to send ${amount} Pi...`,
    });

    // Simulate transaction process with timeout
    setTimeout(() => {
      toast({
        title: "Transaction Initiated",
        description: `Transferring ${amount} Pi to support waste tracking. The Pi Browser will open to confirm your transaction.`,
      });

      // Reset processing state and close modal
      setIsProcessing(false);
      onClose();

      // Open Pi referral URL in a new tab (since we can't actually open Pi Browser)
      window.open(PI_REFERRAL_URL, '_blank');
    }, 1500);
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-[#0D0D0D] border-[#FFD700] w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-orbitron text-white">Donate Pi</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCode 
                value={PI_WALLET_ADDRESS}
                size={200}
                level="H"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm">Amount (Pi)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white text-black w-[200px] font-roboto text-base"
              min="0.1"
              step="0.1"
            />
            <p className="text-[#B0B0B0] text-sm">
              (~${(parseFloat(amount) * 0.3).toFixed(2)} USD in 2025)
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-[100px] h-[40px] bg-[#8A40EE] text-white hover:bg-[#8A40EE]/90 font-orbitron text-[18px]"
              onClick={handleDonate}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
              ) : (
                "Send Pi"
              )}
            </Button>

            <div className="text-center">
              <a
                href={PI_REFERRAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B0B0B0] font-roboto text-base hover:text-[#8A40EE] hover:underline transition-colors"
              >
                Get the Pi Wallet
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}