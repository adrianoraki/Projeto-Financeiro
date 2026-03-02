
# Blueprint: FinanceApp

## Visão Geral

O FinanceApp é uma aplicação web completa para gerenciamento de finanças pessoais. Ele permite que os usuários cadastrem-se, façam login, e gerenciem suas transações (receitas e despesas), definam metas financeiras, acompanhem orçamentos mensais e monitorem o desempenho de plataformas de investimento. A aplicação possui um design moderno, responsivo e intuitivo, com gráficos interativos que facilitam a visualização da saúde financeira do usuário.

## Esboço do Projeto

### Estilo e Design

O FinanceApp adota um design **dark theme (tema escuro)**, moderno e sofisticado, focado em criar uma experiência de usuário imersiva e visualmente agradável.

- **Paleta de Cores:**
  - **Fundo Principal:** Cinza escuro (`#121212`).
  - **Cards e Cabeçalho:** Grafite (`#1C1C22`).
  - **Barra Lateral:** Verde-azulado escuro e suave (`#1A3A3A`).
  - **Cores de Destaque:**
    - **Renda:** Verde vibrante (`#10B981`).
    - **Despesa:** Vermelho vibrante (`#EF4444`).
    - **Saldo:** Azul (`#0070F3`).
- **Tipografia:** Fonte limpa e moderna (`Inter`), com uma hierarquia clara para garantir a legibilidade.
- **Layout:** Responsivo, com uma barra de navegação lateral e uma área de conteúdo principal.
- **Ícones:** Uso de `react-icons` para uma navegação intuitiva.
- **Gráficos:** Utilização da biblioteca `react-chartjs-2` para criar gráficos de linha e de barras interativos.

### Funcionalidades Implementadas

- **Autenticação e Perfil de Usuário:**
  - Registro, login e logout seguros.
  - Exibição da foto e do e-mail do usuário na barra lateral.
- **Dashboard:**
  - Cabeçalho com resumo financeiro (saldo, receitas, despesas) e botões de ação.
  - Gráficos de comparação e evolução do patrimônio.
- **Transações:**
  - Listagem e adição de novas transações através de um formulário modal.
- **Calendário de Gastos:**
  - Visualização de um calendário anual com os dias de despesa destacados.
- **Orçamento:**
  - Definição de limites de gasto mensais por categoria.
- **Investimentos:**
  - Listagem e acompanhamento de plataformas de investimento.
- **Metas Financeiras:**
  - Cadastro, acompanhamento e adição de fundos a metas financeiras.
- **Transações Recorrentes:**
  - Agendamento de transações recorrentes.
- **Gerenciamento de Cartões de Crédito:**
  - Seção "Meus Cartões" para adicionar, visualizar e excluir cartões.
  - A lógica de parcelamento agora utiliza a data de vencimento do cartão para calcular os lançamentos futuros.

### Estrutura de Rotas

O projeto utiliza *Route Groups* do Next.js para uma organização lógica: `app/(main)` para páginas principais e `app/login` para a autenticação.

## Histórico de Correções (Sessão Recente)

Esta seção documenta a resolução de um bug crítico relacionado à funcionalidade "Meus Cartões".

1.  **Problema Inicial:** Ao adicionar um novo cartão, ele ficava visualmente "travado" em um estado desabilitado (cinza claro), sem ser salvo no banco de dados. O front-end tentava salvar, mas a operação nunca era concluída.

2.  **Diagnóstico e Depuração:** A investigação revelou uma cascata de problemas de configuração com o Firebase, que impediam qualquer escrita no banco de dados Firestore.
    - **Causa Raiz 1: Falta de Configuração do Firebase.** O projeto não estava inicializado como um projeto Firebase, faltando o arquivo `firebase.json` e as configurações associadas.
    - **Causa Raiz 2: Falta de Autenticação.** O ambiente de desenvolvimento não estava autenticado na conta Firebase do usuário.
    - **Causa Raiz 3: Nenhuma Regra de Segurança.** Mesmo que a autenticação funcionasse, não existiam regras de segurança (`firestore.rules`) para autorizar a escrita de dados.

3.  **Processo de Resolução:**
    - **Passo 1: Autenticação:** Guiado pelo usuário, o ambiente foi autenticado com sucesso na conta Firebase correta via fluxo OAuth2.
    - **Passo 2: Seleção do Projeto:** O projeto `projeto-financeiro-2026` foi selecionado e configurado como o projeto ativo.
    - **Passo 3: Inicialização do Firebase:** O comando `firebase init` foi executado para criar o `firebase.json` e configurar o projeto localmente.
    - **Passo 4: Primeira Tentativa de Regra:** Uma regra de segurança inicial foi criada e implantada. Isso levou a um novo erro.

4.  **Problema Secundário:** Após a configuração inicial, o erro evoluiu. Em vez de travar, o aplicativo exibia a mensagem: "Ocorreu um erro ao salvar o cartão. A alteração foi desfeita."

5.  **Diagnóstico e Solução Final:**
    - **Causa Raiz:** A regra de segurança era muito restritiva. Ela só permitia a escrita se o usuário já fosse o "dono" do documento (`resource.data.uid`), o que é impossível para um documento que ainda não foi criado.
    - **Correção:** A regra foi refinada para tratar a criação (`create`) e a modificação (`update`, `delete`) de forma separada.
        - `allow create`: Se o ID do usuário na **nova** requisição (`request.resource.data.uid`) for igual ao ID do usuário autenticado.
        - `allow read, update, delete`: Se o ID do usuário no documento **existente** (`resource.data.uid`) for igual ao ID do usuário autenticado.
    - **Implantação Final:** A regra corrigida foi implantada com sucesso, resolvendo completamente o bug. A funcionalidade de adicionar cartões agora opera conforme o esperado.
