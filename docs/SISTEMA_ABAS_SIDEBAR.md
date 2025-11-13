# Sistema de Abas Organizacionais - Sidebar

## 📋 Estrutura do Sistema

O sistema de sidebar foi reorganizado em **abas colapsáveis** baseadas em **níveis de permissão**, proporcionando uma navegação mais organizada e intuitiva.

## 🔐 Hierarquia de Permissões

### 🎓 **Aba "Aluno"** - Estudantes e Responsáveis
**Acesso**: **ALUNO**, **RESPONSAVEL**
**Funcionalidades**:
- � **Atividades**: Exercícios e tarefas disponíveis
- 🏆 **Ranking**: Classificação de desempenho
- 📄 **Relatório de Desempenho**: Progresso acadêmico individual
- 📨 **Comunicados**: Notificações da escola
- 💰 **Pagamentos**: Consulta de mensalidades e pagamentos
- � **Perfil do Aluno**: Dados pessoais e acadêmicos

### 📚 **Aba "Professor"** - PROFESSOR e superiores
**Acesso**: **PROFESSOR**, **SECRETARIA**, **COORDENADOR**, **ADMIN**
**Funcionalidades**:
- 👥 **Meus Alunos**: Lista de alunos sob responsabilidade
- 📖 **Minhas Turmas**: Gestão das turmas atribuídas
- 📊 **Relatórios de Aula**: Relatórios pedagógicos e frequência

### 🏢 **Aba "Gestão"** - SECRETARIA e superiores
**Acesso**: **SECRETARIA**, **COORDENADOR**, **ADMIN**
**Funcionalidades**:
- 👨‍🏫 **Gestão de Professores**: CRUD completo de professores
- ➕ **Cadastro de Alunos**: Registro de novos estudantes
- 📈 **Relatórios**: Relatórios administrativos e financeiros
- 📢 **Comunicados**: Gestão de comunicados institucionais
- 💳 **Pagamentos**: Controle financeiro e mensalidades

### 👑 **Aba "Sistema"** - Apenas ADMIN (última posição)
**Acesso**: Exclusivo para **ADMIN**
**Funcionalidades**:
- � **Logs do Sistema**: Monitoramento completo de ações
- ⚙️ **Configurações**: Configurações globais do sistema
- � **Backup do Sistema**: Gestão de backups e restauração

## 🎛️ Funcionalidades do Sistema

### ✅ **Abas Colapsáveis**
- **Expandir/Recolher**: Clique no cabeçalho da aba
- **Ícones visuais**: Setas indicam estado (▶️ recolhida, 🔽 expandida)
- **Estado persistente**: Expansão mantida durante navegação

### 🔒 **Controle de Acesso Dinâmico**
- **Exibição inteligente**: Apenas abas acessíveis aparecem
- **Validação por item**: Cada funcionalidade verifica permissões
- **Feedback visual**: Diferentes cores para estados ativos/inativos

### 🏠 **Home Universal**
- **Sempre visível**: Disponível para todos os usuários
- **Ponto central**: Acesso rápido ao dashboard principal

## 📊 Mapeamento de Permissões (Nova Ordem)

| Role | Aluno | Professor | Gestão | Sistema |
|------|-------|-----------|--------|---------|
| **ADMIN** | ❌ | ✅ | ✅ | ✅ |
| **COORDENADOR** | ❌ | ✅ | ✅ | ❌ |
| **SECRETARIA** | ❌ | ✅ | ✅ | ❌ |
| **PROFESSOR** | ❌ | ✅ | ❌ | ❌ |
| **ALUNO** | ✅ | ❌ | ❌ | ❌ |
| **RESPONSAVEL** | ✅* | ❌ | ❌ | ❌ |

*\* Responsáveis veem itens do aluno exceto "Atividades"*

## 🎨 Design e UX

### **Hierarquia Visual**
- **Cabeçalhos de aba**: Negrito, com ícones temáticos
- **Itens de menu**: Identados, com ícones menores
- **Estados ativos**: Destacados em azul (#283890)

### **Responsividade**
- **Scroll automático**: Lista grande com rolagem suave
- **Largura fixa**: 256px para consistência
- **Footer informativo**: Role do usuário sempre visível

### **Ícones Temáticos**
- ⚙️ **Sistema**: Configurações e administração
- 📚 **Professor**: Educação e ensino
- 🏢 **Gestão**: Administração e controle
- 🎓 **Aluno**: Aprendizado e crescimento

## 📊 Mapeamento de Páginas

### **Sistema**
- `logs` → Gestão de Logs (já implementado)
- `configuracoes` → Configurações do Sistema (a implementar)
- `backup` → Backup e Restauração (a implementar)

### **Professor**
- `meusAlunos` → Lista de Alunos do Professor (a implementar)
- `minhasTurmas` → Gestão de Turmas (a implementar)
- `relatoriosAula` → Relatórios Pedagógicos (a implementar)

### **Gestão**
- `professores` → Gestão de Professores (já implementado)
- `cadastro` → Cadastro de Alunos (a implementar)
- `relatorio` → Relatórios Administrativos (a implementar)
- `comunicados` → Gestão de Comunicados (a implementar)
- `pagamentos` → Controle Financeiro (a implementar)

### **Aluno**
- `atividades` → Atividades e Exercícios (já implementado)
- `ranking` → Ranking de Desempenho (já implementado)
- `relatorioAluno` → Relatório Individual (a implementar)
- `comunicadosAluno` → Comunicados Recebidos (a implementar)
- `pagamentosAluno` → Consulta Financeira (a implementar)
- `perfil` → Perfil do Estudante (a implementar)

## 🔄 Fluxo de Navegação

```
1. Usuário faz login
2. Sistema identifica role/permissões
3. Sidebar renderiza abas acessíveis
4. Usuário clica para expandir/recolher seções
5. Navegação direta para funcionalidades específicas
6. Estado da aba mantido durante sessão
```

## 🛠️ Implementação Técnica

### **Estados de Controle**
```javascript
const [expandedSections, setExpandedSections] = useState({
  sistema: true,
  professor: true, 
  gestao: true,
  aluno: true
})
```

### **Verificações de Permissão**
```javascript
// Aba Sistema - apenas ADMIN
const canAccessSistema = () => isAdmin()

// Aba Professor - PROFESSOR e superiores  
const canAccessProfessorTab = () => 
  isProfessor() || isSecretaria() || isCoordenador() || isAdmin()

// Aba Gestão - SECRETARIA e superiores
const canAccessGestaoTab = () =>
  isSecretaria() || isCoordenador() || isAdmin()
```

### **Renderização Dinâmica**
```javascript
const renderSection = (title, items, sectionKey, IconComponent) => {
  // Verificar se há itens visíveis
  const hasVisibleItems = items.some(item => !item.condition || item.condition())
  if (!hasVisibleItems) return null
  
  // Renderizar aba colapsável com itens filtrados
}
```

## 🎯 Benefícios do Sistema

- ✅ **Organização clara**: Funcionalidades agrupadas por contexto
- ✅ **Acesso controlado**: Apenas opções relevantes visíveis
- ✅ **Interface limpa**: Abas colapsáveis reduzem poluição visual
- ✅ **Escalabilidade**: Fácil adição de novas funcionalidades
- ✅ **UX otimizada**: Navegação intuitiva e responsiva

---

**Sistema pronto para expandir com novas funcionalidades!** 🚀