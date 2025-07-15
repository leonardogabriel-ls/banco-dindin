# 💸 DinDin - API de Controle Financeiro

API RESTful desenvolvida como desafio do Módulo 3 do curso da [Cubos Academy](https://cubos.academy).  
O objetivo do projeto é gerenciar transações financeiras com categorias personalizadas por usuário, oferecendo funcionalidades como cadastro, login, CRUD de categorias e transações, e um extrato financeiro.

---

## 🚀 Funcionalidades

- Cadastro e autenticação de usuários com token JWT
- Detalhamento e atualização de perfil do usuário autenticado
- CRUD de categorias
- CRUD de transações
- Listagem de transações com filtro por categoria
- Geração de extrato (entradas e saídas)
- Controle de acesso: cada usuário só pode acessar seus próprios dados

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- bcrypt.js (criptografia de senha)
- JSON Web Token (JWT)
- dotenv (variáveis de ambiente)
- UUID (identificação única)
- Nodemon (ambiente de desenvolvimento)

---

## 📂 Estrutura do Projeto

```
src/
│
├── controllers/
│   ├── usuario.js
│   ├── categoria.js
│   └── transacao.js
│
├── middlewares/
│   ├── autenticarUsuario.js
│   └── validarDados.js
│
├── database/
│   ├── conexao.js
│   └── script.sql
│
├── rotas/
│   └── rotas.js
│
├── index.js
└── .env
```

---


## 🧾 Endpoints

### Usuários
- `POST /usuario` – Cadastrar novo usuário
- `POST /login` – Login de usuário
- `GET /usuario` – Obter perfil do usuário autenticado
- `PUT /usuario` – Atualizar dados do usuário autenticado

### Categorias
- `GET /categoria` – Listar categorias do usuário
- `GET /categoria/:id` – Detalhar categoria específica
- `POST /categoria` – Cadastrar nova categoria
- `PUT /categoria/:id` – Editar categoria existente
- `DELETE /categoria/:id` – Remover categoria

### Transações
- `GET /transacao` – Listar transações
- `GET /transacao/extrato` – Obter extrato de entradas/saídas
- `GET /transacao/:id` – Detalhar transação específica
- `POST /transacao` – Cadastrar nova transação
- `PUT /transacao/:id` – Atualizar transação
- `DELETE /transacao/:id` – Remover transação

---

## 🧪 Instalação e Uso

### 1. Clone o repositório
```bash
git clone https://github.com/leonardogabriel-ls/banco-dindin.git
cd banco-dindin
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/dindin
JWT_SECRET=sua_chave_secreta
```

### 4. Crie o banco de dados e tabelas
Utilize o script `database/script.sql` para gerar a estrutura do banco:

```bash
psql -U seu_usuario -d dindin -f src/database/script.sql
```

### 5. Inicie o servidor
```bash
npm run dev
```

---

## ✅ Regras de Validação

- **Email único** para cada usuário
- Todos os campos obrigatórios devem ser validados
- Senhas são armazenadas com hash (bcrypt)
- Cada usuário só pode acessar/modificar seus próprios dados
- Todos os valores monetários são armazenados em centavos (ex: R$10,00 → 1000)

---

## 📊 Status Codes Utilizados

| Código | Significado              |
|--------|--------------------------|
| 200    | OK                       |
| 201    | Created                  |
| 204    | No Content               |
| 400    | Bad Request              |
| 401    | Unauthorized             |
| 403    | Forbidden                |
| 404    | Not Found                |

---

## 🧠 Aprendizados

- Boas práticas de organização de código no backend
- Autenticação com JWT
- Conexão com PostgreSQL via `pg`
- Criação e utilização de middlewares
- Validações e tratamento de erros
- API RESTful na prática

---

## 🏁 Conclusão

Este projeto foi essencial para consolidar meus conhecimentos em back-end e reforçar a importância da organização, segurança e boas práticas no desenvolvimento de APIs.

---

## 👤 Autor

**Leonardo Gabriel Lima da Silva**  
🔗 [GitHub](https://github.com/leonardogabriel-ls)  
🔗 [LinkedIn](https://www.linkedin.com/in/leonardo-gabriel-547892230/)

---
