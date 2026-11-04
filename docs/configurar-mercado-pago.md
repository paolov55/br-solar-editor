# Configurar o Mercado Pago (passo a passo)

A plataforma usa o **Checkout Pro**: ao clicar em "Pagar", o usuário é levado para uma página do próprio
Mercado Pago, paga por Pix, cartão ou boleto e volta para a plataforma. O Mercado Pago avisa a plataforma
do pagamento por um **webhook**, e o acesso é liberado automaticamente.

Você vai precisar de 3 coisas do Mercado Pago: o **Access Token** (`MP_ACCESS_TOKEN`), a
**assinatura secreta do webhook** (`MP_WEBHOOK_SECRET`) e a **URL do webhook**.

---

## Parte 1 — Preparar o ambiente (uma vez)

### 1.1 Gerar o `AUTH_SECRET`
No terminal: `openssl rand -base64 32` e cole o resultado em `AUTH_SECRET`.

### 1.2 Supabase
1. No painel do Supabase → **Project Settings → API**, copie a chave **`service_role`** para `SUPABASE_SERVICE_ROLE_KEY`.
   Ela é secreta: nunca coloque em variável `NEXT_PUBLIC_*`.
2. Aplique as tabelas: abra **SQL Editor**, cole o conteúdo de `supabase/migrations/0002_cobranca.sql` e execute.
   (Alternativa: `npx supabase db push`, se o projeto estiver vinculado.)
   > A migration usa a função `set_updated_at()` criada em `0001_init.sql`. Se o `0001` nunca foi aplicado
   > nesse projeto, aplique-o antes (ou rode só o trecho `create function ... set_updated_at` dele).

### 1.3 Senhas
Preencha `ADMIN_SENHA` e `USUARIO_SENHA` com senhas fortes. Conta com senha vazia fica desativada.

---

## Parte 2 — Mercado Pago em modo de teste

### 2.1 Conta de vendedor
1. Use (ou crie) uma conta em mercadopago.com.br com os dados verificados (CPF/CNPJ).
2. **Cadastre uma chave Pix** na conta (App/site → Seu perfil → Pix → chaves). Sem chave, o Pix não aparece no checkout.

### 2.2 Criar a aplicação
1. Acesse **https://www.mercadopago.com.br/developers/panel/app** e clique em **Criar aplicação**.
2. Nome: `BR Solar Editor`. Tipo de solução: **Pagamentos online**. Produto: **Checkout Pro**.
   Aceite os termos e crie.

### 2.3 Pegar o Access Token de teste
1. Abra a aplicação → **Credenciais de teste**.
2. Copie o **Access Token** de teste para `MP_ACCESS_TOKEN`. No Checkout Pro ele **também começa com `APP_USR-`**,
   igual ao de produção; o prefixo não diferencia os dois. Ele pertence à conta de teste vendedora criada
   junto com a aplicação (nome `TESTUSER...`). Para conferir, rode:
   `curl -s -H "Authorization: Bearer SEU_TOKEN" https://api.mercadopago.com/users/me` e veja se o `nickname`
   começa com `TESTUSER`.

### 2.4 Contas de teste (comprador e vendedor)
Para pagar sem gastar dinheiro de verdade, o Mercado Pago pede um **comprador de teste**:
1. Na aplicação → **Contas de teste** → crie uma conta **Comprador** (e, se pedir, uma **Vendedor**).
2. Para o pagamento de teste, abra uma janela anônima e entre no checkout com a conta de comprador de teste.
3. Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards
   — o **nome do titular** define o resultado (`APRO` = aprovado, `OTHE` = recusado). CPF de teste: `12345678909`.

### 2.5 Webhook (aviso automático de pagamento)
O webhook precisa de uma URL **pública com https**; `localhost` não funciona. Por isso essa etapa é feita
depois do deploy na Vercel (parte 3). Em desenvolvimento local, o pagamento ainda é confirmado quando o
usuário volta do checkout para `/pagamentos` — o webhook só garante os casos em que ele fecha a página antes
de voltar (comum no Pix e no boleto).

### 2.6 Testar localmente
1. `npm run dev` e entre como `brenorufino`, aceite os termos.
2. No admin (`paolovinicios`), ajuste o dia de vencimento para que a cobrança fique a vencer; ou use
   "Alterar" no vencimento de uma cobrança.
3. Em **Pagamentos**, clique em **Pagar**, pague com a conta/cartão de teste e volte à plataforma.
4. A cobrança deve aparecer como **Pago** no histórico e no painel admin.

---

## Parte 3 — Publicar e ligar o webhook

1. **Vercel → Settings → Environment Variables:** cadastre todas as variáveis de `.env.example`.
   `APP_URL` = a URL final, por exemplo `https://brsolar-editor.vercel.app` (sem `/` no fim).
2. Faça o deploy (ou *Redeploy*, se já existia).
3. No Mercado Pago → sua aplicação → **Webhooks → Configurar notificações**:
   - **URL de teste:** `https://SEU-DOMINIO/api/mercadopago/webhook`
   - **Eventos:** marque **Pagamentos**.
   - Salve e copie a **Assinatura secreta** para `MP_WEBHOOK_SECRET` (na Vercel) e faça *Redeploy*.
4. Clique em **Simular notificação**. Resposta esperada: `200`. Se vier `401`, a assinatura secreta cadastrada
   na Vercel está diferente da exibida no painel.
   > A simulação envia um pagamento fictício, então a plataforma só responde 200 sem alterar nenhuma cobrança.
5. Faça um pagamento de teste completo e confira que a cobrança vira **Pago** mesmo sem voltar ao site.

---

## Parte 4 — Ir para produção (cobrar de verdade)

1. Na aplicação → **Credenciais de produção** → preencha os dados do negócio (ramo, site) e **ative** as credenciais.
2. Copie o **Access Token de produção** (`APP_USR-...`) para `MP_ACCESS_TOKEN` na Vercel.
3. Em **Webhooks**, configure também a **URL de produção** (a mesma) e copie a **assinatura secreta de produção**
   para `MP_WEBHOOK_SECRET`. Cada modo tem a sua assinatura.
4. *Redeploy* na Vercel.
5. Faça um pagamento real de valor baixo (por exemplo, altere temporariamente o valor no banco, ou pague e
   estorne no app do Mercado Pago) para validar o fluxo antes de cobrar o cliente.

> Taxas: o Mercado Pago desconta uma taxa por transação (varia por forma de pagamento e prazo de recebimento).
> Confira em https://www.mercadopago.com.br/costs-section.

---

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Botão "Pagar" dá erro 500 | `MP_ACCESS_TOKEN` vazio/incorreto, ou `APP_URL` com `/` no fim ou inválida |
| "Uma das partes com as quais você está tentando efetuar o pagamento é de teste" | Quem paga não é uma conta de teste. Pague numa janela anônima, logado só com o **comprador de teste** (nunca sua conta real nem o vendedor de teste) |
| Pix não aparece no checkout | Falta chave Pix na conta do vendedor |
| Pagamento aprovado, cobrança continua pendente | Webhook não configurado ou `MP_WEBHOOK_SECRET` errado; abra `/pagamentos` após pagar para forçar a confirmação |
| Webhook responde 401 | Assinatura secreta diferente (teste × produção) |
| Tudo dá erro 500 depois do deploy | Migration `0002` não aplicada ou `SUPABASE_SERVICE_ROLE_KEY` ausente |
