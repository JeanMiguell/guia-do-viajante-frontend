# 🗺️ Guia do Viajante do Tempo — Frontend

Plataforma educacional gamificada de história, onde estudantes exploram linhas do tempo interativas, desbloqueiam eventos históricos, assistem conteúdos em formato de slide e realizam atividades e avaliações. Professores criam e gerenciam as timelines, convidam alunos e acompanham o progresso da turma.

---

## ✨ Funcionalidades

### Aluno
- 📍 Navegação por linha do tempo com eventos bloqueados/desbloqueados
- 📖 Visualização de conteúdo em formato de slide com mascote guia animado
- 💡 Dicas interativas — clique na imagem para revelar a dica do professor
- ✅ Exercícios de fixação e avaliações com correção automática
- 📊 Página de progresso com desempenho por evento e unidade
- 🔔 Sistema de convites para entrar em timelines de professores

### Professor
- 🛠️ Criação completa de timelines com eventos, unidades e conteúdos
- 🖼️ Upload de imagens para eventos, unidades e páginas de conteúdo
- 📝 Cadastro de atividades (fixação e avaliação) com questões de múltipla escolha, V/F e lacuna
- 👥 Convite de alunos e acompanhamento de progresso individual

---

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **React Router v6**
- **Framer Motion**
- **Axios**
- **Sonner** (toasts)
- **Lucide React** (ícones)
- **@react-oauth/google** (login social)

---

## ⚙️ Como rodar

### Pré-requisitos
- Node.js 18+
- Backend rodando (veja o repositório da API)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/JeanMiguell/guia-do-viajante-frontend.git
cd guia-do-viajante-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### Variáveis de ambiente

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── components/       # Componentes reutilizáveis (BottomNav, ConfirmDialog, EventPanel...)
│   └── App.tsx           # Rotas principais
├── pages/
│   ├── timeline/         # Listagem, criação e visualização de timelines
│   ├── activity/         # Criação e visualização de atividades
│   ├── UnitPage.tsx      # Visualizador de conteúdo em slide
│   ├── Assessment.tsx    # Página de avaliações
│   ├── Results.tsx       # Progresso do aluno
│   └── Profile.tsx       # Perfil do usuário
├── services/             # Integração com a API (por domínio)
├── hooks/                # Hooks customizados
├── utils/                # Utilitários
└── assets/               # Imagens e mascotes
```

---

## 📄 Licença

MIT
