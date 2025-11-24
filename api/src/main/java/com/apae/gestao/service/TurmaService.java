package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.dto.TurmaRequestDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository turmaDAO;

    @Autowired
    private ProfessorRepository professorDAO;

    @Autowired
    private AlunoRepository alunoRepository;

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

        if (dto.getAlunosIds() != null && !dto.getAlunosIds().isEmpty()) {
            dto.getAlunosIds().forEach(alunoId -> {
                Aluno aluno = alunoRepository.findById(alunoId)
                        .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + alunoId));

                boolean alunoJaExiste = turma.getTurmaAlunos().stream()
                        .anyMatch(relacao -> relacao.getAluno().getId().equals(aluno.getId()));

                if (!alunoJaExiste) {
                    turma.addAluno(aluno, true);
                }
            });
        }
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
    
}
