import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Target, 
  Trophy,
  Calendar,
  DollarSign
} from 'lucide-react'

const Metas = () => {
  const [metas, setMetas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [novaMeta, setNovaMeta] = useState({
    nome: '',
    descricao: '',
    valorMeta: '',
    valorAtual: '0',
    dataLimite: '',
    categoria: 'economia'
  })

  const categoriasMeta = [
    'economia', 'viagem', 'casa', 'carro', 'educacao', 'emergencia', 'aposentadoria', 'outros'
  ]

  // Carregar metas do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('metas') || '[]')
    setMetas(saved)
  }, [])

  // Salvar no localStorage
  const salvarMetas = (novasMetas) => {
    localStorage.setItem('metas', JSON.stringify(novasMetas))
    setMetas(novasMetas)
  }

  // Adicionar nova meta
  const adicionarMeta = () => {
    if (!novaMeta.nome || !novaMeta.valorMeta || !novaMeta.dataLimite) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const meta = {
      ...novaMeta,
      valorMeta: parseFloat(novaMeta.valorMeta),
      valorAtual: parseFloat(novaMeta.valorAtual || 0),
      id: Date.now(),
      dataCriacao: new Date().toISOString().split('T')[0]
    }

    const novasMetas = [meta, ...metas]
    salvarMetas(novasMetas)
    
    setNovaMeta({
      nome: '',
      descricao: '',
      valorMeta: '',
      valorAtual: '0',
      dataLimite: '',
      categoria: 'economia'
    })
    setShowModal(false)
  }

  // Atualizar valor atual da meta
  const atualizarValorMeta = (id, novoValor) => {
    const metasAtualizadas = metas.map(meta => 
      meta.id === id ? { ...meta, valorAtual: parseFloat(novoValor) } : meta
    )
    salvarMetas(metasAtualizadas)
  }

  // Calcular estatísticas
  const metasAtivas = metas.filter(meta => meta.valorAtual < meta.valorMeta)
  const metasConcluidas = metas.filter(meta => meta.valorAtual >= meta.valorMeta)
  const totalObjetivos = metas.reduce((acc, meta) => acc + meta.valorMeta, 0)
  const totalEconomizado = metas.reduce((acc, meta) => acc + meta.valorAtual, 0)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calcularProgresso = (meta) => {
    return Math.min((meta.valorAtual / meta.valorMeta) * 100, 100)
  }

  const diasRestantes = (dataLimite) => {
    const hoje = new Date()
    const limite = new Date(dataLimite)
    const diferenca = limite - hoje
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24))
    return dias
  }

  const getCategoriaIcon = (categoria) => {
    const icons = {
      economia: '💰',
      viagem: '✈️',
      casa: '🏠',
      carro: '🚗',
      educacao: '📚',
      emergencia: '🚨',
      aposentadoria: '👴',
      outros: '🎯'
    }
    return icons[categoria] || '🎯'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-500">Acompanhe o progresso dos seus objetivos financeiros</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Metas Ativas
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {metasAtivas.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Concluídas
            </CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {metasConcluidas.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Total Objetivos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {formatCurrency(totalObjetivos)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Economizado
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {formatCurrency(totalEconomizado)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Metas ({metas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {metas.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma meta encontrada</p>
              <p className="text-sm text-gray-400">Defina seus objetivos financeiros para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metas.map((meta) => {
                const progresso = calcularProgresso(meta)
                const dias = diasRestantes(meta.dataLimite)
                const concluida = meta.valorAtual >= meta.valorMeta
                
                return (
                  <div key={meta.id} className={`p-4 rounded-lg border-2 transition-colors ${
                    concluida 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getCategoriaIcon(meta.categoria)}</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center">
                            {meta.nome}
                            {concluida && <Trophy className="w-5 h-5 text-yellow-500 ml-2" />}
                          </h3>
                          {meta.descricao && (
                            <p className="text-sm text-gray-600 mb-1">{meta.descricao}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Criada em {formatDate(meta.dataCriacao)} • 
                            Prazo: {formatDate(meta.dataLimite)}
                            {!concluida && (
                              <span className={`ml-2 ${dias < 0 ? 'text-red-500' : dias < 30 ? 'text-orange-500' : 'text-gray-500'}`}>
                                ({dias < 0 ? `${Math.abs(dias)} dias atrasado` : `${dias} dias restantes`})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(meta.valorAtual)} / {formatCurrency(meta.valorMeta)}
                        </p>
                        <p className={`text-sm font-medium ${
                          concluida ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {progresso.toFixed(1)}% concluído
                        </p>
                      </div>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            concluida ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(progresso, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Atualizar valor */}
                    {!concluida && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Atualizar valor:
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={meta.valorAtual}
                          onBlur={(e) => {
                            const novoValor = parseFloat(e.target.value) || 0
                            if (novoValor !== meta.valorAtual) {
                              atualizarValorMeta(meta.id, novoValor)
                            }
                          }}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-500">
                          Faltam {formatCurrency(Math.max(0, meta.valorMeta - meta.valorAtual))}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Nova Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nova Meta Financeira</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Meta</label>
                <Input
                  value={novaMeta.nome}
                  onChange={(e) => setNovaMeta({...novaMeta, nome: e.target.value})}
                  placeholder="Ex: Viagem para Europa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
                <Input
                  value={novaMeta.descricao}
                  onChange={(e) => setNovaMeta({...novaMeta, descricao: e.target.value})}
                  placeholder="Descreva sua meta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor da Meta</label>
                <Input
                  type="number"
                  step="0.01"
                  value={novaMeta.valorMeta}
                  onChange={(e) => setNovaMeta({...novaMeta, valorMeta: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Atual (opcional)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={novaMeta.valorAtual}
                  onChange={(e) => setNovaMeta({...novaMeta, valorAtual: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={novaMeta.categoria}
                  onChange={(e) => setNovaMeta({...novaMeta, categoria: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="economia">💰 Economia</option>
                  <option value="viagem">✈️ Viagem</option>
                  <option value="casa">🏠 Casa</option>
                  <option value="carro">🚗 Carro</option>
                  <option value="educacao">📚 Educação</option>
                  <option value="emergencia">🚨 Emergência</option>
                  <option value="aposentadoria">👴 Aposentadoria</option>
                  <option value="outros">🎯 Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data Limite</label>
                <Input
                  type="date"
                  value={novaMeta.dataLimite}
                  onChange={(e) => setNovaMeta({...novaMeta, dataLimite: e.target.value})}
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
                onClick={adicionarMeta}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Criar Meta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Metas

