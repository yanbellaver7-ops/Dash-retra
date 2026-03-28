export const mockKPIs = [
  {
    label: 'Receita Total',
    value: 'R$ 487.293,00',
    change: 6.7,
    positive: true,
  },
  {
    label: 'Ticket Médio',
    value: 'R$ 312,50',
    change: 3.2,
    positive: true,
  },
  {
    label: 'Total de Pedidos',
    value: '1.561',
    change: -1.4,
    positive: false,
  },
]

export const mockChartData = [
  { month: 'Jan', receita: 42000, pedidos: 320 },
  { month: 'Fev', receita: 58000, pedidos: 410 },
  { month: 'Mar', receita: 51000, pedidos: 370 },
  { month: 'Abr', receita: 67000, pedidos: 490 },
  { month: 'Mai', receita: 74000, pedidos: 520 },
  { month: 'Jun', receita: 62000, pedidos: 445 },
  { month: 'Jul', receita: 89000, pedidos: 610 },
  { month: 'Ago', receita: 95000, pedidos: 680 },
  { month: 'Set', receita: 110000, pedidos: 790 },
  { month: 'Out', receita: 98000, pedidos: 705 },
  { month: 'Nov', receita: 125000, pedidos: 870 },
  { month: 'Dez', receita: 143000, pedidos: 1020 },
]

export const mockWeeklyData = [
  { day: 'Seg', receita: 12400, pedidos: 89 },
  { day: 'Ter', receita: 18600, pedidos: 134 },
  { day: 'Qua', receita: 15200, pedidos: 108 },
  { day: 'Qui', receita: 22800, pedidos: 163 },
  { day: 'Sex', receita: 31400, pedidos: 224 },
  { day: 'Sáb', receita: 19700, pedidos: 141 },
  { day: 'Dom', receita: 8900, pedidos: 64 },
]

export const mockTransactions = [
  { nome: 'Ana Lima', valor: 1490.0, change: 8.2, positive: true },
  { nome: 'Carlos Mendes', valor: 890.0, change: -3.1, positive: false },
  { nome: 'Fernanda Costa', valor: 2340.0, change: 12.5, positive: true },
  { nome: 'Rafael Souza', valor: 640.0, change: 5.0, positive: true },
  { nome: 'Juliana Alves', valor: 1120.0, change: -1.8, positive: false },
]

export const mockStatesSales = [
  { uf: 'SP', nome: 'São Paulo', valor: 187420, percentual: 38.4, color: '#7C3AED' },
  { uf: 'SC', nome: 'Santa Catarina', valor: 93210, percentual: 19.1, color: '#A855F7' },
  { uf: 'RJ', nome: 'Rio de Janeiro', valor: 71850, percentual: 14.7, color: '#8B5CF6' },
  { uf: 'MG', nome: 'Minas Gerais', valor: 58340, percentual: 11.9, color: '#6D28D9' },
  { uf: 'RS', nome: 'Rio Grande do Sul', valor: 42100, percentual: 8.6, color: '#9333EA' },
  { uf: 'PR', nome: 'Paraná', valor: 34370, percentual: 7.0, color: '#C084FC' },
]

export const mockTopProducts = [
  { nome: 'Mentoria Premium', periodo: 'Out 24 – Dez 24', valor: 123411, badge: 6.7, positive: true },
  { nome: 'Curso Avançado', periodo: 'Out 24 – Dez 24', valor: 98320, badge: -2.3, positive: false },
  { nome: 'Pack Profissional', periodo: 'Out 24 – Dez 24', valor: 87540, badge: 4.1, positive: true },
  { nome: 'Consultoria', periodo: 'Out 24 – Dez 24', valor: 64890, badge: 9.8, positive: true },
]
