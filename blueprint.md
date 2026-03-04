
# Blueprint do Projeto: MoneyForge

Este documento serve como uma fonte central de verdade para o projeto MoneyForge, detalhando sua arquitetura, funcionalidades e o plano de desenvolvimento.

## Visão Geral

O MoneyForge é uma plataforma completa para ajudar os usuários a organizar suas despesas, planejar orçamentos e alcançar seus objetivos financeiros. A aplicação oferece ferramentas para rastreamento de transações, criação de orçamentos, monitoramento de investimentos e muito mais.

## Esboço do Projeto

Esta seção documenta o estado atual da aplicação, incluindo estilo, design e funcionalidades implementadas.

### Estilo e Design

*   **Identidade Visual:**
    *   **Nome:** A aplicação se chama **MoneyForge**.
    *   **Logo:** A aplicação utiliza um logo em formato PNG para garantir alta qualidade visual. O arquivo de logo oficial é o `public/imagem_1.png`.
    *   **Favicon:** O ícone da aba do navegador é o `public/icon_2.ico`.
    *   **Slogan:** "Forjando dinheiro, construindo riqueza" é o slogan oficial, exibido abaixo do nome da aplicação para reforçar a proposta de valor.
*   **Estilo Global:** O arquivo `styles/globals.css` define os estilos base para toda a aplicação.
*   **Layout da Aplicação:**
    *   **Cabeçalhos:**
        *   O estilo do cabeçalho, definido em `styles/Header.module.css`, foi ajustado para garantir que o logo fique perfeitamente alinhado à esquerda da página.
        *   Foram criadas classes CSS específicas (`.logoContainer`, `.logoTextContainer`, `.appName`, `.slogan`) para estruturar o logo, o nome e o slogan, garantindo uma apresentação visualmente agradável e hierárquical.
    *   **Página de Destino (Landing Page):**
        *   Utiliza um layout limpo e moderno, definido em `styles/Home.module.css`.
        *   Possui um cabeçalho simplificado (`components/layout/LandingHeader.tsx`) com o logo, o nome da aplicação e o slogan.
        *   Apresenta um título de herói, uma breve descrição e um botão de chamada para ação ("Comece Agora") que direciona para a página de autenticação.
    *   **Layout Principal (Pós-Login):**
        *   Utiliza um layout de painel com uma barra lateral e uma área de conteúdo principal, definido em `styles/Layout.module.css`.
        *   Inclui um cabeçalho de navegação completo (`components/layout/Header.tsx`) com o logo, o nome da aplicação, o slogan, links para "Dashboard", "Investimentos", "Orçamentos" e um botão "Sair".
        *   A barra lateral (`components/layout/Sidebar.tsx`) oferece navegação adicional e acesso a funcionalidades como adicionar transações.

### Funcionalidades Implementadas

*   **Autenticação de Usuário:**
    *   Sistema de login/logout funcional usando o Firebase Authentication.
    *   O contexto de autenticação (`lib/AuthContext.js`) gerencia o estado do usuário em toda a aplicação.
    *   A página de autenticação (`/auth`) serve tanto para login de usuários existentes quanto para a criação de novas contas.
*   **Roteamento e Layouts:**
    *   Uso do App Router do Next.js.
    *   Layouts separados para a página de destino (pública) e a aplicação principal (privada, para usuários autenticados).
    *   A página de destino é a rota raiz (`/`).
    *   A área principal da aplicação está agrupada sob a rota `/(main)`.
*   **API Backend:**
    *   Rotas de API criadas para gerenciar orçamentos (`app/api/budget/route.ts`).
    *   Utiliza o Firebase Admin SDK para operações de backend seguras.
