"use client"

import { useRouter } from 'next/navigation'
import GerenciarTurmas from '@/components/GerenciarTurmas'

export default function TurmasPage() {
  const router = useRouter()
  return (
    <main style={{ padding: 24 }}>
      <h1>Gerenciar Turmas</h1>
      <GerenciarTurmas
        onBack={() => router.back()}
        onFazerChamada={(turmaId, turmaNome) =>
          router.push(`/chamada?class=${encodeURIComponent(turmaNome)}`)
        }
      />
    </main>
  )
}
