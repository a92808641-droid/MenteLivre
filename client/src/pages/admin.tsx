import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Users, TrendingUp, DollarSign, Percent } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Subscription } from "@shared/schema";

interface Stats {
  totalSubscriptions: number;
  thisMonth: number;
  revenue: number;
  conversionRate: number;
}

export default function Admin() {
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useQuery<Subscription[]>({
    queryKey: ['/api/admin/subscriptions'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/admin/stats'],
  });

  const exportToCsv = () => {
    if (!subscriptions.length) return;

    const headers = ['Nome', 'Email', 'Telefone', 'Plano', 'Status', 'Valor', 'Data'];
    const csvData = subscriptions.map(sub => [
      sub.nome,
      sub.email,
      sub.telefone,
      sub.plano === 'pix' ? 'PIX' : 'Cartão',
      sub.status,
      `R$ ${sub.amount}`,
      format(new Date(sub.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inscricoes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-accent/10 text-accent">Confirmado</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (subscriptionsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">
            Painel Administrativo
          </h1>
          <Button
            onClick={exportToCsv}
            className="bg-accent text-accent-foreground hover:bg-secondary"
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent" data-testid="stat-total-subscriptions">
                  {stats.totalSubscriptions}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent" data-testid="stat-this-month">
                  {stats.thisMonth}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent" data-testid="stat-revenue">
                  R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Percent className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent" data-testid="stat-conversion">
                  {stats.conversionRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscriptions Table */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Inscrições Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id} data-testid={`row-subscription-${subscription.id}`}>
                      <TableCell className="font-medium" data-testid={`cell-nome-${subscription.id}`}>
                        {subscription.nome}
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`cell-email-${subscription.id}`}>
                        {subscription.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`cell-telefone-${subscription.id}`}>
                        {subscription.telefone}
                      </TableCell>
                      <TableCell data-testid={`cell-plano-${subscription.id}`}>
                        {subscription.plano === 'pix' ? 'PIX' : 'Cartão'}
                      </TableCell>
                      <TableCell data-testid={`cell-amount-${subscription.id}`}>
                        R$ {subscription.amount}
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`cell-data-${subscription.id}`}>
                        {format(new Date(subscription.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell data-testid={`cell-status-${subscription.id}`}>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {subscriptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground" data-testid="empty-subscriptions">
                  Nenhuma inscrição encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
