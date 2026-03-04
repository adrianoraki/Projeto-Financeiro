# Tarefas Pendentes - Limpeza de Código

Olá! Aqui está a lista de tarefas que combinamos de continuar mais tarde.

## Erros de Linting a Corrigir:

Ainda restam alguns erros de `linting` para resolver. A maioria deles é a falta da importação do `React` em componentes que o utilizam.

### 1. Falta de `import React from 'react';`

Adicionar a importação `import React from 'react';` nos seguintes arquivos:

-   [x] `components/card/CardForm.tsx`
-   [x] `components/investments/CdiCard.tsx`
-   [x] `components/investments/InstitutionSelector.tsx`
-   [x] `components/investments/InvestmentCard.tsx`
-   [x] `components/investments/InvestmentForm.tsx`
-   [x] `components/investments/InvestmentTypeSelector.tsx`
-   [x] `components/payment/PaymentMethodForm.tsx`
-   [x] `components/recurring/RecurringForm.tsx`
-   [x] `components/transaction/AddMoneyModal.tsx`
-   [x] `components/transaction/TransactionForm.tsx`
-   [x] `components/transaction/TransactionModal.tsx`
-   [x] `app/(main)/dashboard/page.tsx`

### 2. Código Obsoleto/Não Utilizado

-   [x] **`lib/firebase-admin.ts`**: A função `admin.auth()` está obsoleta (`deprecated`). Precisamos investigar e atualizar para a nova API recomendada (`getAuth`).
-   [x] **`app/api/budget/route.ts`**: A variável `req` na função `POST` está declarada mas nunca é usada. Precisamos remover ou utilizar a variável.

Quando você estiver pronto, é só me avisar e continuaremos a limpeza!
