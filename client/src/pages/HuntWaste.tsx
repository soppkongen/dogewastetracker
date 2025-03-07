import Leaderboard from "../components/Leaderboard";
import TipForm from "../components/TipForm";

export default function HuntWaste() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <Leaderboard />
      <TipForm />
    </div>
  );
}