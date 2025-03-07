import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#1A1A1A] border-t-2 border-[#FFD700] z-50">
      <div className="w-full h-full px-8 flex items-center justify-around max-w-7xl mx-auto">
        <Link 
          href="/"
          className={cn(
            "text-lg font-orbitron",
            location === "/"
              ? "text-[#FFD700]"
              : "text-white hover:text-[#FFD700]"
          )}
        >
          Feed
        </Link>
        <Link 
          href="/hunt"
          className={cn(
            "text-lg font-orbitron",
            location === "/hunt"
              ? "text-[#FFD700]"
              : "text-white hover:text-[#FFD700]"
          )}
        >
          Hunt Waste
        </Link>
        <Link 
          href="/game"
          className={cn(
            "text-lg font-orbitron",
            location === "/game"
              ? "text-[#FFD700]"
              : "text-white hover:text-[#FFD700]"
          )}
        >
          Play Game
        </Link>
      </div>
    </nav>
  );
}