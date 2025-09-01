import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { ZodError } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not set. Payment features will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create subscription and payment intent
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const validatedData = insertSubscriptionSchema.parse(req.body);
      
      // Create subscription record
      const subscription = await storage.createSubscription(validatedData);
      
      // Determine amount based on plan
      const amount = validatedData.plano === "pix" ? 29700 : 2970; // in cents
      
      // Check if Stripe is available
      if (!stripe) {
        return res.status(500).json({
          message: "Pagamentos temporariamente indisponíveis. Entre em contato conosco.",
        });
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "brl",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          subscriptionId: subscription.id,
          email: subscription.email,
          plano: subscription.plano,
        },
      });

      // Update subscription with Stripe payment intent ID
      await storage.updateSubscriptionStatus(
        subscription.id,
        "pending",
        paymentIntent.id
      );

      res.json({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
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

  // Confirm payment success
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment Intent ID é obrigatório" });
      }

      // Check if Stripe is available
      if (!stripe) {
        return res.status(500).json({
          message: "Serviço de pagamento indisponível. Entre em contato conosco.",
        });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === "succeeded") {
        const subscriptionId = paymentIntent.metadata.subscriptionId;
        
        if (subscriptionId) {
          const subscription = await storage.updateSubscriptionStatus(
            subscriptionId,
            "confirmed",
            paymentIntentId
          );
          
          // TODO: Send confirmation email here
          console.log(`Payment confirmed for subscription ${subscriptionId}`);
          
          res.json({
            success: true,
            subscription,
          });
        } else {
          res.status(400).json({ message: "Subscription ID não encontrado" });
        }
      } else {
        res.status(400).json({ message: "Pagamento não foi confirmado" });
      }

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
