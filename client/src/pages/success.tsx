import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Mail, MessageCircle, Play, Brain } from "lucide-react";
import { useLocation } from "wouter";

export default function Success() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-accent/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="text-accent text-4xl" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4" data-testid="text-success-title">
          Inscrição Confirmada!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Parabéns! Seu pagamento foi processado com sucesso.
        </p>
        
        <Card className="glass-effect mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-accent">
              <Brain className="w-6 h-6 mr-2" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-left space-y-4">
              <li className="flex items-center" data-testid="step-email">
                <div className="bg-accent/10 p-2 rounded-full mr-4">
                  <Mail className="text-accent w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Verifique seu e-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Enviamos os dados de acesso para sua caixa de entrada
                  </p>
                </div>
              </li>
              
              <li className="flex items-center" data-testid="step-whatsapp">
                <div className="bg-accent/10 p-2 rounded-full mr-4">
                  <MessageCircle className="text-accent w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Aguarde mensagem no WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Receberá instruções detalhadas em alguns minutos
                  </p>
                </div>
              </li>
              
              <li className="flex items-center" data-testid="step-access">
                <div className="bg-accent/10 p-2 rounded-full mr-4">
                  <Play className="text-accent w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Comece a assistir</p>
                  <p className="text-sm text-muted-foreground">
                    Acesso imediato à plataforma da mentoria
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.open("https://wa.me/5562993555185", "_blank")}
            className="bg-accent text-accent-foreground hover:bg-secondary px-8 py-3"
            data-testid="button-whatsapp-support"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar com Suporte
          </Button>
          
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-muted-foreground hover:text-accent"
              data-testid="button-back-home"
            >
              Voltar ao início
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-accent/5 rounded-xl border border-accent/20">
          <h3 className="font-semibold mb-2 text-accent">Importante!</h3>
          <p className="text-sm text-muted-foreground">
            Seu pagamento foi processado pelo Cakto. Se não receber o e-mail de confirmação em até 10 minutos, verifique sua caixa de spam ou entre em contato pelo WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
