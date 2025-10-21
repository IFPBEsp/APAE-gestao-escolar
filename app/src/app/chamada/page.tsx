import { Metadata } from 'next';
import Chamada from '@/components/Chamada/Chamada';

export const metadata: Metadata = {
  title: 'Chamada - APAE Gestão Escolar',
  description: 'Registre a presença dos alunos',
};

export default function ChamadaPage() {
  return <Chamada />;
}

