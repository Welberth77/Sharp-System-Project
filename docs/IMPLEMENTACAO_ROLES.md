# Sistema de Gestão Escolar - Implementação de Roles e Gestão de Professores

## 📋 Resumo das Implementações

Este documento descreve as implementações realizadas para o sistema de roles e gestão de professores no Sharp System Course.

## 🔐 Sistema de Roles Implementadas

### Roles Disponíveis
- **ADMIN**: Acesso total ao sistema
- **COORDENADOR**: Gestão de professores e alunos (sem exclusão)
- **PROFESSOR**: Visualização de alunos
- **SECRETARIA**: Gestão de professores e alunos (sem exclusão)
- **ALUNO**: Acesso às atividades e ranking
- **RESPONSAVEL**: Visualização limitada dos dados do aluno

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos
1. **`src/hooks/usePermissions.js`**
   - Hook customizado para gerenciar permissões por role
   - Funções de verificação de acesso

2. **`src/pages/GestãoProfessores.jsx`**
   - Página completa de gestão de professores
   - CRUD completo (Create, Read, Update, Delete)
   - Interface responsiva com modal

3. **`src/styles/GestãoProfessores.css`**
   - Estilos específicos para a página de professores
   - Animações e responsividade

4. **`src/components/AppRouter.jsx`**
   - Roteamento protegido baseado em permissões
   - Navegação segura entre páginas

### Arquivos Modificados

#### `src/context/AuthContext.jsx`
- Adicionado suporte para captura de `role` da API
- Gerenciamento de `userData` e `userRole`
- Persistência em localStorage

#### `src/components/Sidebar.jsx`
- Menu dinâmico baseado na role do usuário
- Diferentes opções para cada tipo de usuário
- Integração com sistema de permissões

#### `src/App.jsx`
- Simplificado para usar o novo sistema de roteamento
- Integração com AppRouter

## 🔧 Como Funciona

### 1. Autenticação
```javascript
// A API deve retornar:
{
  "bearerToken": "jwt_token_here",
  "role": "ADMIN", // Role em maiúsculo
  "user": { /* dados do usuário */ }
}
```

### 2. Verificação de Permissões
```javascript
import { usePermissions } from "../hooks/usePermissions"

const { canAccessProfessors, isAdmin } = usePermissions()

if (canAccessProfessors()) {
  // Usuário pode acessar gestão de professores
}
```

### 3. Menu Dinâmico
- **ALUNO**: Home, Atividades, Ranking, Perfil
- **ADMIN/COORDENADOR/SECRETARIA**: Home, Relatórios, Comunicados, Pagamentos, Gestão de Professores
- **PROFESSOR**: Home, Relatórios (visualização limitada)
- **RESPONSAVEL**: Home, Ranking, Perfil (visualização dos filhos)

## 📊 Funcionalidades da Gestão de Professores

### Permissões por Role
- **ADMIN**: Criar ✅, Editar ✅, Visualizar ✅, Excluir ✅
- **COORDENADOR**: Criar ✅, Editar ✅, Visualizar ✅, Excluir ❌
- **SECRETARIA**: Criar ✅, Editar ✅, Visualizar ✅, Excluir ❌
- **Outras Roles**: Sem acesso ❌

### Interface
- **Lista de Professores**: Tabela responsiva com paginação
- **Modal de Criação/Edição**: Formulário completo
- **Validações**: Cliente e servidor
- **Feedback**: Alertas de sucesso/erro

### Campos do Professor
- Nome (obrigatório)
- Email (obrigatório)
- Telefone (opcional)
- Disciplina (obrigatório)
- Status (Ativo/Inativo)

## 🔗 Endpoints Esperados da API

```
GET /professores - Listar professores
POST /professores - Criar professor
PUT /professores/:id - Atualizar professor
DELETE /professores/:id - Excluir professor
```

## 🎯 Próximos Passos Sugeridos

1. **Gestão de Alunos**: Seguir mesmo padrão
2. **Gestão de Responsáveis**: Para vincular alunos
3. **Sistema de Notificações**: Baseado em roles
4. **Relatórios Avançados**: Filtros por permissão
5. **Auditoria**: Log de ações por usuário

## 🚀 Como Testar

1. Faça login com diferentes roles
2. Observe as opções do menu lateral
3. Tente acessar `/professores` com diferentes usuários
4. Teste as operações CRUD na gestão de professores

## 📱 Responsividade

- Desktop: Layout completo com sidebar
- Tablet: Adaptação da tabela
- Mobile: Interface otimizada

---

**Desenvolvido para Sharp System Course**
*Sistema de gestão escolar com controle avançado de permissões*