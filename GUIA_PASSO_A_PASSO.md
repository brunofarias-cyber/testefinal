# 🚀 Guia Passo a Passo: Neon + Render

Aqui está o guia completo para conectar seu banco de dados e colocar o site no ar.

## Parte 1: Banco de Dados (Neon)

1.  **Acesse o Neon:**
    *   Vá para [neon.tech](https://neon.tech) e faça login (pode usar o Google).

2.  **Crie um Projeto:**
    *   Clique em **"New Project"**.
    *   Dê um nome (ex: `bprojetos-db`).
    *   Escolha a região mais próxima (ex: `US East` ou `South America` se disponível).
    *   Clique em **"Create Project"**.

3.  **Pegue a String de Conexão:**
    *   Assim que o projeto for criado, você verá um "Dashboard".
    *   Procure por **"Connection String"**.
    *   ⚠️ **Importante:** Certifique-se de selecionar a opção **"Pooled connection"** (checkbox).
    *   Copie o link que começa com `postgresql://...`.
    *   *Guarde esse link, vamos usar no Render.*

---

## Parte 2: Deploy no Render

1.  **Acesse o Render:**
    *   Vá para [render.com](https://render.com) e faça login.

2.  **Crie um Novo Serviço:**
    *   Clique no botão **"New +"** (canto superior direito).
    *   Selecione **"Web Service"**.

3.  **Conecte o GitHub:**
    *   Na lista de repositórios, encontre o seu projeto (`testefinal` ou o nome que você deu).
    *   Clique em **"Connect"**.

4.  **Configuração (Automática):**
    *   Como eu criei o arquivo `render.yaml`, o Render pode detectar a configuração automaticamente.
    *   Se ele perguntar, confirme as configurações.
    *   Se ele **não** detectar automaticamente, preencha:
        *   **Name:** `bprojetos` (ou o que preferir)
        *   **Runtime:** `Node`
        *   **Build Command:** `npm install && npm run build:render`
        *   **Start Command:** `npm run start:prod`

5.  **Variáveis de Ambiente (Environment Variables):**
    *   Essa é a parte mais importante! Role para baixo até a seção **"Environment Variables"**.
    *   Adicione as seguintes variáveis:

    | Key (Nome) | Value (Valor) |
    | :--- | :--- |
    | `DATABASE_URL` | Cole o link do Neon que você copiou (o `postgresql://...`) |
    | `JWT_SECRET` | Crie uma senha secreta longa e aleatória (ex: `minha-senha-super-secreta-123`) |
    | `NODE_VERSION` | `20.16.11` |

6.  **Finalizar:**
    *   Clique em **"Create Web Service"**.

---

## Parte 3: Verificando

1.  O Render vai começar o processo de "Build".
2.  Você pode acompanhar na aba **"Logs"**.
3.  Se tudo der certo, você verá uma mensagem como `Server running on port ...` e o status ficará **Live** (verde).
4.  Clique no link do seu site (ex: `https://bprojetos.onrender.com`) para testar!

---

### 🆘 Dúvidas Comuns

*   **Erro de Build?** Verifique se você copiou o comando de build corretamente.
*   **Erro de Conexão com Banco?** Verifique se a `DATABASE_URL` no Render está igualzinha a do Neon e se a opção "Pooled" estava marcada.
