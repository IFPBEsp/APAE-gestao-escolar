'use client'

import { BookOpen, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { buscarProfessorPorId, listarTurmasDeProfessor } from "@/services/ProfessorService"

export default function ProfessorDashboardPage() {
  const [professor, setProfessor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [turmas, setTurmas] = useState<any[]>([])

  const professorId = 1

  const turmasAtivas = turmas.filter(turma => turma.isAtiva === true)

  const totalAlunosAtivos = turmasAtivas.reduce((total, turma) => {
  const alunos = turma.alunos ?? []
  return total + alunos.filter(aluno => aluno.isAtivo).length
}, 0)


  useEffect(() => {
    async function carregarProfessor() {
      try {
        const response = await buscarProfessorPorId(professorId)
        setProfessor(response)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    carregarProfessor()
  }, [])

  useEffect(() => {
    async function carregarTurmas() {
      try {
        const response = await listarTurmasDeProfessor(professorId)
        setTurmas(response)
      } catch (err) {
        console.error(err)
      }
    }

    carregarTurmas()
  }, [])

  if (loading) {
    return (
      <p className="text-[#0D4F97] font-semibold">
        Carregando painel...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-red-600 font-semibold">
        {error}
      </p>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#0D4F97] text-2xl font-bold">
          Painel do Professor
        </h1>
        <p className="text-[#222222]">
          Bem-vindo, {professor?.nome}!
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardContent className="p-6 text-center">
            <div className="flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-full bg-[#B2D7EC]/20">
              <BookOpen className="h-7 w-7 text-[#0D4F97]" />
            </div>
            <p className="mb-2">Turmas Ativas</p>
            <p className="text-3xl font-bold text-[#0D4F97]">
              {turmasAtivas.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardContent className="p-6 text-center">
            <div className="flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-full bg-[#B2D7EC]/20">
              <Users className="h-7 w-7 text-[#0D4F97]" />
            </div>
            <p className="mb-2">Total de Alunos Ativos</p>
            <p className="text-3xl font-bold text-[#0D4F97]">
              {totalAlunosAtivos}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
