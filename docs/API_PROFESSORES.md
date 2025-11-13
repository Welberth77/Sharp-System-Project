# API de Gestão de Professores - Sharp System Course

## 📋 Endpoints Configurados

### 🔍 GET /professores
**Descrição**: Lista todos os professores
**Resposta Esperada**:
```json
[
  {
    "id": 1,
    "nomeCompleto": "Ricardo Almeida Costa",
    "email": "ricardo.costa@escoladeingles.com",
    "cpf": "111.222.333-44",
    "rg": "1234567-8 SSP/AL",
    "dataNascimento": "1990-07-25",
    "telefoneContato": "(82) 99876-5432",
    "endereco": {
      "logradouro": "Avenida Doutor Antônio Gouveia",
      "numero": "1120",
      "complemento": "Apto 502",
      "bairro": "Ponta Verde",
      "cidade": "Maceió",
      "estado": "AL",
      "cep": "57035-180"
    },
    "dataContratacao": "2023-03-01",
    "professorStatus": "ATIVO",
    "registroFuncional": "PROF20230301",
    "formacaoAcademica": "Letras - Inglês pela UFAL",
    "biografia": "Professor especialista em inglês para negócios..."
  }
]
```

### 🔍 GET /professores/debug/{id}
**Descrição**: Busca dados completos de um professor específico (usado na edição)
**Parâmetros**: `id` do professor na URL
**Resposta Esperada**:
```json
{
  "id": 1,
  "nomeCompleto": "Ricardo Almeida Costa",
  "email": "ricardo.costa@escoladeingles.com",
  "cpf": "111.222.333-44",
  "rg": "1234567-8 SSP/AL",
  "dataNascimento": "1990-07-25",
  "telefoneContato": "(82) 99876-5432",
  "endereco": {
    "logradouro": "Avenida Doutor Antônio Gouveia",
    "numero": "1120",
    "complemento": "Apto 502",
    "bairro": "Ponta Verde",
    "cidade": "Maceió",
    "estado": "AL",
    "cep": "57035-180"
  },
  "dataContratacao": "2023-03-01",
  "professorStatus": "ATIVO",
  "registroFuncional": "PROF20230301",
  "formacaoAcademica": "Letras - Inglês pela UFAL",
  "biografia": "Professor especialista em inglês para negócios, com 5 anos de experiência em intercâmbios e certificação TOEFL."
}
```

### 🔍 GET /professores/debug/all
**Descrição**: Lista todos os professores com dados completos (debug/administração)
**Resposta**: Array com objetos completos como o exemplo acima

### ➕ POST /professores
**Descrição**: Cria um novo professor
**Body Exemplo**:
```json
{
  "nomeCompleto": "Ricardo Almeida Costa",
  "email": "ricardo.costa@escoladeingles.com",
  "cpf": "111.222.333-44",
  "rg": "1234567-8 SSP/AL",
  "dataNascimento": "1990-07-25",
  "telefoneContato": "(82) 99876-5432",
  "endereco": {
    "logradouro": "Avenida Doutor Antônio Gouveia",
    "numero": "1120",
    "complemento": "Apto 502",
    "bairro": "Ponta Verde",
    "cidade": "Maceió",
    "estado": "AL",
    "cep": "57035-180"
  },
  "dataContratacao": "2023-03-01",
  "professorStatus": "ATIVO",
  "registroFuncional": "PROF20230301",
  "formacaoAcademica": "Letras - Inglês pela UFAL",
  "biografia": "Professor especialista em inglês para negócios, com 5 anos de experiência em intercâmbios e certificação TOEFL."
}
```

### ✏️ PUT /professores/{id}
**Descrição**: Atualiza um professor existente
**Body**: Mesmo formato do POST
**Parâmetros**: `id` do professor na URL

### 🗑️ DELETE /professores/{id}
**Descrição**: Remove um professor
**Parâmetros**: `id` do professor na URL
**Permissões**: Apenas ADMIN

## 🔐 Permissões por Role

| Role | Visualizar | Criar | Editar Ativos | Inativar | Reativar | Excluir Definitivo |
|------|------------|-------|---------------|----------|----------|-------------------|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| COORDENADOR | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| SECRETARIA | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| PROFESSOR | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ALUNO | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| RESPONSAVEL | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 📝 Campos Obrigatórios

### Dados Pessoais
- ✅ **nomeCompleto**: Nome completo do professor
- ✅ **email**: Email único do professor
- ✅ **cpf**: CPF no formato 000.000.000-00
- ✅ **rg**: RG com órgão emissor (ex: 1234567-8 SSP/AL)
- ✅ **dataNascimento**: Data no formato YYYY-MM-DD
- ✅ **telefoneContato**: Telefone para contato

### Endereço
- ✅ **logradouro**: Nome da rua/avenida
- ✅ **numero**: Número do endereço
- ⚪ **complemento**: Complemento (opcional)
- ✅ **bairro**: Bairro
- ✅ **cidade**: Cidade
- ✅ **estado**: Estado (seleção UF)
- ✅ **cep**: CEP no formato 00000-000

### Dados Profissionais
- ✅ **dataContratacao**: Data de contratação (YYYY-MM-DD)
- ✅ **professorStatus**: ATIVO ou INATIVO
- ✅ **registroFuncional**: Código único do professor
- ✅ **formacaoAcademica**: Formação acadêmica
- ✅ **biografia**: Biografia profissional

## 🎨 Interface

### Lista de Professores
- **Duas abas principais:**
  - **Professores Ativos**: Lista apenas professores com status ATIVO
  - **Professores Inativos**: Lista apenas professores com status INATIVO
- **Tabela responsiva com:**
  - Nome Completo
  - Email
  - Telefone
  - Registro Funcional
  - Status
  - Ações (baseadas em permissão e status)

### Ações por Status
#### Professores Ativos:
- ✏️ **Editar**: Permite editar todas as informações
- 🔴 **Inativar**: Move o professor para "Inativos" (não aparece mais na lista ativa)

#### Professores Inativos:
- 🚫 **Editar**: Desabilitado (não clicável)
- ✅ **Reativar**: Move o professor de volta para "Ativos"
- 🗑️ **Excluir Permanentemente**: Remove definitivamente do sistema (apenas ADMIN)

### Modal de Criação/Edição
- Formulário completo dividido em seções:
  - **Dados Pessoais**: Informações básicas
  - **Endereço**: Endereço completo
  - **Dados Profissionais**: Informações da escola
- Validação em tempo real
- Design responsivo

## 🚀 Como Testar

1. **Login como ADMIN**: Use suas credenciais reais de administrador
2. **Acesse**: Menu lateral → "Gestão de Professores"
3. **Teste as operações na aba "Professores Ativos"**:
   - ➕ Criar novo professor
   - 👁️ Visualizar lista de ativos
   - ✏️ Editar professor ativo (busca dados completos em `/professores/debug/{id}`)
   - 🔴 Inativar professor (move para aba "Inativos")
4. **Teste as operações na aba "Professores Inativos"**:
   - 👁️ Visualizar professores inativos
   - 🚫 Verificar que "Editar" está desabilitado
   - ✅ Reativar professor (move para aba "Ativos")
   - 🗑️ Excluir permanentemente (apenas ADMIN, com confirmação)

### 🔧 Fluxo de Edição Otimizado:
1. **Clique em "Editar"** → Modal abre com loading
2. **Sistema busca dados** via `GET /professores/debug/{id}`
3. **Preenchimento automático** de TODOS os campos
4. **Formulário pronto** para edição com dados completos

## 🔧 Headers HTTP Necessários

```javascript
Authorization: Bearer {token}
Content-Type: application/json
```

## 📱 Responsividade

- **Desktop**: Layout completo com modal largo
- **Tablet**: Formulário adaptado em 2 colunas
- **Mobile**: Layout de coluna única

---

**Sistema pronto para integração com a API!** 🎯