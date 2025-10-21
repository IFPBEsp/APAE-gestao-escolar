'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Chamada from '@/components/Chamada'

export default function ChamadaPage() {
  const router = useRouter()
  const search = useSearchParams()
  const initialClass = search.get('class') ?? undefined
  return <Chamada onBack={() => router.back()} initialClass={initialClass} />
}
