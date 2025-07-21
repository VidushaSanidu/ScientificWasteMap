import {
  users,
  disposalLocations,
  events,
  feedback,
  stats,
  type User,
  type UpsertUser,
  type DisposalLocation,
  type InsertDisposalLocation,
  type Event,
  type InsertEvent,
  type Feedback,
  type InsertFeedback,
  type Stats,
  type InsertStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Disposal locations
  getDisposalLocations(): Promise<DisposalLocation[]>;
  getDisposalLocationsByType(type: string): Promise<DisposalLocation[]>;
  createDisposalLocation(
    location: InsertDisposalLocation
  ): Promise<DisposalLocation>;
  updateDisposalLocation(
    id: number,
    location: Partial<InsertDisposalLocation>
  ): Promise<DisposalLocation | undefined>;
  deleteDisposalLocation(id: number): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(
    id: number,
    event: Partial<InsertEvent>
  ): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  joinEvent(eventId: number): Promise<Event | undefined>;

  // Feedback
  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedbackData: InsertFeedback): Promise<Feedback>;
  updateFeedbackStatus(
    id: number,
    status: string,
    response?: string
  ): Promise<Feedback | undefined>;

  // Stats
  getStats(): Promise<Stats | undefined>;
  updateStats(statsData: InsertStats): Promise<Stats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by email:", email);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      console.log("User found:", user ? "yes" : "no");
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Database error while fetching user");
    }
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

  // Disposal locations
  async getDisposalLocations(): Promise<DisposalLocation[]> {
    return await db
      .select()
      .from(disposalLocations)
      .where(eq(disposalLocations.isActive, true));
  }

  async getDisposalLocationsByType(type: string): Promise<DisposalLocation[]> {
    return await db
      .select()
      .from(disposalLocations)
      .where(
        and(
          eq(disposalLocations.type, type),
          eq(disposalLocations.isActive, true)
        )
      );
  }

  async createDisposalLocation(
    location: InsertDisposalLocation
  ): Promise<DisposalLocation> {
    const [newLocation] = await db
      .insert(disposalLocations)
      .values(location)
      .returning();
    return newLocation;
  }

  async updateDisposalLocation(
    id: number,
    location: Partial<InsertDisposalLocation>
  ): Promise<DisposalLocation | undefined> {
    const [updatedLocation] = await db
      .update(disposalLocations)
      .set({ ...location, updatedAt: new Date() })
      .where(eq(disposalLocations.id, id))
      .returning();
    return updatedLocation;
  }

  async deleteDisposalLocation(id: number): Promise<boolean> {
    const [deletedLocation] = await db
      .update(disposalLocations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(disposalLocations.id, id))
      .returning();
    return !!deletedLocation;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.isActive, true))
      .orderBy(desc(events.eventDate));
  }

  async getActiveEvents(): Promise<Event[]> {
    const now = new Date();
    return await db
      .select()
      .from(events)
      .where(and(eq(events.isActive, true)))
      .orderBy(events.eventDate);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(
    id: number,
    event: Partial<InsertEvent>
  ): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const [deletedEvent] = await db
      .update(events)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return !!deletedEvent;
  }

  async joinEvent(eventId: number): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));
    if (
      !event ||
      (event.currentParticipants ?? 0) >= (event.maxParticipants ?? 0)
    ) {
      return undefined;
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        currentParticipants: (event.currentParticipants ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    return updatedEvent;
  }

  // Feedback
  async getFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackData)
      .returning();
    return newFeedback;
  }

  async updateFeedbackStatus(
    id: number,
    status: string,
    response?: string
  ): Promise<Feedback | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (response) {
      updateData.adminResponse = response;
    }

    const [updatedFeedback] = await db
      .update(feedback)
      .set(updateData)
      .where(eq(feedback.id, id))
      .returning();

    return updatedFeedback;
  }

  // Stats
  async getStats(): Promise<Stats | undefined> {
    const [statsData] = await db.select().from(stats).limit(1);
    return statsData;
  }

  async updateStats(statsData: InsertStats): Promise<Stats> {
    const existing = await this.getStats();

    if (existing) {
      const [updatedStats] = await db
        .update(stats)
        .set({ ...statsData, updatedAt: new Date() })
        .where(eq(stats.id, existing.id))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db.insert(stats).values(statsData).returning();
      return newStats;
    }
  }
}

export const storage = new DatabaseStorage();
