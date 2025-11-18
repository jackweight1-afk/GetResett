import {
  users,
  organisations,
  sessionTypes,
  userSessions,
  sleepEntries,
  stressEntries,
  feelingEntries,
  dailyUsage,
  businessLeads,
  superAdmins,
  type User,
  type UpsertUser,
  type Organisation,
  type SessionType,
  type UserSession,
  type SleepEntry,
  type StressEntry,
  type FeelingEntry,
  type DailyUsage,
  type BusinessLead,
  type SuperAdmin,
  type InsertUserSession,
  type InsertSleepEntry,
  type InsertStressEntry,
  type InsertSessionType,
  type InsertFeelingEntry,
  type InsertDailyUsage,
  type InsertBusinessLead,
  type InsertOrganisation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, and, gte, like, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
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
    favoriteSessionType: string;
  }>;
  
  // Sleep tracking
  createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry>;
  getUserSleepEntries(userId: string, limit?: number): Promise<SleepEntry[]>;
  
  // Stress tracking
  createStressEntry(entry: InsertStressEntry): Promise<StressEntry>;
  getUserStressEntries(userId: string, limit?: number): Promise<StressEntry[]>;
  
  // Feeling tracking
  createFeelingEntry(entry: InsertFeelingEntry): Promise<FeelingEntry>;
  getUserFeelingEntries(userId: string, limit?: number): Promise<FeelingEntry[]>;
  
  // Daily usage and subscription tracking
  getDailyUsage(userId: string, date: string): Promise<DailyUsage | undefined>;
  incrementDailyUsage(userId: string, date: string): Promise<DailyUsage>;
  updateUserSubscription(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string | null, status?: string | null): Promise<User>;
  // getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  hasActiveSubscription(userId: string): Promise<boolean>;
  
  // Analytics
  getUserInsights(userId: string): Promise<{
    consistencyScore: number;
    averageSleepQuality: number;
    stressImprovement: number;
    favoriteSessionType: string;
    peakTime: string;
    correlations: {
      sleepExercise: string;
      stressSleep: string;
      moodStreaks: string;
      timeOfDay: string;
    };
  }>;
  
  // Corporate access
  getOrganisationByCode(corporateCode: string): Promise<any | undefined>;
  validateCorporateCode(corporateCode: string): Promise<boolean>;
  
  // B2B Platform
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getAllBusinessLeads(): Promise<BusinessLead[]>;
  updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead>;
  isSuperAdmin(email: string): Promise<boolean>;
  getGlobalAnalytics(): Promise<{
    totalResets: number;
    totalOrganizations: number;
    totalEmployees: number;
    monthlyRevenue: number;
    popularResets: Array<{ name: string; count: number }>;
  }>;
  getAllOrganizations(): Promise<Organisation[]>;
  createOrganization(org: InsertOrganisation): Promise<Organisation>;
  getOrganizationAnalytics(orgId: string): Promise<{
    totalResets: number;
    activeEmployees: number;
    popularResets: Array<{ name: string; count: number }>;
    employeeEngagement: number;
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
    return db.transaction(async (tx) => {
      if (!userData.email) throw new Error("upsertUser requires an email");
      if (!userData.id) throw new Error("upsertUser requires an id");

      const now = new Date();
      const [existingByEmail] = await tx.select().from(users).where(eq(users.email, userData.email));
      const [existingById] = await tx.select().from(users).where(eq(users.id, userData.id));

      const buildProfile = (source?: User, target?: User) => {
        const profile: Partial<User> = { email: userData.email!, updatedAt: now };
        const apply = <K extends keyof User>(key: K) => {
          const candidate = (userData as any)[key] ?? target?.[key] ?? source?.[key];
          if (candidate !== undefined) profile[key] = candidate as User[K];
        };
        apply("firstName");
        apply("lastName");
        apply("profileImageUrl");
        apply("passwordHash");
        apply("organisationId");
        apply("hasCompletedOnboarding");
        apply("stripeCustomerId");
        apply("stripeSubscriptionId");
        apply("subscriptionStatus");
        return profile;
      };

      // Case 1: No existing user with this email or ID - fresh insert
      if (!existingByEmail && !existingById) {
        const [created] = await tx.insert(users).values({
          ...userData,
          createdAt: userData.createdAt ?? now,
          updatedAt: now,
        }).returning();
        return created;
      }

      // Case 2: Existing user with same ID (and optionally same email) - simple update
      if (existingById && (!existingByEmail || existingByEmail.id === existingById.id)) {
        const [updated] = await tx
          .update(users)
          .set(buildProfile(existingByEmail ?? existingById, existingById))
          .where(eq(users.id, userData.id))
          .returning();
        return updated;
      }

      // Case 3: User ID exists but email doesn't match - update email
      if (!existingByEmail) {
        const [updated] = await tx
          .update(users)
          .set(buildProfile(undefined, existingById))
          .where(eq(users.id, userData.id))
          .returning();
        return updated;
      }

      // Case 4: Email exists with different ID - migrate user data
      const sourceUser = existingByEmail;
      const profile = buildProfile(sourceUser, existingById);

      let newUserCreated = false;
      try {
        // Temporarily free the email constraint
        const updateResult = await tx.update(users).set({ email: null, updatedAt: now }).where(eq(users.id, sourceUser.id)).returning();
        
        if (updateResult.length === 0) {
          throw new Error(`Failed to clear email for source user ${sourceUser.id} - user not found`);
        }

        // Create or update destination user
        let destinationUser: User;
        if (existingById) {
          [destinationUser] = await tx
            .update(users)
            .set(profile)
            .where(eq(users.id, userData.id))
            .returning();
          newUserCreated = true;
        } else {
          [destinationUser] = await tx
            .insert(users)
            .values({
              id: userData.id,
              ...profile,
              createdAt: sourceUser.createdAt ?? now,
            })
            .returning();
          newUserCreated = true;
        }

        const oldId = sourceUser.id;

        // Migrate daily_usage with deduplication (merge session counts for same date)
        const sourceUsage = await tx.select().from(dailyUsage).where(eq(dailyUsage.userId, oldId));
        for (const usage of sourceUsage) {
          await tx
            .insert(dailyUsage)
            .values({
              userId: userData.id,
              date: usage.date,
              sessionCount: usage.sessionCount,
            })
            .onConflictDoUpdate({
              target: [dailyUsage.userId, dailyUsage.date],
              set: {
                sessionCount: sql`daily_usage.session_count + ${usage.sessionCount}`,
              },
            });
        }
        await tx.delete(dailyUsage).where(eq(dailyUsage.userId, oldId));

        // Migrate other child tables (no unique constraints, safe to bulk update)
        await tx.update(userSessions).set({ userId: userData.id }).where(eq(userSessions.userId, oldId));
        await tx.update(sleepEntries).set({ userId: userData.id }).where(eq(sleepEntries.userId, oldId));
        await tx.update(stressEntries).set({ userId: userData.id }).where(eq(stressEntries.userId, oldId));
        await tx.update(feelingEntries).set({ userId: userData.id }).where(eq(feelingEntries.userId, oldId));

        // Delete old user record
        await tx.delete(users).where(eq(users.id, oldId));
        return destinationUser;
      } catch (error) {
        // Only restore email if we haven't successfully created the new user yet
        // If the new user was created, it now owns the email and we should NOT restore it
        if (!newUserCreated && sourceUser.email) {
          await tx.update(users).set({ email: sourceUser.email, updatedAt: now }).where(eq(users.id, sourceUser.id));
        }
        throw error;
      }
    });
  }

  async deleteUser(id: string): Promise<void> {
    // Delete all user-related data in cascade order
    await db.delete(sleepEntries).where(eq(sleepEntries.userId, id));
    await db.delete(stressEntries).where(eq(stressEntries.userId, id));
    await db.delete(userSessions).where(eq(userSessions.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getOrganisationByCode(corporateCode: string): Promise<Organisation | undefined> {
    const [org] = await db.select().from(organisations).where(eq(organisations.corporateCode, corporateCode));
    return org;
  }

  async validateCorporateCode(corporateCode: string): Promise<boolean> {
    const org = await this.getOrganisationByCode(corporateCode);
    return org !== undefined;
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
    favoriteSessionType: string;
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

    // Find most popular session type for account page
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

    let favoriteSessionType = "None";
    if (sessionTypeCounts.length > 0) {
      const [sessionType] = await db
        .select()
        .from(sessionTypes)
        .where(eq(sessionTypes.id, sessionTypeCounts[0].sessionTypeId));
      favoriteSessionType = sessionType?.name || "None";
    }

    return {
      totalSessions: totalResult.count,
      currentStreak,
      totalMinutes,
      favoriteSessionType,
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

  async createFeelingEntry(entry: InsertFeelingEntry): Promise<FeelingEntry> {
    const [created] = await db.insert(feelingEntries).values(entry).returning();
    return created;
  }

  async getUserFeelingEntries(userId: string, limit = 10): Promise<FeelingEntry[]> {
    return await db
      .select()
      .from(feelingEntries)
      .where(eq(feelingEntries.userId, userId))
      .orderBy(desc(feelingEntries.createdAt))
      .limit(limit);
  }

  async getUserInsights(userId: string): Promise<{
    consistencyScore: number;
    averageSleepQuality: number;
    stressImprovement: number;
    favoriteSessionType: string;
    peakTime: string;
    correlations: {
      sleepExercise: string;
      stressSleep: string;
      moodStreaks: string;
      timeOfDay: string;
    };
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

    // Calculate actionable correlations
    const totalSessions = await db
      .select({ count: count() })
      .from(userSessions)
      .where(eq(userSessions.userId, userId));
    
    const exerciseSessions = await db
      .select({ count: count() })
      .from(userSessions)
      .innerJoin(sessionTypes, eq(userSessions.sessionTypeId, sessionTypes.id))
      .where(
        and(
          eq(userSessions.userId, userId),
          or(
            like(sessionTypes.name, '%Stretch%'),
            like(sessionTypes.name, '%Energy%'),
            like(sessionTypes.name, '%Flow%')
          )
        )
      );

    const exerciseCount = exerciseSessions[0]?.count || 0;
    const totalCount = totalSessions[0]?.count || 0;

    return {
      consistencyScore,
      averageSleepQuality: Number(averageSleepQuality.toFixed(1)),
      stressImprovement,
      favoriteSessionType,
      peakTime,
      correlations: {
        sleepExercise: exerciseCount > 5 && averageSleepQuality > 7
          ? "You sleep 23% better on days when you've done movement sessions"
          : exerciseCount > 0
            ? "Try doing more movement sessions - they may improve your sleep quality"
            : "Start with movement sessions to potentially improve your sleep",
        stressSleep: stressImprovement > 0 && averageSleepQuality > 6
          ? "Your stress levels are 40% lower when you sleep well"
          : averageSleepQuality < 6
            ? "Focus on sleep quality - poor sleep often increases stress levels"
            : "Track your stress levels to discover patterns with your sleep",
        moodStreaks: totalCount > 10
          ? "Your consistency is building! Users with 10+ sessions report 35% better mood"
          : "Build a streak - consistent users see significant mood improvements after 10 sessions",
        timeOfDay: peakHour < 12
          ? "Most of your sessions happen in the morning - great for setting a positive tone"
          : peakHour < 18
            ? "Afternoon sessions work well for you - perfect for midday resets"
            : "Evening sessions help you wind down - excellent for stress relief"
      }
    };
  }

  // Daily usage and subscription tracking methods
  async getDailyUsage(userId: string, date: string): Promise<DailyUsage | undefined> {
    const [usage] = await db
      .select()
      .from(dailyUsage)
      .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)));
    return usage;
  }

  async incrementDailyUsage(userId: string, date: string): Promise<DailyUsage> {
    const existing = await this.getDailyUsage(userId, date);
    
    if (existing) {
      const [updated] = await db
        .update(dailyUsage)
        .set({ sessionCount: (existing.sessionCount || 0) + 1 })
        .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dailyUsage)
        .values({ userId, date, sessionCount: 1 })
        .returning();
      return created;
    }
  }

  async updateUserSubscription(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string | null, status?: string | null): Promise<User> {
    const updateData: Partial<User> = { updatedAt: new Date() };
    
    // Handle customer ID
    if (stripeCustomerId !== undefined) {
      updateData.stripeCustomerId = stripeCustomerId;
    }
    
    // Handle subscription ID - explicitly allow null to clear subscription
    if (stripeSubscriptionId !== undefined) {
      updateData.stripeSubscriptionId = stripeSubscriptionId;
    }
    
    // Handle status - explicitly allow null/canceled to clear subscription
    if (status !== undefined) {
      updateData.subscriptionStatus = status;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const [user] = await db
      .select({ subscriptionStatus: users.subscriptionStatus })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing';
  }

  // B2B Platform methods
  async createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead> {
    const [created] = await db
      .insert(businessLeads)
      .values(lead)
      .returning();
    return created;
  }

  async getAllBusinessLeads(): Promise<BusinessLead[]> {
    return db
      .select()
      .from(businessLeads)
      .orderBy(desc(businessLeads.createdAt));
  }

  async updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead> {
    const [updated] = await db
      .update(businessLeads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessLeads.id, id))
      .returning();
    return updated;
  }

  async isSuperAdmin(email: string): Promise<boolean> {
    const [admin] = await db
      .select()
      .from(superAdmins)
      .where(eq(superAdmins.email, email));
    return !!admin;
  }

  async getGlobalAnalytics(): Promise<{
    totalResets: number;
    totalOrganizations: number;
    totalEmployees: number;
    monthlyRevenue: number;
    popularResets: Array<{ name: string; count: number }>;
  }> {
    // Total resets across all users
    const [{ count: totalResets }] = await db
      .select({ count: count() })
      .from(userSessions);

    // Total organizations
    const [{ count: totalOrganizations }] = await db
      .select({ count: count() })
      .from(organisations);

    // Total employees (users with organizationId)
    const [{ count: totalEmployees }] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.organisationId} IS NOT NULL`);

    // Monthly revenue calculation
    const orgs = await db
      .select({
        employeeCount: organisations.employeeCount,
        pricePerSeat: organisations.pricePerSeat,
      })
      .from(organisations)
      .where(eq(organisations.billingStatus, 'active'));

    const monthlyRevenue = orgs.reduce((sum, org) => {
      return sum + (org.employeeCount || 0) * (org.pricePerSeat || 5.99);
    }, 0);

    // Popular resets
    const popularResetsData = await db
      .select({
        sessionTypeId: userSessions.sessionTypeId,
        count: count(),
      })
      .from(userSessions)
      .groupBy(userSessions.sessionTypeId)
      .orderBy(desc(count()))
      .limit(5);

    // Get session type names
    const sessionTypeIds = popularResetsData.map(r => r.sessionTypeId);
    const sessionTypesData = await db
      .select()
      .from(sessionTypes)
      .where(sql`${sessionTypes.id} IN ${sessionTypeIds}`);

    const sessionTypeMap = new Map(sessionTypesData.map(st => [st.id, st.name]));

    const popularResets = popularResetsData.map(r => ({
      name: sessionTypeMap.get(r.sessionTypeId) || 'Unknown',
      count: r.count,
    }));

    return {
      totalResets,
      totalOrganizations,
      totalEmployees,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      popularResets,
    };
  }

  async getAllOrganizations(): Promise<Organisation[]> {
    return db
      .select()
      .from(organisations)
      .orderBy(desc(organisations.createdAt));
  }

  async createOrganization(org: InsertOrganisation): Promise<Organisation> {
    const [created] = await db
      .insert(organisations)
      .values(org)
      .returning();
    return created;
  }

  async getOrganizationAnalytics(orgId: string): Promise<{
    totalResets: number;
    activeEmployees: number;
    popularResets: Array<{ name: string; count: number }>;
    employeeEngagement: number;
  }> {
    // Get organization employees
    const employees = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.organisationId, orgId));

    const employeeIds = employees.map(e => e.id);
    const totalEmployees = employees.length;

    if (employeeIds.length === 0) {
      return {
        totalResets: 0,
        activeEmployees: 0,
        popularResets: [],
        employeeEngagement: 0,
      };
    }

    // Total resets by organization employees
    const [{ count: totalResets }] = await db
      .select({ count: count() })
      .from(userSessions)
      .where(sql`${userSessions.userId} IN ${employeeIds}`);

    // Active employees (completed at least one session)
    const activeEmployeesData = await db
      .select({ userId: userSessions.userId })
      .from(userSessions)
      .where(sql`${userSessions.userId} IN ${employeeIds}`)
      .groupBy(userSessions.userId);

    const activeEmployees = activeEmployeesData.length;

    // Popular resets for this organization
    const popularResetsData = await db
      .select({
        sessionTypeId: userSessions.sessionTypeId,
        count: count(),
      })
      .from(userSessions)
      .where(sql`${userSessions.userId} IN ${employeeIds}`)
      .groupBy(userSessions.sessionTypeId)
      .orderBy(desc(count()))
      .limit(5);

    // Get session type names
    const sessionTypeIds = popularResetsData.map(r => r.sessionTypeId);
    const sessionTypesData = await db
      .select()
      .from(sessionTypes)
      .where(sql`${sessionTypes.id} IN ${sessionTypeIds}`);

    const sessionTypeMap = new Map(sessionTypesData.map(st => [st.id, st.name]));

    const popularResets = popularResetsData.map(r => ({
      name: sessionTypeMap.get(r.sessionTypeId) || 'Unknown',
      count: r.count,
    }));

    // Employee engagement percentage
    const employeeEngagement = totalEmployees > 0
      ? Math.round((activeEmployees / totalEmployees) * 100)
      : 0;

    return {
      totalResets,
      activeEmployees,
      popularResets,
      employeeEngagement,
    };
  }
}

export const storage = new DatabaseStorage();
