# Sharp System Course (React + Vite)

> Plataforma de desafios de inglês com mini‑jogos interativos, trilha diária e estatísticas de progresso.

## ✨ Recursos

- Jogos inclusos:
	- Match-Frase (drag‑and‑drop com inserção entre palavras e decoys)
	- Par Ideal
	- Corrida dos Pares (pares sob tempo, colunas embaralhadas independentemente)
	- Escolha Certa
	- Complete a Frase (Fill Blank)
	- Tradução Livre
- UX consistente
	- Sem auto‑advance: sempre há botão “Próximo” ao concluir
	- Opções exibidas em minúsculas; correção case‑insensitive quando aplicável
	- Reset de estado ao trocar de desafio
- Dados e ferramentas
	- Script unificado de validação/normalização de dados (dedupe “smart ID”, mescla de blocos JSON, limpeza de pontuação)
- Autenticação
	- Login via `POST /auth/login` com payload `{ login, password }`
	- Token Bearer persistido em `localStorage`

## 🧱 Stack

- React 19 + Vite 7
- React Router 7 (navegação nas páginas)
- Axios (HTTP)
- ESLint 9 (qualidade de código)

## 📁 Estrutura do projeto

```
.
├─ public/
├─ scripts/
│  ├─ fixTranslationBankPeriods.cjs
│  ├─ generateGameData.cjs
│  ├─ peekMC.cjs
│  ├─ summaryGameData.cjs
│  └─ validateGameData.cjs
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css, App.css
│  ├─ context/
│  │  └─ AuthContext.jsx
│  ├─ components/
│  │  ├─ Games/
│  │  │  ├─ TranslationBankGame.jsx
│  │  │  ├─ MatchPairsGame.jsx
│  │  │  ├─ MatchMadnessGame.jsx
│  │  │  ├─ MultipleChoiceGame.jsx
│  │  │  ├─ FillBlankGame.jsx
│  │  │  └─ FreeTranslationGame.jsx
│  │  ├─ ActivityCard.jsx, Header.jsx, Sidebar.jsx, etc.
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ DashboardAluno.jsx
│  │  └─ Atividades.jsx
│  ├─ styles/
│  │  └─ *.css (estilos por jogo e componentes)
│  └─ utils/
│     ├─ GameData.js
│     └─ GameData.json
└─ vite.config.js
```

## 🚀 Começando

### Pré‑requisitos
- Node.js 18+ e npm 9+

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` (ou `.env.local`) na raiz para configurar a API em produção/preview:

```bash
# URL base da API em produção/preview
VITE_API_BASE=https://api.seu-dominio.com
```

Em desenvolvimento, já há um proxy configurado no `vite.config.js`, então as chamadas vão para `/api` e o Vite encaminha para `https://api.giorgiorafael.com` (evita CORS). Para trocar o alvo do proxy em dev, ajuste o `target` no `vite.config.js`.

### Desenvolvimento

```bash
npm run dev
```

- App disponível em http://localhost:5173
- API em dev é acessada via `/api` (proxy do Vite)

### Build de produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

## 🔐 Autenticação

- Provider e hook: `src/context/AuthContext.jsx` (`AuthProvider`, `useAuth`)
- Payload de login esperado pelo backend:

```json
{
	"login": "seu-usuario-ou-email",
	"password": "sua-senha"
}
```

- O token (`bearerToken` ou `token`) é salvo no `localStorage` e adicionado ao header `Authorization: Bearer ...`.
- Em dev, o `axios` usa baseURL `"/api"` para aproveitar o proxy do Vite; em prod usa `VITE_API_BASE` (se definido) ou `https://api.giorgiorafael.com/`.

## 🎮 Mini‑jogos

- Match-Frase
	- Banco embaralhado com 4–6 palavras “decoy” além das corretas
	- Montagem por drag‑and‑drop da “Sua tradução” com slots entre palavras e placeholder no slot ativo
	- Remoção e inserção precisas; caixa inteira arrastável (não só o texto)
	- Ponto final ignorado no dado (apenas visual no bloco completo)
	- Botão “Enviar” e depois “Próximo” (sem auto‑advance)

- Complete a Frase (Fill Blank)
	- Comparação case‑insensitive e opções exibidas em minúsculas
	- Reset ao mudar de desafio; “Próximo” ao acertar

- Escolha Certa
	- Opções minúsculas; verificação case‑insensitive; “Próximo” ao acertar

- Par Ideal
	- Colunas e labels em minúsculas; “Próximo” ao concluir

- Corrida dos Pares
	- Colunas esquerda/direita embaralhadas independentemente
	- Timer que para ao concluir; mostra “Próximo” (sem auto‑advance)

- Tradução Livre
	- Entrada livre; sem auto‑advance; “Próximo” ao concluir

## 🛠 Scripts úteis

- Lint

```bash
npm run lint
```

- Validação/normalização de dados

```bash
npm run validate:data
npm run validate:data:smart
```

`validate:data:smart` faz deduplicação “smart ID” (se o conteúdo for igual, remove duplicata; se diferente, renomeia de forma estável), mescla blocos JSON, e normaliza a pontuação dos dados do Translation Bank.

## ⚠️ Troubleshooting

- CORS (403 ou `Access-Control-Allow-Origin` ausente)
	- Em dev, as requisições vão para `/api` e o proxy do Vite contorna CORS.
	- Em produção, configure CORS no backend para o domínio do front (ex.: `Access-Control-Allow-Origin: https://seu-front.com`).

- `useAuth is not defined`
	- Verifique se a aplicação está envolvida por `<AuthProvider>` em `src/main.jsx` e se o import usa `../context/AuthContext.jsx`.

- Arraste demorando no banco de palavras
	- As transições de hover são desativadas durante o drag (classe `.dragging`) para iniciar o arraste instantaneamente.

## 🧩 Convenções de código

- ESLint já configurado (React Hooks, React Refresh)
- Preferir funções puras e reset de estado em `useEffect` ao trocar de desafio

## 📜 Licença

Adicione aqui a licença do projeto (por exemplo, MIT). Se não houver, mantenha “Todos os direitos reservados”.
