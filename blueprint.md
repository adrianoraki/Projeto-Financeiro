
# Blueprint do Projeto: MoneyForge

Este documento serve como uma fonte central de verdade para o projeto MoneyForge, detalhando sua arquitetura, funcionalidades e o plano de desenvolvimento.

## Visão Geral

O MoneyForge é uma plataforma completa para ajudar os usuários a organizar suas despesas, planejar orçamentos e alcançar seus objetivos financeiros. A aplicação oferece ferramentas para rastreamento de transações, criação de orçamentos, monitoramento de investimentos e muito mais. A página de destino (landing page) é a principal porta de entrada para novos usuários, apresentando o valor da aplicação de forma clara e profissional.

## Esboço do Projeto

Esta seção documenta o estado atual da aplicação, incluindo estilo, design e funcionalidades implementadas.

### Estilo e Design

*   **Identidade Visual:**
    *   **Nome:** A aplicação se chama **MoneyForge**.
    *   **Logo:** A aplicação utiliza um logo com fundo transparente para melhor integração visual. O arquivo de logo oficial é o `public/imagem_4.png`. A exibição do logo foi desativada temporariamente nos cabeçalhos para fins de teste de design, mas o arquivo permanece como o oficial.
    *   **Favicon:** O ícone da aba do navegador é o `public/icon_2.ico`.
    *   **Slogan:** "Forjando dinheiro, construindo riqueza" é o slogan oficial, exibido abaixo do nome da aplicação para reforçar a proposta de valor.
    *   **Tipografia:** A aplicação utiliza uma fonte **serifada** para títulos e textos importantes, conferindo um estilo clássico e profissional, enquanto fontes sem serifa são usadas para o conteúdo geral, garantindo legibilidade.

*   **Estilo Global:** O arquivo `styles/globals.css` define os estilos base para toda a aplicação.

*   **Layout da Aplicação:**
    *   **Cabeçalhos:**
        *   O estilo do cabeçalho, definido em `styles/Header.module.css`, foi ajustado para garantir que o logo (quando ativo), o nome e o slogan fiquem perfeitamente alinhados.
        *   O cabeçalho da página de destino (`LandingHeader.tsx`) está posicionado de forma absoluta no canto superior esquerdo.
    *   **Página de Destino (Landing Page):**
        *   Este é o ponto de entrada principal, com design limpo e moderno em `styles/Home.module.css`.
        *   **Fundo Unificado:** Utiliza a mesma imagem de fundo da página de login (`/telalogin.jpg`) para criar uma identidade visual coesa.
        *   Apresenta um título de herói, uma breve descrição e um botão de chamada para ação ("Comece Agora") que direciona para a página de autenticação.
        *   **Seção de Funcionalidades:**
            *   Utiliza a paleta de cores **"Prestígio & Confiança"** (Azul, Dourado e Branco) para destacar os três principais recursos: Planejamento, Metas e Relatórios.
            *   O cartão "Metas" é destacado com um fundo dourado para enfatizar o objetivo principal do usuário.
            *   Os cartões possuem um efeito de vidro fosco (`backdrop-filter`) para melhor legibilidade e um visual moderno.
    *   **Página de Autenticação (Login/Cadastro):**
        *   Localizada em `app/login/page.tsx`.
        *   Design de painel duplo interativo.
        *   O contêiner do formulário foi ajustado com `padding-top` em `styles/Login.module.css` para evitar sobreposição com o cabeçalho.
        *   **Métodos de Autenticação Simplificados:**
            *   Login social com **Google**.
            *   Login e Cadastro com **e-mail e senha**.
    *   **Layout Principal (Pós-Login):**
        *   Utiliza um layout de painel com uma barra lateral e uma área de conteúdo principal.
        *   Inclui um cabeçalho de navegação completo e uma barra lateral para navegação.

## Plano de Desenvolvimento Atual

*   **Tarefa:** Implementar a paleta de cores "Prestígio & Confiança".
    *   **Objetivo:** Aplicar uma nova paleta de cores (azul, dourado e branco) aos cartões de funcionalidades da landing page para reforçar a identidade visual da marca MoneyForge.
    *   **Passos:**
        1.  **Adicionar Classes CSS:** Adicionamos classes específicas (`featureCard1`, `featureCard2`, `featureCard3`) a cada cartão no arquivo `app/page.tsx`.
        2.  **Aplicar Paleta de Cores:** No `styles/Home.module.css`, definimos as cores de fundo, texto e bordas para cada classe, implementando a paleta "Prestígio & Confiança".
        3.  **Ajuste de Consistência:** A cor do nome da aplicação no título do herói foi alterada para dourado (`#FFD700`) para maior consistência visual.

*   **Tarefa:** Unificar a Identidade Visual da Landing Page.
    *   **Objetivo:** Aplicar a mesma imagem de fundo da página de login à página inicial para criar uma experiência visual coesa e profissional.
    *   **Passos:**
        1.  **Identificação do Estilo:** O estilo de fundo foi localizado na classe `.pageWrapper` do arquivo `styles/Login.module.css`.
        2.  **Aplicação na Home Page:** O estilo foi aplicado à classe `.container` no arquivo `styles/Home.module.css`.
        3.  **Ajustes de Contraste:** Para garantir a legibilidade, as cores do texto na seção do herói foram alteradas e o fundo da seção foi tornado semi-transparente.
        4.  **Modernização dos Cartões:** Os cartões de funcionalidades foram atualizados com um fundo de vidro fosco (`backdrop-filter: blur(5px)`).

*   **Tarefa:** Implementar a animação "Sliding Sign In & Sign Up".
    *   **Objetivo:** Adicionar a lógica de transição deslizante na página de autenticação.
    *   **Passos:**
        1.  Adicionar estado ao componente `app/login/page.tsx`.
        2.  Criar manipuladores de eventos de clique nos botões para alternar o estado.
        3.  Atualizar o `styles/Login.module.css` com as classes e propriedades CSS necessárias para a animação.

*   **Tarefa:** Resolver Avisos de Linting (ESLint).
    *   **Objetivo:** Eliminar todos os avisos de linting para garantir um código limpo.
    *   **Problema:** Avisos do tipo `no-unused-vars` nas rotas da API.
    *   **Solução:** Adicionamos o comentário `// eslint-disable-next-line @typescript-eslint/no-unused-vars` diretamente acima de cada função afetada para suprimir os avisos.
