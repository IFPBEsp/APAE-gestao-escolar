'use client'

import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { Calendar, Loader2, Users, ArrowLeft } from 'lucide-react'

type Student = { id: number; name: string }

const studentsByClass: Record<string, Student[]> = {
  Alfabetização: [
    { id: 1, name: 'Ana Silva' },
    { id: 2, name: 'Bruno Costa' },
    { id: 3, name: 'Carlos Oliveira' },
    { id: 4, name: 'Diana Santos' },
    { id: 5, name: 'Eduardo Ferreira' },
    { id: 6, name: 'Fernanda Lima' },
    { id: 7, name: 'Gabriel Souza' },
    { id: 8, name: 'Helena Rodrigues' },
  ],
  Estimulação: [
    { id: 9, name: 'Igor Martins' },
    { id: 10, name: 'Juliana Alves' },
    { id: 11, name: 'Lucas Pereira' },
    { id: 12, name: 'Maria Cardoso' },
    { id: 13, name: 'Nicolas Ribeiro' },
    { id: 14, name: 'Olivia Gomes' },
  ],
  Artes: [],
}

type ClassKey = keyof typeof studentsByClass

interface ChamadaProps {
  onBack: () => void
  initialClass?: string
}

export default function Chamada({ onBack, initialClass }: ChamadaProps) {
  const [selectedClass, setSelectedClass] = useState<ClassKey | null>((initialClass as ClassKey) || null)
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  const currentDate = new Date()
  const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`

  const handleClassChange = (value: string) => {
    setSelectedClass(value as ClassKey)
  }

  const handleAttendanceChange = (studentId: number, absentChecked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !absentChecked,
    }))
  }

  const handleSaveChamada = async () => {
    if (!selectedClass) return

    setIsSaving(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    toast.success('Chamada salva com sucesso!')
  }

  const students: Student[] = selectedClass ? studentsByClass[selectedClass] ?? [] : []

  useEffect(() => {
    if (!selectedClass) return
    const list = studentsByClass[selectedClass] ?? []
    const allPresent: Record<number, boolean> = {}
    for (const s of list) allPresent[s.id] = true
    setAttendance(allPresent)
  }, [selectedClass])

  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = students.length

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-[#0D4F97]">Chamada</CardTitle>
                <CardDescription className="text-[#222222]">Registre a presença dos alunos</CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[#0D4F97] px-4 py-2 text-white">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!initialClass && (
              <div className="space-y-2">
                <label htmlFor="class-select" className="text-[#0D4F97]">
                  Selecione a Turma
                </label>
                <Select value={selectedClass || undefined} onValueChange={handleClassChange}>
                  <SelectTrigger id="class-select" className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]">
                    <SelectValue placeholder="Escolha uma turma..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alfabetização">Alfabetização</SelectItem>
                    <SelectItem value="Estimulação">Estimulação</SelectItem>
                    <SelectItem value="Artes">Artes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {initialClass && selectedClass && (
              <div className="rounded-lg bg-[#B2D7EC]/20 p-4">
                <p className="text-[#0D4F97]">
                  <strong>Turma:</strong> {selectedClass}
                </p>
              </div>
            )}

            {selectedClass && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#222222]">
                      <Users className="h-4 w-4" />
                      <span>
                        {presentCount} de {totalCount} presentes
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        htmlFor={`student-${student.id}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#B2D7EC] bg-white p-4 transition-all hover:border-[#0D4F97] hover:shadow-sm"
                      >
                        <span className="flex-1 text-[#222222]">{student.name}</span>
                        {attendance[student.id] ? (
                          <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97]">Presente</span>
                        ) : (
                          <span className="rounded-full bg-[#FECDD2] px-3 py-1 text-[#d4183d]">Ausente</span>
                        )}
                        <Checkbox
                          id={`student-${student.id}`}
                          aria-label="Marcar ausente"
                          checked={!attendance[student.id] || false}
                          onCheckedChange={(checked) => handleAttendanceChange(student.id, checked as boolean)}
                          className="border-[#0D4F97] data-[state=checked]:bg-[#0D4F97]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveChamada} disabled={isSaving} className="h-12 min-w-[200px] justify-center bg-[#0D4F97] px-4 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Chamada'
                    )}
                  </Button>
                </div>
              </>
            )}

            {!selectedClass && (
              <div className="py-12 text-center text-[#222222]">Selecione uma turma para começar a chamada</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
