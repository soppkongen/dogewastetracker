import { storage } from "../storage";
import { type InsertAchievement, type InsertBadge } from "@shared/schema";

// Rank thresholds
const RANKS = {
  ROOKIE: { points: 0, title: "Rookie" },
  INVESTIGATOR: { points: 100, title: "Waste Investigator" },
  HUNTER: { points: 500, title: "Waste Hunter" },
  ELITE: { points: 1000, title: "Elite Hunter" },
  LEGEND: { points: 5000, title: "Waste Legend" },
} as const;

// Achievement types
const ACHIEVEMENTS = {
  FIRST_TIP: {
    type: "first_tip",
    title: "First Strike",
    description: "Submit your first waste tip",
  },
  TIP_STREAK: {
    type: "tip_streak",
    title: "On a Roll",
    description: "Submit 5 tips in a week",
  },
  HIGH_IMPACT: {
    type: "high_impact",
    title: "Big Fish",
    description: "Report waste over $1M",
  },
  VIRAL_HUNTER: {
    type: "viral_hunter",
    title: "Viral Hunter",
    description: "Get 100 shares on your tips",
  },
} as const;

export class GamificationService {
  // Check and update user rank based on points
  async updateRankIfNeeded(userId: number): Promise<void> {
    const user = await storage.getUser(userId);
    if (!user) return;

    let newRank = RANKS.ROOKIE.title;
    const points = user.points ?? 0;

    for (const [, rankData] of Object.entries(RANKS)) {
      if (points >= rankData.points) {
        newRank = rankData.title;
      }
    }

    if (newRank !== user.rank) {
      await storage.updateRank(userId, newRank);
      // Award badge for rank up
      await this.awardBadge(userId, {
        name: newRank,
        icon: `rank-${newRank.toLowerCase()}`,
      });
    }
  }

  // Award achievement if not already earned
  async checkAndAwardAchievement(
    userId: number,
    achievementType: keyof typeof ACHIEVEMENTS
  ): Promise<void> {
    const userAchievements = await storage.getAchievements(userId);
    const hasAchievement = userAchievements.some(
      (a) => a.type === achievementType
    );

    if (!hasAchievement) {
      const achievement = ACHIEVEMENTS[achievementType];
      const newAchievement: InsertAchievement = {
        userId,
        ...achievement,
      };
      await storage.addAchievement(newAchievement);
    }
  }

  // Award a new badge
  async awardBadge(userId: number, badgeData: { name: string; icon: string }): Promise<void> {
    const newBadge: InsertBadge = {
      userId,
      name: badgeData.name,
      icon: badgeData.icon,
    };
    await storage.addBadge(newBadge);
  }

  // Process tip submission rewards
  async processTipSubmission(userId: number, tipAmount: number): Promise<void> {
    // Increment tip count
    await storage.incrementTipCount(userId);

    // Check for first tip achievement
    await this.checkAndAwardAchievement(userId, "FIRST_TIP");

    // Check for high impact achievement
    if (tipAmount >= 1000000) {
      await this.checkAndAwardAchievement(userId, "HIGH_IMPACT");
    }

    // Award base points
    let points = 10;

    // Bonus points for high-value tips
    if (tipAmount >= 1000000) points += 20;
    if (tipAmount >= 10000000) points += 50;

    await storage.addPoints(userId, points);
    await this.updateRankIfNeeded(userId);
  }
}

export const gamificationService = new GamificationService();