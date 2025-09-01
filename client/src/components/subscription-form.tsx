import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubscriptionSchema, type InsertSubscription } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Lock, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SubscriptionForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const form = useForm<InsertSubscription>({
    resolver: zodResolver(insertSubscriptionSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      plano: "pix",
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: InsertSubscription) => {
      const res = await apiRequest("POST", "/api/create-subscription", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Store subscription data for checkout
      const subscriptionData = {
        plano: form.getValues('plano'),
        amount: form.getValues('plano') === 'pix' ? 'R$ 297' : 'R$ 29,70/mês (12x)',
      };
      sessionStorage.setItem(`subscription_${data.subscriptionId}`, JSON.stringify(subscriptionData));
      
      toast({
        title: "Inscrição criada!",
        description: "Redirecionando para o pagamento...",
      });
      
      // Redirect to checkout with the subscription ID
      setLocation(`/checkout/${data.subscriptionId}`);
    },
    onError: (error: any) => {
      console.error("Subscription error:", error);
      toast({
        title: "Erro na inscrição",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSubscription) => {
    if (!termsAccepted) {
      toast({
        title: "Termos obrigatórios",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    createSubscriptionMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="glass-effect p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome completo"
                    className="bg-input border-border focus:border-accent"
                    data-testid="input-nome"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">E-mail *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-input border-border focus:border-accent"
                    data-testid="input-email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">WhatsApp *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="bg-input border-border focus:border-accent"
                  data-testid="input-telefone"
                  {...field}
                  onChange={(e) => {
                    // Format phone number
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
                    }
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="plano"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Forma de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-input border-border focus:border-accent" data-testid="select-plano">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pix">PIX - R$ 297 (À vista)</SelectItem>
                  <SelectItem value="cartao">Cartão - 12x de R$ 29,70</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="termos"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="mt-1 accent-accent"
            data-testid="checkbox-termos"
          />
          <label htmlFor="termos" className="text-sm text-muted-foreground">
            Eu concordo com os{" "}
            <a href="#" className="text-accent hover:underline">
              termos de uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-accent hover:underline">
              política de privacidade
            </a>
          </label>
        </div>
        
        <Button
          type="submit"
          disabled={createSubscriptionMutation.isPending}
          className="w-full bg-accent text-accent-foreground py-4 text-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105"
          data-testid="button-submit-subscription"
        >
          {createSubscriptionMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Finalizar Inscrição Segura
            </>
          )}
        </Button>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span>Pagamento 100% seguro</span>
          <span>•</span>
          <span>SSL Certificate</span>
        </div>
      </form>
    </Form>
  );
}
