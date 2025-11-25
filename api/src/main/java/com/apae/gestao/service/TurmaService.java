package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.AlunoResponseDTO;
import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.dto.TurmaAlunoRequestDTO;
import com.apae.gestao.dto.TurmaAlunoResponseDTO;
import com.apae.gestao.dto.TurmaRequestDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository turmaDAO;

    @Autowired
    private ProfessorRepository professorDAO;

    @Autowired
    private AlunoRepository alunoDAO; 

    @Autowired
    private TurmaAlunoRepository turmaAlunoDAO;

    @Transactional
    public TurmaResponseDTO criar(TurmaRequestDTO dto){
        Turma turma = new Turma();
        mapearDtoParaEntity(dto, turma);
        Turma salvo = turmaDAO.save(turma);
        return new TurmaResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas(){
        return turmaDAO.findAll()
            .stream()
            .map(TurmaResponseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(Long turmaId){
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        return new TurmaResponseDTO(turma);
    }

    @Transactional
    public TurmaResponseDTO atualizar(Long turmaId, TurmaRequestDTO dto){
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        mapearDtoParaEntity(dto, turma);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public void deletarPorId(Long turmaId){
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        turmaDAO.delete(turma);
    }

    @Transactional
    public TurmaResponseDTO vincularProfessoresATurma(Long turmaId, Long professorId) {
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        Professor professor = professorDAO.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + professorId));

        turma.setProfessor(professor);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarProfessorDaTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        return new ProfessorResponseDTO(turma.getProfessor());
    }

    @Transactional
    public TurmaResponseDTO ativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        turma.setIsAtiva(true);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO desativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        turma.setIsAtiva(false);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO adicionarAlunos(Long turmaId, List<Long> alunoIds){
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        List<Aluno> alunos = alunoDAO.findAllById(alunoIds);
        if (alunos.size() != alunoIds.size()){
            throw new RuntimeException("Um ou mais IDs de aluno não foram encontrados.");
        }
        for (Aluno aluno : alunos){
            turma.addAluno(aluno, true);
        }
        Turma atualizada = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizada);
    }

    @Transactional
    public List<TurmaAlunoResponseDTO> listarAlunos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turma.getTurmaAlunos()
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    // GET /api/turmas/{turmaId}/alunos/ativos
    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosAtivos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivo(turma, true)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    // GET /api/turmas/{turmaId}/alunos/inativos
    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosInativos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivo(turma, false)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    // PATCH /ativar
    @Transactional
    public void ativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, true);
    }

    @Transactional
    public void desativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, false);
    }


// ***********************************************************************************************
    private void alterarStatus(Long turmaId, Long alunoId, boolean ativo) {

        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        Aluno aluno = alunoDAO.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado."));

        TurmaAluno turmaAluno = turmaAlunoDAO.findByTurmaAndAluno(turma, aluno)
                .orElseThrow(() -> new RuntimeException("O aluno não pertence a esta turma."));

        turmaAluno.setIsAlunoAtivo(ativo);
        turmaAlunoDAO.save(turmaAluno);
    }

    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setNome(dto.getNome());
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());
        turma.setTipo(dto.getTipo());

        if(dto.getIsAtiva() != null){
            turma.setIsAtiva(dto.getIsAtiva());
        }

        if(dto.getProfessorId() != null) {
            Professor professor = professorDAO.findById(dto.getProfessorId())
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            turma.setProfessor(professor);
        }

        // Processar alunosIds e vincular alunos à turma
        if(dto.getAlunosIds() != null && !dto.getAlunosIds().isEmpty()) {
            for(Long alunoId : dto.getAlunosIds()) {
                Aluno aluno = alunoRepository.findById(alunoId)
                        .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + alunoId));
                // Verificar se o aluno já não está na turma (evitar duplicatas)
                boolean alunoJaExiste = turma.getTurmaAlunos().stream()
                        .anyMatch(ta -> ta.getAluno().getId().equals(alunoId));
                if(!alunoJaExiste) {
                    turma.addAluno(aluno, true);
                }
            }
        }
    }
}
