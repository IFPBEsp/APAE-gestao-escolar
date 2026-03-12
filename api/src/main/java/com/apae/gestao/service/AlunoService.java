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
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public AlunoService(
            AlunoRepository alunoRepository,
            TurmaRepository turmaRepository,
            TurmaAlunoRepository turmaAlunoRepository,
            AvaliacaoRepository avaliacaoRepository
    ) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlunoResumoDTO> listarAlunosPorNome(String nome, Pageable pageable) {
        Page<AlunoResumoDTO> page =
                (nome == null || nome.isBlank())
                        ? alunoRepository.listarAlunosResumido(pageable)
                        : alunoRepository.listarAlunosPorNomeResumido(nome, pageable);

        return page.map(dto -> new AlunoResumoDTO(
                dto.getId(),
                dto.getNome(),
                dto.getNomeResponsavel(),
                dto.getNomeTurma(),
                dto.getTurnoTurma(),
                dto.getPercentualPresenca(),
                dto.getDataUltimaAvaliacao() 
        ));
    }

    @Transactional(readOnly = true)
    public AlunoDetalhesDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return new AlunoDetalhesDTO(aluno);
    }

    @Transactional
    public AlunoDetalhesDTO atualizarTurma(Long alunoId, AlunoTurmaRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Turma novaTurma = turmaRepository.findById(dto.getNovaTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        if(!novaTurma.getIsAtiva()){
            throw new RuntimeException("Não é possível adicionar aluno em uma turma inativa");
        }


        turmaAlunoRepository
                .findAllByAlunoAndIsAlunoAtivoTrue(aluno)
                .forEach(ta -> ta.setIsAlunoAtivo(false));

        //busca se o aluno já tem registro no novaTurma para não criar uma nova instância de aluno no bd
        TurmaAluno vinculo = aluno.getTurmaAlunos().stream()
                .filter(ta -> ta.getTurma().getId().equals(novaTurma.getId()))
                .findFirst()
                .orElse(null);

        //se já tiver sido vinculado uma vez
        if (vinculo != null) {
            //reativa
            vinculo.setIsAlunoAtivo(true);
        } else {
            //se nunca tiver sido vinculado
            vinculo = new TurmaAluno();
            vinculo.setAluno(aluno);
            vinculo.setTurma(novaTurma);
            vinculo.setIsAlunoAtivo(true);

            //adiciona na lista pra persistência
            aluno.getTurmaAlunos().add(vinculo);
        }

        turmaAlunoRepository.save(vinculo);
        return new AlunoDetalhesDTO(aluno);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoHistoricoResponseDTO> buscarAvaliacoesPorAlunoId(Long id) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        String turmaAtual = aluno.getTurmaAtual()
                        .map(Turma::getNome)
                        .orElse("Sem turma ativa");

        return avaliacaoRepository
                .findByAlunoOrderByDataAvaliacaoDesc(aluno)
                .stream()
                .map(a -> AvaliacaoHistoricoResponseDTO.fromEntity(a, turmaAtual))
                .toList();
    }
}