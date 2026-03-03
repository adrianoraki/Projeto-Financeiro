# Plano de Monetização: Implementando Planos "Freemium"

Este documento descreve o plano estratégico e técnico para introduzir um modelo de monetização "Freemium" (Free + Premium) no FinanceApp.

## Visão Geral do Modelo

O objetivo é oferecer um conjunto robusto de funcionalidades gratuitas para atrair e engajar os usuários, enquanto recursos mais avançados, que demandam maior poder computacional ou oferecem valor de negócio superior, serão restritos a um plano pago ("Plano Pro").

---

## Componentes Técnicos Necessários

A implementação se baseia em quatro pilares interconectados:

1.  **Gerenciamento de Assinatura no Banco de Dados:**
    *   **Ação:** Adicionar um campo `plan` (ou `subscriptionTier`) ao documento de cada usuário no Firestore.
    *   **Valores Possíveis:** `free` (padrão no cadastro), `pro`.
    *   **Objetivo:** Ter uma fonte única e confiável sobre o status da assinatura de cada usuário.

2.  **Gateway de Pagamento (Stripe):**
    *   **Ação:** Integrar o Stripe como processador de pagamentos. Ele cuidará da segurança e do processamento dos cartões de crédito.
    *   **Configuração no Stripe:**
        *   Criar um "Produto" no painel do Stripe (ex: "FinanceApp - Plano Pro").
        *   Definir um ou mais "Preços" para esse produto (ex: R$ 19,90/mês).

3.  **Webhooks para Sincronização:**
    *   **Ação:** Criar uma API Route no Next.js (ex: `app/api/stripe-webhooks/route.ts`).
    *   **Funcionalidade:** Este endpoint será privado e receberá notificações (webhooks) diretamente do Stripe.
    *   **Lógica Principal:** Ao receber um evento `checkout.session.completed` (pagamento bem-sucedido), o endpoint irá:
        1.  Identificar o `userId` associado à transação.
        2.  Atualizar o campo `plan` do usuário para `pro` no Firestore.

4.  **UI Condicional no Frontend:**
    *   **Ação:** Modificar o `AuthContext` para carregar e prover o `plan` do usuário junto com as outras informações (`user`, `loading`).
    *   **Lógica nos Componentes:** Envolver os recursos "Pro" em uma verificação condicional.

    ```tsx
    // Exemplo de lógica para exibir um componente Pro
    const { user } = useAuth();

    {user.plan === 'pro' ? <RecursoPremium /> : <BotaoFacaUpgrade />}
    ```

---

## Divisão de Funcionalidades (Proposta)

Baseado no `blueprint.md` atual, esta é uma sugestão de divisão:

### Plano Gratuito (Free)

*   **Autenticação:** Cadastro, login, logout.
*   **Dashboard:** Visão geral com saldo, receitas e despesas.
*   **Transações:** Cadastro manual de receitas e despesas (pode-se incluir um limite mensal, ex: 100 transações/mês, para incentivar o upgrade).
*   **Metas Financeiras:** Cadastro de até 3 metas.

### Plano Pago (Pro)

*   **Tudo do Plano Gratuito (sem limites).**
*   **Gerenciamento de Cartões de Crédito:** Seção "Meus Cartões" completa.
*   **Investimentos:** Funcionalidade completa de acompanhamento.
*   **Transações Recorrentes:** Agendamento de transações.
*   **Orçamento:** Definição de orçamentos por categoria.
*   **Calendário de Gastos:** Acesso à visão de calendário.
*   **Relatórios Avançados:** (Funcionalidade futura) Gráficos detalhados, exportação de dados, etc.
*   **Metas Financeiras Ilimitadas.**

---

## Roteiro de Implementação Futuro

1.  **Configuração de Ambiente:**
    *   Criar conta no Stripe e obter chaves de API (desenvolvimento e produção).
    *   Armazenar as chaves de forma segura como variáveis de ambiente (`.env.local`).
2.  **Backend (Firebase & Webhooks):**
    *   Modificar a estrutura de dados do usuário no Firestore.
    *   Desenvolver e testar a API Route que recebe os webhooks do Stripe.
3.  **Frontend (UI & Lógica):**
    *   Atualizar o `AuthContext` para incluir o status do plano.
    *   Criar o componente de "Upgrade" (página de preços, botão de checkout).
    *   Implementar a lógica de bloqueio/desbloqueio nos componentes e páginas relevantes.
