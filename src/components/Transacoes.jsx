import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react'

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busca, setBusca] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    categoria: '',
    data: new Date().toISOString().split('T')[0]
  })

  const categorias = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
    'Lazer', 'Compras', 'Salário', 'Freelance', 'Investimentos', 'Outros'
  ]

  // Carregar transações do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transacoes') || '[]')
    setTransacoes(saved)
  }, [])

  // Salvar no localStorage
  const salvarTransacoes = (novasTransacoes) => {
    localStorage.setItem('transacoes', JSON.stringify(novasTransacoes))
    setTransacoes(novasTransacoes)
  }

  // Adicionar nova transação
  const adicionarTransacao = () => {
    if (!novaTransacao.descricao || !novaTransacao.valor || !novaTransacao.categoria) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const transacao = {
      ...novaTransacao,
      valor: parseFloat(novaTransacao.valor),
      id: Date.now()
    }

    const novasTransacoes = [transacao, ...transacoes]
    salvarTransacoes(novasTransacoes)
    
    setNovaTransacao({
      descricao: '',
      valor: '',
      tipo: 'despesa',
      categoria: '',
      data: new Date().toISOString().split('T')[0]
    })
    setShowModal(false)
  }

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchTipo = filtroTipo === 'todos' || transacao.tipo === filtroTipo
    const matchCategoria = filtroCategoria === 'todas' || transacao.categoria === filtroCategoria
    const matchBusca = transacao.descricao.toLowerCase().includes(busca.toLowerCase())
    
    return matchTipo && matchCategoria && matchBusca
  })

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-500">Gerencie todas as suas receitas e despesas</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(receitas)}
            </div>
            <p className="text-xs text-green-600">
              {transacoesFiltradas.filter(t => t.tipo === 'receita').length} transações
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {formatCurrency(despesas)}
            </div>
            <p className="text-xs text-red-600">
              {transacoesFiltradas.filter(t => t.tipo === 'despesa').length} transações
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Saldo
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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-yellow-50"
                />
              </div>
            </div>
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-yellow-50"
            >
              <option value="todos">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-yellow-50"
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>{transacoesFiltradas.length} transações encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {transacoesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400">Ajuste os filtros ou adicione uma nova transação</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transacoesFiltradas.map((transacao) => (
                <div key={transacao.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      transacao.tipo === 'receita' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{transacao.descricao}</p>
                      <p className="text-sm text-gray-500">{transacao.categoria} • {formatDate(transacao.data)}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Nova Transação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Transação</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao({...novaTransacao, descricao: e.target.value})}
                  placeholder="Ex: Compra no supermercado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <Input
                  type="number"
                  step="0.01"
                  value={novaTransacao.valor}
                  onChange={(e) => setNovaTransacao({...novaTransacao, valor: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={novaTransacao.tipo}
                  onChange={(e) => setNovaTransacao({...novaTransacao, tipo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={novaTransacao.categoria}
                  onChange={(e) => setNovaTransacao({...novaTransacao, categoria: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <Input
                  type="date"
                  value={novaTransacao.data}
                  onChange={(e) => setNovaTransacao({...novaTransacao, data: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={adicionarTransacao}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transacoes

