
'use client';

import React from 'react'; // Adicionado para corrigir o erro 'React is not defined'
import { usePathname } from 'next/navigation';
import LandingHeader from './LandingHeader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/login';

  return (
    <>
      {showHeader && <LandingHeader />}
      <main>{children}</main>
    </>
  );
}
