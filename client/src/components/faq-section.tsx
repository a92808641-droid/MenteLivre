import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "A mentoria é ao vivo?",
    answer: "Não. Todo o conteúdo já está gravado para você assistir quando quiser, no seu ritmo e quantas vezes precisar."
  },
  {
    question: "Preciso aparecer em vídeo?",
    answer: "Não. Você apenas consome o conteúdo online no seu ritmo. É totalmente privado e individual."
  },
  {
    question: "Como recebo o acesso?",
    answer: "Após a confirmação do pagamento, você receberá pelo WhatsApp e e-mail os dados de acesso à plataforma."
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer: "O acesso é vitalício. Você pode assistir quantas vezes quiser, sem prazo de expiração."
  },
  {
    question: "Existe garantia?",
    answer: "Sim! Oferecemos garantia incondicional de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu investimento."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="text-accent">Frequentes</span>
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-effect rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
                onClick={() => toggleFaq(index)}
                data-testid={`faq-question-${index}`}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "text-accent transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-4 text-muted-foreground" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
