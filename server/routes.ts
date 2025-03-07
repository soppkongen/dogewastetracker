import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { gamificationService } from "./services/gamification";
import { insertWasteSchema, insertTipSchema, type InsertWasteItem, type InsertUser } from "@shared/schema";
import { insertCommentSchema } from "@shared/schema";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // First check if we have any data
  let existingItems;
  try {
    existingItems = await storage.getWasteItems();
  } catch (error) {
    console.error("Error checking existing items:", error);
    existingItems = [];
  }

  // Only initialize sample data if no items exist
  if (existingItems.length === 0) {
    const sampleWaste: InsertWasteItem[] = [
      {
        title: "$20M on Unused Trash Cans",
        description: "Brand new smart trash cans left in storage",
        amount: 20000000,
        location: "NYC",
        year: 2023,
        source: "official"
      },
      {
        title: "$482M on Monkey Research",
        description: "Study on primate alcohol consumption patterns",
        amount: 482000000,
        location: "NIH Labs",
        year: 2023,
        source: "official"
      },
      {
        title: "$100M on Alien Probes",
        description: "Research project investigating extraterrestrial communications",
        amount: 100000000,
        location: "Area 51",
        year: 2024,
        source: "official"
      },
      {
        title: "$15M on Ghost Town Wi-Fi",
        description: "Installing high-speed internet in abandoned mining towns",
        amount: 15000000,
        location: "Nevada",
        year: 2024,
        source: "official"
      },
      {
        title: "$250M on Luxury Office Renovation",
        description: "Gold-plated fixtures and marble flooring for administrative building",
        amount: 250000000,
        location: "Washington DC",
        year: 2024,
        source: "official"
      },
      {
        title: "$75M on Robot Dogs",
        description: "Autonomous quadruped robots for office security",
        amount: 75000000,
        location: "Pentagon",
        year: 2024,
        source: "official"
      },
      {
        title: "$30M on Cosmic Ray Detection",
        description: "Installing cosmic ray detectors in government parking lots",
        amount: 30000000,
        location: "Various",
        year: 2024,
        source: "official"
      },
      {
        title: "$180M on Virtual Reality Training",
        description: "VR headsets for teaching basic office procedures",
        amount: 180000000,
        location: "Federal Offices",
        year: 2024,
        source: "official"
      },
      {
        title: "$45M on Artisanal Water",
        description: "Premium bottled water service for government meetings",
        amount: 45000000,
        location: "Capitol Hill",
        year: 2024,
        source: "official"
      },
      {
        title: "$95M on Time Travel Research",
        description: "Theoretical physics study on bureaucratic efficiency through temporal manipulation",
        amount: 95000000,
        location: "DARPA",
        year: 2024,
        source: "official"
      },
      {
        title: "Congressional Office Automation",
        description: "New report shows Congress spent $25M on AI tools that remain unused due to 'lack of training programs' and 'resistance to change' according to @GovEfficiency",
        amount: 25000000,
        location: "Congress",
        year: 2024,
        source: "social",
        authorHandle: "@GovWatchdog",
        platformIcon: "X",
        postUrl: "https://x.com/GovWatchdog/status/1234567890"
      },
      {
        title: "Digital Transformation Failure",
        description: "Breaking: Department of Government Efficiency's $150M digital transformation project abandoned after 2 years. Consultants blame 'complex legacy systems' while employees never received promised training. #GovWaste",
        amount: 150000000,
        location: "Department of Government Efficiency",
        year: 2024,
        source: "social",
        authorHandle: "@TechOversight",
        platformIcon: "X",
        postUrl: "https://x.com/TechOversight/status/1234567891"
      },
      {
        title: "Redundant Software Licenses",
        description: "FOIA request reveals: Gov agencies spent $85M on duplicate software licenses in 2023. Same tools, different departments, zero coordination. Time for a centralized procurement system?",
        amount: 85000000,
        location: "Multiple Agencies",
        year: 2024,
        source: "social",
        authorHandle: "@GovSpendingAlert",
        platformIcon: "X",
        postUrl: "https://x.com/GovSpendingAlert/status/1234567892"
      },
      {
        title: "Empty Office Space Costs",
        description: "Post-pandemic update: Federal government still paying $200M annually for empty office space in DC area. Remote work is here to stay, why aren't we adapting? Data from @GSA_Gov",
        amount: 200000000,
        location: "Washington DC",
        year: 2024,
        source: "social",
        authorHandle: "@FedSpaceWatch",
        platformIcon: "X",
        postUrl: "https://x.com/FedSpaceWatch/status/1234567893"
      }
    ];

    try {
      for (const item of sampleWaste) {
        await storage.addWasteItem(item);
      }
      console.log("Sample waste items initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // Initialize sample user if no users exist
  try {
    const users = await storage.getTopUsers(1);
    if (users.length === 0) {
      const sampleUser: InsertUser = {
        username: "WasteHunter",
      };
      await storage.createUser(sampleUser);
    }
  } catch (error) {
    console.error("Error checking/creating sample user:", error);
  }

  // Get waste items
  app.get("/api/waste", async (_req, res) => {
    try {
      const items = await storage.getWasteItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching waste items:", error);
      res.status(500).json({ error: "Failed to fetch waste items" });
    }
  });

  // Share waste item
  app.post("/api/waste/:id/share", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementShares(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error sharing waste item:", error);
      res.status(500).json({ error: "Failed to share waste item" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const users = await storage.getTopUsers(5);
      res.json(users);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Get weekly leaderboard
  app.get("/api/leaderboard/weekly", async (_req, res) => {
    try {
      const users = await storage.getWeeklyLeaders(5);
      res.json(users);
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch weekly leaderboard" });
    }
  });

  // Get user achievements
  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements(parseInt(req.params.userId));
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch user achievements" });
    }
  });

  // Get user badges
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const badges = await storage.getBadges(parseInt(req.params.userId));
      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ error: "Failed to fetch user badges" });
    }
  });

  // Submit tip
  app.post("/api/tips", upload.none(), async (req, res) => {
    try {
      console.log('Received tip submission:', req.body);
      const tipData = {
        userId: 1, // Hardcoded for demo
        title: req.body.title,
        description: req.body.description,
        amount: parseInt(req.body.amount),
        location: req.body.location,
      };

      // Validate the data
      const validatedData = insertTipSchema.parse(tipData);

      // Store the tip
      const tip = await storage.submitTip(validatedData);

      // Convert tip to waste item and add to feed
      await storage.convertTipToWaste({
        ...tip,
        source: 'user-submitted',
        year: new Date().getFullYear()
      });

      // Process gamification
      await gamificationService.processTipSubmission(validatedData.userId, validatedData.amount);

      console.log('Tip successfully submitted and converted:', tip);
      res.json(tip);
    } catch (error) {
      console.error('Error submitting tip:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const [totalImpact, tipOfTheDay, activeHunters] = await Promise.all([
        storage.getTotalImpact(),
        storage.getTipOfTheDay(),
        storage.getActiveHunters(),
      ]);

      res.json({
        totalImpact,
        tipOfTheDay,
        activeHunters,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Add new endpoint for detailed leaderboard data
  app.get("/api/leaderboard/detailed", async (_req, res) => {
    try {
      const users = await storage.getTopUsers(10);
      const detailedUsers = await Promise.all(users.map(async (user) => {
        const [achievements, badges, tips] = await Promise.all([
          storage.getAchievements(user.id),
          storage.getBadges(user.id),
          storage.getTips()
        ]);

        const userTips = tips.filter(tip => tip.userId === user.id);
        const verifiedTips = userTips.filter(tip => tip.verified > 0);
        const totalImpact = userTips.reduce((sum, tip) => sum + tip.amount, 0);

        return {
          ...user,
          achievements,
          badges,
          verificationRate: userTips.length ? (verifiedTips.length / userTips.length) * 100 : 0,
          totalImpact,
          tipCount: userTips.length
        };
      }));

      res.json(detailedUsers);
    } catch (error) {
      console.error('Error fetching detailed leaderboard:', error);
      res.status(500).json({ message: "Failed to fetch leaderboard data" });
    }
  });

  // Get comments
  app.get("/api/comments", async (_req, res) => {
    try {
      const comments = await storage.getComments();
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Add comment
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = {
        userId: 1, // Hardcoded for demo
        content: req.body.content,
      };

      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.addComment(validatedData);

      res.json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to add comment' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}