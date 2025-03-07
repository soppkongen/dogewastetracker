import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wasteItems = pgTable("waste_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  location: text("location").notNull(),
  year: integer("year").notNull(),
  shares: integer("shares").default(0),
  source: text("source").default("official").notNull(), // 'official', 'user-submitted', or 'social'
  evidence: text("evidence"),
  authorHandle: text("author_handle"), // For social media posts
  platformIcon: text("platform_icon"), // For social media icon
  postUrl: text("post_url"), // For linking to original post
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  points: integer("points").default(0),
  rank: text("rank").default("Rookie"),
  totalTips: integer("total_tips").default(0),
  weeklyPoints: integer("weekly_points").default(0),
});

export const wasteTips = pgTable("waste_tips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  location: text("location").notNull(),
  verified: integer("verified").default(0),
  impactScore: integer("impact_score").default(0),
  evidence: text("evidence"),
  createdAt: timestamp("created_at").defaultNow()
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWasteSchema = createInsertSchema(wasteItems).omit({ id: true, shares: true });
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  points: true, 
  rank: true, 
  totalTips: true,
  weeklyPoints: true 
});
export const insertTipSchema = createInsertSchema(wasteTips).omit({ 
  id: true, 
  verified: true, 
  impactScore: true,
  evidence: true,
  createdAt: true
});
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, earnedAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ 
  id: true,
  createdAt: true 
}).extend({
  content: z.string().max(300, "Comment must not exceed 300 characters")
});

export type WasteItem = typeof wasteItems.$inferSelect;
export type InsertWasteItem = z.infer<typeof insertWasteSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WasteTip = typeof wasteTips.$inferSelect;
export type InsertWasteTip = z.infer<typeof insertTipSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;