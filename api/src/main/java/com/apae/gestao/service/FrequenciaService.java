package com.apae.gestao.service;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.TurmaRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FrequenciaService {

    private final TurmaRepository turmaRepository;
    private final AlunoViewRepository alunoRepository;

    public FrequenciaService(TurmaRepository turmaRepository, AlunoViewRepository alunoRepository) {
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
    }

    @Transactional
    public TurmaResumoFrequenciaDTO getResumoTurma(UUID turmaId) {
        return turmaRepository.getResumoFrequenciaTurma(turmaId);
    }

    @Transactional
    public Page<AlunoFrequenciaResumoDTO> listarAlunos(UUID turmaId, Pageable pageable) {
        return alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable);
    }

    @Transactional
    public Page<AulaPresencaAlunoResponseDTO> getHistoricoIndividualAluno(UUID alunoId, Pageable pageable) {
        return alunoRepository.listarHistoricoAluno(alunoId, pageable);
    }
}
