import { type User, type InsertUser, type Subscription, type InsertSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
  updateSubscriptionStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Subscription>;
  getAllSubscriptions(): Promise<Subscription[]>;
  getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    thisMonth: number;
    revenue: number;
    conversionRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.users = new Map();
    this.subscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const now = new Date();
    const amount = insertSubscription.plano === "pix" ? "297.00" : "29.70";
    
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      amount,
      status: "pending",
      stripePaymentIntentId: null,
      stripeCustomerId: null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (sub) => sub.email === email,
    );
  }

  async updateSubscriptionStatus(
    id: string, 
    status: string, 
    stripePaymentIntentId?: string
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const updated: Subscription = {
      ...subscription,
      status,
      stripePaymentIntentId: stripePaymentIntentId || subscription.stripePaymentIntentId,
      updatedAt: new Date(),
    };

    this.subscriptions.set(id, updated);
    return updated;
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    thisMonth: number;
    revenue: number;
    conversionRate: number;
  }> {
    const allSubs = Array.from(this.subscriptions.values());
    const confirmedSubs = allSubs.filter(sub => sub.status === "confirmed");
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthSubs = confirmedSubs.filter(sub => sub.createdAt >= firstDayOfMonth);
    
    const revenue = confirmedSubs.reduce((total, sub) => {
      return total + parseFloat(sub.amount);
    }, 0);

    return {
      totalSubscriptions: confirmedSubs.length,
      thisMonth: thisMonthSubs.length,
      revenue,
      conversionRate: allSubs.length > 0 ? (confirmedSubs.length / allSubs.length) * 100 : 0,
    };
  }
}

export const storage = new MemStorage();
