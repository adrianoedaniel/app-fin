# FinanceiroApp - Controle de Finanças Pessoais

Um aplicativo web moderno e responsivo para controle de finanças pessoais, desenvolvido com React e Tailwind CSS.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral das finanças com cards informativos
- Saldo do mês, receitas, despesas e total em CDBs
- Transações recentes e metas financeiras

### 💰 Transações
- Adicionar receitas e despesas por categoria
- Filtros por tipo, categoria e busca por descrição
- Visualização detalhada de todas as transações

### 📈 Investimentos CDB
- Controle de Certificados de Depósito Bancário
- Acompanhamento de rendimento com cálculo automático
- Progresso visual dos investimentos

### 🎯 Metas Financeiras
- Definir objetivos financeiros com prazos
- Acompanhar progresso com barras visuais
- Categorização de metas (viagem, casa, carro, etc.)

### 📊 Relatórios
- Gráficos de receitas vs despesas por mês
- Análise de despesas por categoria
- Filtros por período (1 mês, 3 meses, 6 meses, 1 ano)

## 💾 Persistência de Dados

Os dados são salvos automaticamente no **localStorage** do navegador, garantindo que suas informações permaneçam disponíveis mesmo após fechar e reabrir a aplicação.

## 📱 Responsividade

A aplicação é totalmente responsiva, funcionando perfeitamente em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces
- **React Router** - Navegação entre páginas
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações
- **Vite** - Build tool e servidor de desenvolvimento

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/financeiro-app.git

# Entre no diretório
cd financeiro-app

# Instale as dependências
pnpm install

# Execute em modo de desenvolvimento
pnpm run dev
```

### Build para Produção
```bash
# Gerar build otimizado
pnpm run build

# Visualizar build localmente
pnpm run preview
```

## 🌐 Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages através do GitHub Actions.

### Configuração:
1. Faça push do código para o repositório GitHub
2. Vá em Settings > Pages
3. Selecione "GitHub Actions" como source
4. O deploy será feito automaticamente a cada push na branch main

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de interface (shadcn/ui)
│   ├── Dashboard.jsx   # Página principal
│   ├── Transacoes.jsx  # Gerenciamento de transações
│   ├── CDBs.jsx        # Controle de investimentos
│   ├── Metas.jsx       # Metas financeiras
│   ├── Relatorios.jsx  # Relatórios e gráficos
│   └── Sidebar.jsx     # Navegação lateral
├── App.jsx             # Componente principal
├── App.css             # Estilos globais
└── main.jsx            # Ponto de entrada
```

## 🎨 Design

O design foi baseado em princípios modernos de UX/UI:
- **Interface limpa e intuitiva**
- **Cores consistentes** (verde para receitas, vermelho para despesas)
- **Feedback visual** com hover states e transições
- **Iconografia clara** com Lucide React
- **Tipografia legível** com hierarquia bem definida

## 📊 Categorias Disponíveis

### Despesas/Receitas:
- Alimentação
- Transporte  
- Moradia
- Saúde
- Educação
- Lazer
- Compras
- Salário
- Freelance
- Investimentos
- Outros

### Metas:
- 💰 Economia
- ✈️ Viagem
- 🏠 Casa
- 🚗 Carro
- 📚 Educação
- 🚨 Emergência
- 👴 Aposentadoria
- 🎯 Outros

## 🔒 Privacidade

Todos os dados são armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos, garantindo total privacidade dos seus dados financeiros.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/seu-usuario/financeiro-app/issues) no GitHub.

---

Desenvolvido com ❤️ para ajudar você a ter controle total das suas finanças pessoais!

