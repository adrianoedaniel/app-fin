import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  TrendingUp, 
  PiggyBank,
  Calendar,
  Percent
} from 'lucide-react'

const CDBs = () => {
  const [cdbs, setCdbs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [novoCdb, setNovoCdb] = useState({
    nome: '',
    banco: '',
    valorInvestido: '',
    taxaCdi: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    tipo: 'prefixado'
  })

  // Carregar CDBs do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cdbs') || '[]')
    setCdbs(saved)
  }, [])

  // Salvar no localStorage
  const salvarCdbs = (novosCdbs) => {
    localStorage.setItem('cdbs', JSON.stringify(novosCdbs))
    setCdbs(novosCdbs)
  }

  // Adicionar novo CDB
  const adicionarCdb = () => {
    if (!novoCdb.nome || !novoCdb.banco || !novoCdb.valorInvestido || !novoCdb.taxaCdi || !novoCdb.dataVencimento) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const cdb = {
      ...novoCdb,
      valorInvestido: parseFloat(novoCdb.valorInvestido),
      taxaCdi: parseFloat(novoCdb.taxaCdi),
      id: Date.now()
    }

    const novosCdbs = [cdb, ...cdbs]
    salvarCdbs(novosCdbs)
    
    setNovoCdb({
      nome: '',
      banco: '',
      valorInvestido: '',
      taxaCdi: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      tipo: 'prefixado'
    })
    setShowModal(false)
  }

  // Calcular rendimento estimado
  const calcularRendimento = (cdb) => {
    const hoje = new Date()
    const inicio = new Date(cdb.dataInicio)
    const vencimento = new Date(cdb.dataVencimento)
    
    const diasDecorridos = Math.max(0, (hoje - inicio) / (1000 * 60 * 60 * 24))
    const diasTotais = (vencimento - inicio) / (1000 * 60 * 60 * 24)
    
    // Simulação simples de rendimento (CDI médio de 10.5% ao ano)
    const cdiAnual = 0.105
    const rendimentoAnual = cdiAnual * (cdb.taxaCdi / 100)
    const rendimentoDiario = rendimentoAnual / 365
    
    const rendimentoAtual = cdb.valorInvestido * (Math.pow(1 + rendimentoDiario, diasDecorridos) - 1)
    
    return {
      valorAtual: cdb.valorInvestido + rendimentoAtual,
      rendimento: rendimentoAtual,
      percentualCompleto: Math.min((diasDecorridos / diasTotais) * 100, 100)
    }
  }

  // Calcular totais
  const totalInvestido = cdbs.reduce((acc, cdb) => acc + cdb.valorInvestido, 0)
  const totalRendimento = cdbs.reduce((acc, cdb) => {
    const { rendimento } = calcularRendimento(cdb)
    return acc + rendimento
  }, 0)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatPercent = (value) => {
    return `+${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investimentos CDB</h1>
          <p className="text-gray-500">Acompanhe seus Certificados de Depósito Bancário</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo CDB
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Investido
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {formatCurrency(totalInvestido)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Rendimento Total
            </CardTitle>
            <Percent className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(totalRendimento)}
            </div>
            <p className="text-xs text-green-600">
              {totalInvestido > 0 ? formatPercent((totalRendimento / totalInvestido) * 100) : '+0.00%'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Investimentos
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {cdbs.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de CDBs */}
      <Card>
        <CardHeader>
          <CardTitle>Seus CDBs ({cdbs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cdbs.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum CDB encontrado</p>
              <p className="text-sm text-gray-400">Adicione seus investimentos para acompanhar o rendimento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cdbs.map((cdb) => {
                const { valorAtual, rendimento, percentualCompleto } = calcularRendimento(cdb)
                
                return (
                  <div key={cdb.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{cdb.nome}</h3>
                        <p className="text-sm text-gray-600">{cdb.banco} • {cdb.taxaCdi}% do CDI</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(cdb.dataInicio)} - {formatDate(cdb.dataVencimento)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(valorAtual)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Investido: {formatCurrency(cdb.valorInvestido)}
                        </p>
                        <p className="text-sm text-green-600">
                          Rendimento: {formatCurrency(rendimento)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progresso do investimento</span>
                        <span>{percentualCompleto.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(percentualCompleto, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Novo CDB */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo CDB</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do CDB</label>
                <Input
                  value={novoCdb.nome}
                  onChange={(e) => setNovoCdb({...novoCdb, nome: e.target.value})}
                  placeholder="Ex: CDB Banco do Brasil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Banco</label>
                <Input
                  value={novoCdb.banco}
                  onChange={(e) => setNovoCdb({...novoCdb, banco: e.target.value})}
                  placeholder="Ex: Banco do Brasil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Investido</label>
                <Input
                  type="number"
                  step="0.01"
                  value={novoCdb.valorInvestido}
                  onChange={(e) => setNovoCdb({...novoCdb, valorInvestido: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Taxa (% do CDI)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={novoCdb.taxaCdi}
                  onChange={(e) => setNovoCdb({...novoCdb, taxaCdi: e.target.value})}
                  placeholder="Ex: 120 (para 120% do CDI)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={novoCdb.tipo}
                  onChange={(e) => setNovoCdb({...novoCdb, tipo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="prefixado">Pré-fixado</option>
                  <option value="posfixado">Pós-fixado</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data de Início</label>
                <Input
                  type="date"
                  value={novoCdb.dataInicio}
                  onChange={(e) => setNovoCdb({...novoCdb, dataInicio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data de Vencimento</label>
                <Input
                  type="date"
                  value={novoCdb.dataVencimento}
                  onChange={(e) => setNovoCdb({...novoCdb, dataVencimento: e.target.value})}
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
                onClick={adicionarCdb}
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

export default CDBs

