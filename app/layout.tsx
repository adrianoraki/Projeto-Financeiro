
import React from 'react';
import { Providers } from './providers';
import '../styles/globals.css';

export const metadata = {
  title: 'MoneyForge - Controle suas Finanças',
  description: 'A plataforma completa para organizar suas despesas, planejar orçamentos e alcançar seus objetivos financeiros.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon_2.png" type="image/png" />
      </head>
      <body>
        <Providers> 
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
