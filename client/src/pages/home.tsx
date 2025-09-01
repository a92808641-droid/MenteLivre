import { Brain, Clock, Tag, Infinity, Wind, PenTool, Dumbbell, FileText, Headphones, Book, Shield, Star, Rocket, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscriptionForm from "../components/subscription-form";
import FAQSection from "../components/faq-section";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="text-accent text-2xl" />
              <span className="text-xl font-bold text-foreground">Mente Livre</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="nav-sobre"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('conteudo')}
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="nav-conteudo"
              >
                Conteúdo
              </button>
              <button
                onClick={() => scrollToSection('bonus')}
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="nav-bonus"
              >
                Bônus
              </button>
              <Button
                onClick={() => scrollToSection('inscricao')}
                className="bg-accent text-accent-foreground hover:bg-secondary"
                data-testid="nav-inscricao"
              >
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-accent/20 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-accent/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-accent/5 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Mentoria 100% Online e Gravada
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Liberte sua mente da{" "}
            <span className="text-accent">ansiedade!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Aprenda técnicas práticas e científicas para controlar a ansiedade, fortalecer sua mente e recuperar o controle da sua vida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => scrollToSection('inscricao')}
              className="bg-accent text-accent-foreground px-8 py-4 text-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105"
              data-testid="button-hero-inscricao"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Garantir Minha Vaga
            </Button>
            <Button
              variant="outline"
              className="border-accent text-accent px-8 py-4 text-lg hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.open("https://wa.me/5562993555185", "_blank")}
              data-testid="button-whatsapp"
            >
              WhatsApp
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-effect p-6 rounded-xl text-center">
              <Clock className="text-accent text-2xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Seu Ritmo</h3>
              <p className="text-sm text-muted-foreground">Assista quando e onde quiser</p>
            </div>
            <div className="glass-effect p-6 rounded-xl text-center">
              <Tag className="text-accent text-2xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Métodos Científicos</h3>
              <p className="text-sm text-muted-foreground">Baseado em neurociência</p>
            </div>
            <div className="glass-effect p-6 rounded-xl text-center">
              <Infinity className="text-accent text-2xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Acesso Vitalício</h3>
              <p className="text-sm text-muted-foreground">Sem prazo de expiração</p>
            </div>
          </div>
        </div>
      </section>

      {/* O que você vai aprender */}
      <section id="conteudo" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que você vai <span className="text-accent">aprender</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um programa completo e estruturado para transformar sua relação com a ansiedade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-effect p-8 rounded-2xl hover:border-accent/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Brain className="text-accent text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Neurociência da Ansiedade</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Entenda como a ansiedade funciona no seu cérebro e corpo, descobrindo os mecanismos por trás dos sintomas.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl hover:border-accent/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Wind className="text-accent text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Técnicas de Respiração</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Métodos rápidos e eficazes de respiração e grounding para controlar crises de ansiedade na hora.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl hover:border-accent/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <PenTool className="text-accent text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Escrita Terapêutica</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Aprenda a usar a escrita como ferramenta para organizar pensamentos e processar emoções.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl hover:border-accent/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Dumbbell className="text-accent text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Fortalecimento Mental</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estratégias comprovadas para construir resiliência mental e prevenir recaídas a longo prazo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bônus Exclusivos */}
      <section id="bonus" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bônus <span className="text-accent">Exclusivos</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Materiais complementares para potencializar seu aprendizado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-effect p-6 rounded-2xl text-center hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-accent text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">comunidade de apoio</h3>
              <p className="try {
                
              } catch (error) {
                
              }ext-muted-foreground text-sm">
                Grupos de apoio no WhatsApp e Telegram para trocar experiências e dicas
            
              </p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl text-center hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-accent text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Áudios Guiados</h3>
              <p className="text-muted-foreground text-sm">
                Meditações e exercícios de respiração para usar em qualquer momento
              </p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl text-center hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="text-accent text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Diário Mente Livre</h3>
              <p className="text-muted-foreground text-sm">
                Ferramenta exclusiva para acompanhar seu progresso e evolução
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Inscrição */}
      <section id="inscricao" className="py-20 px-4 bg-card">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Garanta sua <span className="text-accent">transformação</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Preencha os dados abaixo e tenha acesso imediato à mentoria
            </p>
            
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-accent">R$ 37,90
                </span>
                <span className="text-lg text-muted-foreground ml-2">pagamento único</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-accent mr-2 inline" />
                Garantia de 30 dias ou seu dinheiro de volta
              </p>
            </div>
          </div>
          
          <SubscriptionForm />
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="text-accent text-2xl" />
                <span className="text-xl font-bold">Mente Livre</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Transformando vidas através do controle da ansiedade e fortalecimento mental.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Mentoria</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => scrollToSection('conteudo')}
                    className="hover:text-accent transition-colors"
                    data-testid="footer-conteudo"
                  >
                    Conteúdo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('bonus')}
                    className="hover:text-accent transition-colors"
                    data-testid="footer-bonus"
                  >
                    Bônus
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('inscricao')}
                    className="hover:text-accent transition-colors"
                    data-testid="footer-inscricao"
                  >
                    Inscrição
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Central de Ajuda</a></li>
                <li>
                  <a
                    href="https://wa.me/5562993555185"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                    data-testid="footer-whatsapp"
                  >
                    WhatsApp
                  </a>
                </li>
                <li><a href="#" className="hover:text-accent transition-colors">E-mail</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Política de Reembolso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Mentoria Mente Livre. Todos os direitos reservados. | Conteúdo 100% confiável
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
