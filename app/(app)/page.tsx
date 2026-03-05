
'use client';

import React, { useState, useEffect } from 'react';
import Transactions from '../../components/finances/Transactions';

const AppPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && <Transactions />}
    </>
  );
};

export default AppPage;
