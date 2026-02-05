import { lists } from '../../mock';
import ClientPage from './client-page';

export async function generateStaticParams() {
  return [
    { all: ['feed'] },
    { all: ['lists'] },
    ...lists.map(list => ({ all: ['lists', list.id] })),
    { all: ['settings'] },
  ];
}

export default function Page() {
  return <ClientPage />;
}
