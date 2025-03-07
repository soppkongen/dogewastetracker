import DogeLogo from "./DogeLogo";

export default function TopNavigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[#1A1A1A] border-b-2 border-[#FFD700] z-50">
      <div className="w-full h-full px-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xl font-orbitron text-[#FFD700]">DOGE Waste Tracker</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-white">
          <span>Track Government Spending</span>
          <span className="text-[#FFD700]">•</span>
          <span>Make a Difference</span>
        </div>
      </div>
    </nav>
  );
}