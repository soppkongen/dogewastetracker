import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../../../attached_assets/st,extra_large,507x507-pad,600x600,f8f8f8.png";

export default function WelcomeScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.img
              src={logo}
              alt="DOGE Government Efficiency Logo"
              className="h-48 w-auto mx-auto mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
            />
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-orbitron text-[#FFD700] mb-4"
            >
              Welcome to D.O.G.E
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white text-xl"
            >
              Department of Government Efficiency
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
