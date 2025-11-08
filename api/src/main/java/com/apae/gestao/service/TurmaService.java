package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.dto.TurmaRequestDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository turmaDAO;

    @Autowired
    private ProfessorRepository professorDAO;

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
            .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com ID: " + turmaId));
        turmaDAO.delete(turma);
    }

    @Transactional
    public TurmaResponseDTO vincularProfessoresATurma(Long turmaId, List<Long> idsProfessores) {
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        for (Long idProfessor : idsProfessores) {
            Professor professor = professorDAO.findById(idProfessor)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + idProfessor));

            turma.addProfessor(professor);
        }
        
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarProfessoresNaTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        return turma.getProfessores().stream()
            .map(ProfessorResponseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public TurmaResponseDTO desvincularProfessor(Long turmaId, Long idProfessor){
        Turma turma = turmaDAO.findById(turmaId)
            .orElseThrow(()-> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        Professor professor = professorDAO.findById(idProfessor)
            .orElseThrow(()-> new RuntimeException("Professor não encontrado com ID: " + idProfessor));

        turma.removeProfessor(professor);
        
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }


    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setNome(dto.getNome());
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());

        if(dto.getIsAtiva() != null){
            turma.setIsAtiva(dto.getIsAtiva());
        }

        turma.setAlunos(dto.getAlunos());
        turma.setProfessores(dto.getProfessores());
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
