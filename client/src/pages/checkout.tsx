import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Lock } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ subscriptionId }: { subscriptionId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const res = await apiRequest("POST", "/api/confirm-payment", { paymentIntentId });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Pagamento confirmado!",
        description: "Redirecionando para a página de sucesso...",
      });
      setLocation("/success");
    },
    onError: (error: any) => {
      console.error("Payment confirmation error:", error);
      toast({
        title: "Erro na confirmação",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      confirmPaymentMutation.mutate(paymentIntent.id);
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-effect p-6 rounded-xl">
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing || confirmPaymentMutation.isPending}
        className="w-full bg-accent text-accent-foreground py-4 text-lg hover:bg-secondary"
        data-testid="button-confirm-payment"
      >
        {isProcessing || confirmPaymentMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processando pagamento...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Confirmar Pagamento
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const subscriptionId = params.subscriptionId;

  const { data: paymentData, isLoading, error } = useQuery({
    queryKey: ['/api/create-subscription', subscriptionId],
    queryFn: async () => {
      // This would be called from the subscription form, but we need the client secret
      // In a real scenario, we'd store this or retrieve it differently
      throw new Error("Payment intent should be created from subscription form");
    },
    enabled: false, // Disabled because this should come from the subscription form
  });

  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    // In a real app, you'd get the client secret from the subscription creation
    // For now, we'll redirect back if we don't have it
    const stored = sessionStorage.getItem(`payment_${subscriptionId}`);
    if (stored) {
      setClientSecret(stored);
    } else {
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

  if (!clientSecret) {
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
              <div className="text-3xl font-bold text-accent mb-2">R$ 297</div>
              <p className="text-sm text-muted-foreground">
                Acesso vitalício • Garantia de 30 dias
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm subscriptionId={subscriptionId} />
            </Elements>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Pagamento processado com segurança pelo Stripe</p>
          <p className="mt-2">Seus dados estão protegidos com criptografia SSL</p>
        </div>
      </div>
    </div>
  );
}
