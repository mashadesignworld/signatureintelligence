'use client';

import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react'; // 1. Add this import

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // We use useState to initialize the store exactly once. 
  // This avoids the 'useRef during render' error entirely.
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <SessionProvider> {/* 2. Wrap the Redux Provider */}
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  );
}