import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create subscription
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const validatedData = insertSubscriptionSchema.parse(req.body);
      
      // Create subscription record
      const subscription = await storage.createSubscription(validatedData);
      
      // Set initial status as pending
      await storage.updateSubscriptionStatus(
        subscription.id,
        "pending",
        undefined
      );

      res.json({
        success: true,
        subscriptionId: subscription.id,
        whatsappLink: `https://wa.me/5562993555185?text=Olá! Gostaria de finalizar minha inscrição na Mentoria Mente Livre. ID: ${subscription.id}`,
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }
      
      console.error("Error creating subscription:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  });

  // Confirm payment (manual confirmation)
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID é obrigatório" });
      }

      const subscription = await storage.updateSubscriptionStatus(
        subscriptionId,
        "confirmed",
        "manual_cakto_confirmation"
      );
      
      console.log(`Payment confirmed for subscription ${subscriptionId}`);
      
      res.json({
        success: true,
        subscription,
      });

    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({
        message: "Erro ao confirmar pagamento",
      });
    }
  });

  // Get all subscriptions (admin)
  app.get("/api/admin/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getAllSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({
        message: "Erro ao buscar inscrições",
      });
    }
  });

  // Get subscription stats (admin)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getSubscriptionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({
        message: "Erro ao buscar estatísticas",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
