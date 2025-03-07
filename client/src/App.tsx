import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopNavigation from "./components/TopNavigation";
import Navigation from "./components/Navigation";
//import DogeLogo from "./components/DogeLogo"; //Removed to address duplication
import WasteFeed from "./pages/WasteFeed";
import HuntWaste from "./pages/HuntWaste";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/not-found";
import CommentModal from "./components/CommentModal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WasteFeed} />
      <Route path="/hunt" component={HuntWaste} />
      <Route path="/game" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[#0D0D0D] text-white">
          <TopNavigation />
          <div className="pt-[60px]">
            {/* <DogeLogo /> */} {/*Removed to address duplication*/}
            <main className="max-w-7xl mx-auto px-4 pb-[80px]">
              <Router />
            </main>
          </div>
          <Navigation />
        </div>
        <CommentModal />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;