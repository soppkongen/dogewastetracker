import { wasteItems, wasteTips, users, achievements, badges, comments } from "@shared/schema";
import { type WasteItem, type User, type WasteTip, type Achievement, type Badge,
         type InsertWasteItem, type InsertUser, type InsertWasteTip, 
         type InsertAchievement, type InsertBadge, type Comment, type InsertComment } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export interface IStorage {
  // Waste Items
  getWasteItems(): Promise<WasteItem[]>;
  addWasteItem(item: InsertWasteItem): Promise<WasteItem>;
  incrementShares(id: number): Promise<void>;
  convertTipToWaste(tip: WasteTip): Promise<WasteItem>; // Added method signature

  // Users
  getUser(id: number): Promise<User | undefined>;
  getTopUsers(limit: number): Promise<User[]>;
  getWeeklyLeaders(limit: number): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  addPoints(userId: number, points: number): Promise<void>;
  updateRank(userId: number, rank: string): Promise<void>;
  incrementTipCount(userId: number): Promise<void>;

  // Tips
  submitTip(tip: InsertWasteTip): Promise<WasteTip>;
  getTips(): Promise<WasteTip[]>;
  updateTipImpact(tipId: number, impactScore: number): Promise<void>;

  // Achievements
  getAchievements(userId: number): Promise<Achievement[]>;
  addAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Badges
  getBadges(userId: number): Promise<Badge[]>;
  addBadge(badge: InsertBadge): Promise<Badge>;
  // Stats
  getTotalImpact(): Promise<number>;
  getTipOfTheDay(): Promise<WasteItem | null>;
  getActiveHunters(): Promise<number>;
  // User stats methods
  getUserStats(userId: number): Promise<{
    totalImpact: number;
    verifiedTips: number;
    totalTips: number;
  }>;
  //Added methods for comments
  getComments(): Promise<Comment[]>;
  addComment(comment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  async getWasteItems(): Promise<WasteItem[]> {
    return await db.select().from(wasteItems);
  }

  async addWasteItem(item: InsertWasteItem): Promise<WasteItem> {
    const [wasteItem] = await db.insert(wasteItems).values(item).returning();
    return wasteItem;
  }

  async incrementShares(id: number): Promise<void> {
    await db
      .update(wasteItems)
      .set({ shares: sql`${wasteItems.shares} + 1` })
      .where(eq(wasteItems.id, id));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(limit);
  }

  async getWeeklyLeaders(limit: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.weeklyPoints))
      .limit(limit);
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async addPoints(userId: number, points: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        points: sql`${users.points} + ${points}`,
        weeklyPoints: sql`${users.weeklyPoints} + ${points}`
      })
      .where(eq(users.id, userId));
  }

  async updateRank(userId: number, rank: string): Promise<void> {
    await db
      .update(users)
      .set({ rank })
      .where(eq(users.id, userId));
  }

  async incrementTipCount(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ totalTips: sql`${users.totalTips} + 1` })
      .where(eq(users.id, userId));
  }

  async submitTip(tip: InsertWasteTip): Promise<WasteTip> {
    const [newTip] = await db.insert(wasteTips).values(tip).returning();
    return newTip;
  }

  async getTips(): Promise<WasteTip[]> {
    return await db.select().from(wasteTips);
  }

  async updateTipImpact(tipId: number, impactScore: number): Promise<void> {
    await db
      .update(wasteTips)
      .set({ impactScore })
      .where(eq(wasteTips.id, tipId));
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async addAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async getBadges(userId: number): Promise<Badge[]> {
    return await db
      .select()
      .from(badges)
      .where(eq(badges.userId, userId))
      .orderBy(desc(badges.earnedAt));
  }

  async addBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }

  async getTotalImpact(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`sum(${wasteItems.amount})` })
      .from(wasteItems);
    return result[0]?.total || 0;
  }

  async getTipOfTheDay(): Promise<WasteItem | null> {
    const [tip] = await db
      .select()
      .from(wasteItems)
      .orderBy(desc(wasteItems.shares))
      .limit(1);
    return tip || null;
  }

  async getActiveHunters(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(distinct ${wasteTips.userId})` })
      .from(wasteTips)
      .where(
        sql`${wasteTips.verified} > 0 AND created_at >= NOW() - INTERVAL '7 days'`
      );
    return result[0]?.count || 0;
  }

  async convertTipToWaste(tip: WasteTip): Promise<WasteItem> {
    const [wasteItem] = await db.insert(wasteItems).values({
      title: tip.title,
      description: tip.description,
      amount: tip.amount,
      location: tip.location,
      year: new Date().getFullYear(),
      evidence: tip.evidence,
      source: "user-submitted" // Mark as user-submitted
    }).returning();
    return wasteItem;
  }

  async getUserStats(userId: number): Promise<{ totalImpact: number; verifiedTips: number; totalTips: number; }> {
    const tips = await db
      .select()
      .from(wasteTips)
      .where(eq(wasteTips.userId, userId));

    const verifiedTips = tips.filter(tip => tip.verified > 0);
    const totalImpact = tips.reduce((sum, tip) => sum + tip.amount, 0);

    return {
      totalImpact,
      verifiedTips: verifiedTips.length,
      totalTips: tips.length
    };
  }
  async getComments(): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt));
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }
}

export const storage = new DatabaseStorage();