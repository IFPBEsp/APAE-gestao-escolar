package com.apae.gestao.service;

import com.apae.gestao.dto.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.PresencaRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final PresencaRepository presencaRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    private static final DateTimeFormatter DATA_BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public AlunoService(
            AlunoRepository alunoRepository,
            TurmaRepository turmaRepository,
            TurmaAlunoRepository turmaAlunoRepository,
            PresencaRepository presencaRepository,
            AvaliacaoRepository avaliacaoRepository
    ) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
        this.presencaRepository = presencaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    // =========================
    // LISTAGEM (CARDS)
    // =========================
    @Transactional(readOnly = true)
    public Page<AlunoResumoDTO> listarAlunosPorNome(String nome, Pageable pageable) {

        Page<Aluno> alunos = (nome == null || nome.isBlank())
                ? alunoRepository.findAlunosComTurmaAtual(pageable)
                : alunoRepository.findAlunosComTurmaAtualPorNome(nome, pageable);

        return alunos.map(aluno -> {

            String nomeTurma = null;
            String turnoTurma = null;

            if (aluno.getTurmaAtual().isPresent()) {
                nomeTurma = aluno.getTurmaAtual().get().getNome();
                turnoTurma = aluno.getTurmaAtual().get().getTurno();
            }

            Double percentualPresenca =
                    presencaRepository.calcularPercentualPresenca(aluno.getId());

            String dataUltimaAvaliacao =
                    avaliacaoRepository.findDataUltimaAvaliacao(aluno.getId()) != null
                            ? avaliacaoRepository.findDataUltimaAvaliacao(aluno.getId())
                                    .format(DATA_BR)
                            : null;

            return new AlunoResumoDTO(
                    aluno.getId(),
                    aluno.getNome(),
                    aluno.getIdade(),
                    aluno.getNomeResponsavel(),
                    nomeTurma,
                    turnoTurma,
                    percentualPresenca,
                    dataUltimaAvaliacao
            );
        });
    }

    // =========================
    // DETALHES
    // =========================
    @Transactional(readOnly = true)
    public AlunoDetalhesDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return new AlunoDetalhesDTO(aluno);
    }

    // =========================
    // ATUALIZAR TURMA
    // =========================
    @Transactional
    public AlunoDetalhesDTO atualizarTurma(Long alunoId, AlunoTurmaRequestDTO dto) {

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Turma novaTurma = turmaRepository.findById(dto.getNovaTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        turmaAlunoRepository
                .findAllByAlunoAndIsAlunoAtivoTrue(aluno)
                .forEach(ta -> ta.setIsAlunoAtivo(false));

        TurmaAluno novoVinculo = new TurmaAluno();
        novoVinculo.setAluno(aluno);
        novoVinculo.setTurma(novaTurma);
        novoVinculo.setIsAlunoAtivo(true);

        turmaAlunoRepository.save(novoVinculo);
        aluno.getTurmaAlunos().add(novoVinculo);

        return new AlunoDetalhesDTO(aluno);
    }

    // =========================
    // HISTÓRICO DE AVALIAÇÕES
    // =========================
    @Transactional(readOnly = true)
    public List<AvaliacaoHistoricoResponseDTO> buscarAvaliacoesPorAlunoId(Long id) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        String turmaAtual =
                aluno.getTurmaAtual()
                        .map(t -> t.getNome() + " - " + t.getTurno())
                        .orElse("Sem turma ativa");

        return avaliacaoRepository
                .findByAlunoOrderByDataAvaliacaoDesc(aluno)
                .stream()
                .map(a -> AvaliacaoHistoricoResponseDTO.fromEntity(a, turmaAtual))
                .toList();
    }
}
