import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react'

const Relatorios = () => {
  const [transacoes, setTransacoes] = useState([])
  const [periodo, setPeriodo] = useState('3meses')

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transacoes') || '[]')
    setTransacoes(saved)
  }, [])

  // Filtrar transações por período
  const filtrarPorPeriodo = (transacoes, periodo) => {
    const hoje = new Date()
    let dataLimite = new Date()

    switch (periodo) {
      case '1mes':
        dataLimite.setMonth(hoje.getMonth() - 1)
        break
      case '3meses':
        dataLimite.setMonth(hoje.getMonth() - 3)
        break
      case '6meses':
        dataLimite.setMonth(hoje.getMonth() - 6)
        break
      case '1ano':
        dataLimite.setFullYear(hoje.getFullYear() - 1)
        break
      default:
        return transacoes
    }

    return transacoes.filter(t => new Date(t.data) >= dataLimite)
  }

  const transacoesFiltradas = filtrarPorPeriodo(transacoes, periodo)

  // Dados para gráfico de receitas vs despesas por mês
  const dadosPorMes = () => {
    const meses = {}
    
    transacoesFiltradas.forEach(transacao => {
      const data = new Date(transacao.data)
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
      
      if (!meses[chave]) {
        meses[chave] = { mes: chave, receitas: 0, despesas: 0 }
      }
      
      if (transacao.tipo === 'receita') {
        meses[chave].receitas += transacao.valor
      } else {
        meses[chave].despesas += transacao.valor
      }
    })

    return Object.values(meses).sort((a, b) => a.mes.localeCompare(b.mes))
  }

  // Dados para gráfico de despesas por categoria
  const despesasPorCategoria = () => {
    const categorias = {}
    
    transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .forEach(transacao => {
        if (!categorias[transacao.categoria]) {
          categorias[transacao.categoria] = 0
        }
        categorias[transacao.categoria] += transacao.valor
      })

    return Object.entries(categorias)
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)
  }

  // Calcular totais
  const receitas = transacoesFiltradas
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0)
  
  const despesas = transacoesFiltradas
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0)
  
  const saldo = receitas - despesas

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCurrencyShort = (value) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`
    }
    return formatCurrency(value)
  }

  // Cores para o gráfico de pizza
  const CORES = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  const dadosGraficoMes = dadosPorMes()
  const dadosCategoria = despesasPorCategoria()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
          <p className="text-gray-500">Análise detalhada das suas finanças</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-yellow-50"
        >
          <option value="1mes">Último mês</option>
          <option value="3meses">Últimos 3 meses</option>
          <option value="6meses">Últimos 6 meses</option>
          <option value="1ano">Último ano</option>
        </select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(receitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Total Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {formatCurrency(despesas)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Saldo Período
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-800' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receitas vs Despesas por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosGraficoMes.length === 0 ? (
              <div className="text-center py-8">
                <BarChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sem dados para exibir</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="mes" 
                    tickFormatter={(value) => {
                      const [ano, mes] = value.split('-')
                      return `${mes}/${ano.slice(-2)}`
                    }}
                  />
                  <YAxis tickFormatter={formatCurrencyShort} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => {
                      const [ano, mes] = label.split('-')
                      const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                      return `${nomes[parseInt(mes) - 1]} ${ano}`
                    }}
                  />
                  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Despesas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosCategoria.length === 0 ? (
              <div className="text-center py-8">
                <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sem despesas para exibir</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Categorias */}
      {dadosCategoria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dadosCategoria.map((item, index) => {
                const percentual = (item.valor / despesas) * 100
                return (
                  <div key={item.categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: CORES[index % CORES.length] }}
                      ></div>
                      <span className="font-medium">{item.categoria}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(item.valor)}</p>
                      <p className="text-sm text-gray-500">{percentual.toFixed(1)}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Relatorios

