import {
  users,
  sessionTypes,
  userSessions,
  sleepEntries,
  stressEntries,
  type User,
  type UpsertUser,
  type SessionType,
  type UserSession,
  type SleepEntry,
  type StressEntry,
  type InsertUserSession,
  type InsertSleepEntry,
  type InsertStressEntry,
  type InsertSessionType,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, and, gte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Session type operations
  getSessionTypes(): Promise<SessionType[]>;
  createSessionType(sessionType: InsertSessionType): Promise<SessionType>;
  
  // User session operations
  getUserSessions(userId: string, limit?: number): Promise<UserSession[]>;
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSessionStats(userId: string): Promise<{
    totalSessions: number;
    currentStreak: number;
    totalMinutes: number;
  }>;
  
  // Sleep tracking
  createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry>;
  getUserSleepEntries(userId: string, limit?: number): Promise<SleepEntry[]>;
  
  // Stress tracking
  createStressEntry(entry: InsertStressEntry): Promise<StressEntry>;
  getUserStressEntries(userId: string, limit?: number): Promise<StressEntry[]>;
  
  // Analytics
  getUserInsights(userId: string): Promise<{
    consistencyScore: number;
    averageSleepQuality: number;
    stressImprovement: number;
    favoriteSessionType: string;
    peakTime: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getSessionTypes(): Promise<SessionType[]> {
    return await db.select().from(sessionTypes);
  }

  async createSessionType(sessionType: InsertSessionType): Promise<SessionType> {
    const [created] = await db.insert(sessionTypes).values(sessionType).returning();
    return created;
  }

  async getUserSessions(userId: string, limit = 10): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.completedAt))
      .limit(limit);
  }

  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [created] = await db.insert(userSessions).values(session).returning();
    return created;
  }

  async getUserSessionStats(userId: string): Promise<{
    totalSessions: number;
    currentStreak: number;
    totalMinutes: number;
  }> {
    // Get total sessions
    const [totalResult] = await db
      .select({ count: count() })
      .from(userSessions)
      .where(eq(userSessions.userId, userId));

    // Get total minutes (duration is in seconds, convert to minutes)
    const sessions = await db
      .select({ duration: userSessions.duration })
      .from(userSessions)
      .where(eq(userSessions.userId, userId));

    const totalMinutes = Math.round(
      sessions.reduce((sum, session) => sum + (session.duration || 60), 0) / 60
    );

    // Calculate current streak (simplified - count consecutive days with sessions)
    const recentSessions = await db
      .select({ completedAt: userSessions.completedAt })
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.completedAt))
      .limit(30);

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasSessionOnDate = recentSessions.some(session => {
        if (!session.completedAt) return false;
        const sessionDate = new Date(session.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (hasSessionOnDate) {
        currentStreak++;
      } else if (i > 0) { // Allow today to be empty if it's the first check
        break;
      }
    }

    return {
      totalSessions: totalResult.count,
      currentStreak,
      totalMinutes,
    };
  }

  async createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry> {
    const [created] = await db.insert(sleepEntries).values(entry).returning();
    return created;
  }

  async getUserSleepEntries(userId: string, limit = 10): Promise<SleepEntry[]> {
    return await db
      .select()
      .from(sleepEntries)
      .where(eq(sleepEntries.userId, userId))
      .orderBy(desc(sleepEntries.createdAt))
      .limit(limit);
  }

  async createStressEntry(entry: InsertStressEntry): Promise<StressEntry> {
    const [created] = await db.insert(stressEntries).values(entry).returning();
    return created;
  }

  async getUserStressEntries(userId: string, limit = 10): Promise<StressEntry[]> {
    return await db
      .select()
      .from(stressEntries)
      .where(eq(stressEntries.userId, userId))
      .orderBy(desc(stressEntries.createdAt))
      .limit(limit);
  }

  async getUserInsights(userId: string): Promise<{
    consistencyScore: number;
    averageSleepQuality: number;
    stressImprovement: number;
    favoriteSessionType: string;
    peakTime: string;
  }> {
    // Calculate consistency score based on sessions in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          gte(userSessions.completedAt, sevenDaysAgo)
        )
      );

    const uniqueDays = new Set(
      recentSessions.map(session => 
        session.completedAt ? new Date(session.completedAt).toDateString() : ''
      ).filter(Boolean)
    ).size;

    const consistencyScore = Math.round((uniqueDays / 7) * 100);

    // Average sleep quality
    const [sleepAvg] = await db
      .select({ avg: avg(sleepEntries.sleepQuality) })
      .from(sleepEntries)
      .where(eq(sleepEntries.userId, userId));

    const averageSleepQuality = sleepAvg.avg ? Number(sleepAvg.avg) : 0;

    // Stress improvement (simplified - compare recent vs older entries)
    const recentStress = await db
      .select({ avg: avg(stressEntries.stressLevel) })
      .from(stressEntries)
      .where(
        and(
          eq(stressEntries.userId, userId),
          gte(stressEntries.createdAt, sevenDaysAgo)
        )
      );

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const olderStress = await db
      .select({ avg: avg(stressEntries.stressLevel) })
      .from(stressEntries)
      .where(
        and(
          eq(stressEntries.userId, userId),
          gte(stressEntries.createdAt, fourteenDaysAgo)
        )
      );

    const recentAvg = recentStress[0]?.avg ? Number(recentStress[0].avg) : 5;
    const olderAvg = olderStress[0]?.avg ? Number(olderStress[0].avg) : 5;
    const stressImprovement = Math.round(((olderAvg - recentAvg) / olderAvg) * 100);

    // Find most popular session type
    const sessionTypeCounts = await db
      .select({
        sessionTypeId: userSessions.sessionTypeId,
        count: count()
      })
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .groupBy(userSessions.sessionTypeId)
      .orderBy(desc(count()))
      .limit(1);

    let favoriteSessionType = "Breathing";
    if (sessionTypeCounts.length > 0) {
      const [sessionType] = await db
        .select()
        .from(sessionTypes)
        .where(eq(sessionTypes.id, sessionTypeCounts[0].sessionTypeId));
      favoriteSessionType = sessionType?.name || "Breathing";
    }

    // Find peak time (hour with most sessions)
    const hourCounts: { [key: number]: number } = {};
    recentSessions.forEach(session => {
      if (session.completedAt) {
        const hour = new Date(session.completedAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    let peakHour = 14; // Default to 2 PM
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    });

    const peakTime = `${peakHour % 12 || 12}:${peakHour < 12 ? '00 AM' : '00 PM'}`;

    return {
      consistencyScore,
      averageSleepQuality: Number(averageSleepQuality.toFixed(1)),
      stressImprovement,
      favoriteSessionType,
      peakTime,
    };
  }
}

export const storage = new DatabaseStorage();
