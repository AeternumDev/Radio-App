'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export default function ClientPage() {
  return <App />;
}
