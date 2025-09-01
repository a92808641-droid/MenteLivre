import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Lock } from "lucide-react";


const CheckoutForm = ({ subscriptionId, plano, amount }: { subscriptionId: string, plano: string, amount: string }) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleCaktoPayment = () => {
    // Store subscription ID for when user returns
    sessionStorage.setItem('current_subscription_id', subscriptionId);
    
    // Open Cakto payment page
    window.open('https://pay.cakto.com.br/rbkmhmg_551147', '_blank');
    
    toast({
      title: "Redirecionado para Cakto!",
      description: "Complete o pagamento e retorne aqui para confirmar.",
    });
  };

  const handlePaymentConfirmation = () => {
    setLocation('/success');
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect p-6 rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-4">Finalizar Pagamento</h3>
        <p className="text-muted-foreground mb-6">
          Clique no botão abaixo para ser direcionado à página de pagamento segura do Cakto.
        </p>
        
        <div className="bg-accent/10 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium mb-2">Valor: {amount}</p>
          <p className="text-sm text-muted-foreground">
            Pagamento único via Cakto
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-4">
          <Lock className="w-3 h-3" />
          <span>Pagamento 100% seguro via Cakto</span>
        </div>
      </div>
      
      <Button
        onClick={handleCaktoPayment}
        className="w-full bg-accent text-accent-foreground py-4 text-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105"
        data-testid="button-cakto-payment"
      >
        <Lock className="w-5 h-5 mr-2" />
        Pagar com Cakto
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Após realizar o pagamento, clique no botão abaixo:
        </p>
        <Button
          variant="outline"
          onClick={handlePaymentConfirmation}
          className="text-sm"
          data-testid="button-payment-completed"
        >
          ✅ Pagamento Realizado
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <Button
          variant="ghost"
          onClick={() => window.open("https://wa.me/5562993555185", "_blank")}
          className="text-xs text-muted-foreground hover:text-accent"
          data-testid="button-support-whatsapp"
        >
          Dúvidas? Fale conosco no WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default function Checkout() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const subscriptionId = params.subscriptionId;

  // Get subscription data from sessionStorage (set by subscription form)
  const [subscriptionData, setSubscriptionData] = useState<{plano: string, amount: string} | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`subscription_${subscriptionId}`);
    if (stored) {
      setSubscriptionData(JSON.parse(stored));
    } else {
      // If no subscription data, redirect to home
      setLocation("/");
    }
  }, [subscriptionId, setLocation]);

  if (!subscriptionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6">
            <p>ID da inscrição inválido</p>
            <Button onClick={() => setLocation("/")} className="mt-4">
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-accent mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold mb-4">Finalizar Pagamento</h1>
          <p className="text-muted-foreground">
            Complete seu pagamento para ter acesso imediato à Mentoria Mente Livre
          </p>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-center">
              <span className="text-2xl font-bold text-accent">Mentoria Mente Livre</span>
            </CardTitle>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{subscriptionData.amount}</div>
              <p className="text-sm text-muted-foreground">
                Pagamento único • Garantia de 30 dias
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <CheckoutForm 
              subscriptionId={subscriptionId} 
              plano={subscriptionData.plano}
              amount={subscriptionData.amount}
            />
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Pagamento processado com segurança pelo Cakto</p>
          <p className="mt-2">Menor taxa do Brasil • Pagamento instantâneo</p>
        </div>
      </div>
    </div>
  );
}
