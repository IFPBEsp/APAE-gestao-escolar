package com.apae.gestao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;

import jakarta.transaction.Transactional;

@Service
public class FrequenciaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Transactional
    public TurmaResumoFrequenciaDTO getResumoTurma(Long turmaId) {
        return turmaRepository.getResumoFrequenciaTurma(turmaId);
    }

    @Transactional
    public Page<AlunoFrequenciaResumoDTO> listarAlunos(Long turmaId, Pageable pageable) {
        return alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable);
    }

    @Transactional
    public Page<AulaPresencaAlunoResponseDTO> getHistoricoIndividualAluno(
        Long alunoId,
        Pageable pageable
    ) {
        return alunoRepository.listarHistoricoAluno(alunoId, pageable);
    }
}

