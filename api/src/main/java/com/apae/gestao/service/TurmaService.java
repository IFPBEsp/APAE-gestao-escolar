package com.apae.gestao.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.apae.gestao.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<TurmaResumoDTO> listarTurmas(
            Long id,
            String nome,
            Integer anoCriacao,
            String turno,
            String tipo,
            Boolean isAtiva,
            Long professorId) {

        String jsonResult = turmaDAO.listarTurmasJson(
                id, nome, anoCriacao, turno, tipo, isAtiva, professorId
        );

        return parseJsonToList(jsonResult);
    }

    @Transactional(readOnly = true)
    public TurmaResumoDTO buscarTurmaResumidaPorId(Long id) {
        String jsonResult = turmaDAO.listarTurmasJson(
                id, null, null, null, null, null, null
        );

        List<TurmaResumoDTO> turmas = parseJsonToList(jsonResult);

        if (turmas.isEmpty()) {
            throw new RuntimeException("Turma não encontrada com ID: " + id);
        }

        return turmas.get(0);
    }

    private List<TurmaResumoDTO> parseJsonToList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<TurmaResumoDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao processar JSON de turmas", e);
        }
    }

    @Transactional
    public TurmaResponseDTO criar(TurmaRequestDTO dto) {
        Turma turma = new Turma();
        mapearDtoParaEntity(dto, turma);
        turma.setNome(obterNomeUnicoParaTurma(turma.getNome(), null));
        Turma salvo = turmaDAO.save(turma);
        return new TurmaResponseDTO(salvo);
    }

    /**
     * Garante um nome único para a turma. Se já existir turma com o mesmo nome,
     * adiciona sufixo numérico (2), (3), ... até encontrar um nome disponível.
     *
     * @param excludeId ID da turma a ser ignorada na verificação (usado na edição). Pode ser null na criação.
     */
    private String obterNomeUnicoParaTurma(String nomeBase, Long excludeId) {
        boolean nomeExiste = excludeId == null
                ? turmaDAO.existsByNome(nomeBase)
                : turmaDAO.existsByNomeAndIdNot(nomeBase, excludeId);

        if (!nomeExiste) {
            return nomeBase;
        }
        int sufixo = 2;
        String nomeCandidato;
        do {
            nomeCandidato = nomeBase + " (" + sufixo + ")";
            sufixo++;
            nomeExiste = excludeId == null
                    ? turmaDAO.existsByNome(nomeCandidato)
                    : turmaDAO.existsByNomeAndIdNot(nomeCandidato, excludeId);
        } while (nomeExiste);
        return nomeCandidato;
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas() {
        return turmaDAO.findAll()
                .stream()
                .map(TurmaResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        return new TurmaResponseDTO(turma);
    }

    @Transactional
    public TurmaResponseDTO atualizar(Long turmaId, TurmaRequestDTO dto) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        mapearDtoParaEntity(dto, turma);
        turma.setNome(obterNomeUnicoParaTurma(turma.getNome(), turma.getId()));
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public void deletarPorId(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        turmaDAO.delete(turma);
    }

    @Transactional
    public TurmaResponseDTO vincularProfessoresATurma(Long turmaId, Long professorId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        validarProfessorUnicoPorTurno(professorId, turma);

        Professor professor = professorDAO.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + professorId));

        turma.setProfessor(professor);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO ativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        if (turma.getProfessor() != null) {
            validarProfessorUnicoPorTurno(turma.getProfessor().getId(), turma);
        }

        turma.setIsAtiva(true);

        if (turma.getTurmaAlunos() != null) {
            turma.getTurmaAlunos().forEach(turmaAluno -> {
                if (!isAlunoAtivoEmOutraTurma(turmaAluno.getAluno(), turmaId)) {
                    turmaAluno.setIsAlunoAtivo(true);
                }
            });
        }

        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO desativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        turma.setIsAtiva(false);

        if (turma.getTurmaAlunos() != null) {
            turma.getTurmaAlunos().forEach(turmaAluno -> {
                turmaAluno.setIsAlunoAtivo(false);
            });
        }

        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO adicionarAlunos(Long turmaId, List<Long> alunoIds) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        if(!turma.getIsAtiva()){
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,"Não é possível adicionar aluno em uma turma inativa");
        }

        List<Aluno> alunos = alunoDAO.findAllById(alunoIds);

        if (alunos.size() != alunoIds.size()) {
            throw new RuntimeException("Um ou mais IDs de aluno não foram encontrados.");
        }

        validarAlunosNaoAtivosEmOutrasTurmas(alunos, turma.getId());
        vincularOuReativarAlunos(turma, alunos);

        Turma atualizada = turmaDAO.save(turma);

        return turmaDAO.findByIdWithDetails(atualizada.getId())
                .map(TurmaResponseDTO::new)
                .orElse(new TurmaResponseDTO(atualizada));
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunos(Long turmaId) {
        return turmaAlunoDAO.findByTurmaIdOrderByAlunoNomeAsc(turmaId)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosAtivos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivoOrderByAlunoNomeAsc(turma, true)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosInativos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivoOrderByAlunoNomeAsc(turma, false)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional
    public void ativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, true);
    }

    @Transactional
    public void desativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, false);
    }

    private void alterarStatus(Long turmaId, Long alunoId, boolean ativo) {

        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        if (ativo && !turma.getIsAtiva()){
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,"Não é possível adicionar aluno em uma turma inativa");
        }

        Aluno aluno = alunoDAO.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado."));

        TurmaAluno turmaAluno = turmaAlunoDAO.findByTurmaAndAluno(turma, aluno)
                .orElseThrow(() -> new RuntimeException("O aluno não pertence a esta turma."));

        if(ativo){
            if(isAlunoAtivoEmOutraTurma(aluno, turmaId)){
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Não foi possível ativar. O aluno "+ aluno.getNome() +" já está ativo em outra turma.");
            }
        }

        turmaAluno.setIsAlunoAtivo(ativo);
        turmaAlunoDAO.save(turmaAluno);
    }

    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());
        turma.setTipo(dto.getTipo());
        turma.setNome(dto.getTipo() + " " + dto.getAnoCriacao() + " - " + dto.getTurno());

        if (dto.getIsAtiva() != null) {
            turma.setIsAtiva(dto.getIsAtiva());
        }

        if (dto.getProfessorId() != null) {
            validarProfessorUnicoPorTurno(dto.getProfessorId(), turma);
            Professor professor = professorDAO.findById(dto.getProfessorId())
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            turma.setProfessor(professor);
        }


        if (dto.getAlunosIds() != null) {
            Set<Long> novosIds = dto.getAlunosIds();

            if (turma.getTurmaAlunos() != null) {
                List<Aluno> alunosParaRemover = turma.getTurmaAlunos().stream()
                        .filter(ta -> Boolean.TRUE.equals(ta.getIsAlunoAtivo()))
                        .filter(ta -> !novosIds.contains(ta.getAluno().getId()))
                        .map(TurmaAluno::getAluno)
                        .toList();
                alunosParaRemover.forEach(turma::removeAluno);
            }

            if (!novosIds.isEmpty()) {
                if (!turma.getIsAtiva()) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Não é possível adicionar aluno em uma turma inativa");
                }

                List<Aluno> alunos = alunoDAO.findAllById(novosIds);
                validarAlunosNaoAtivosEmOutrasTurmas(alunos, turma.getId());
                vincularOuReativarAlunos(turma, alunos);
            }
        }

    }

    private boolean isAlunoAtivoEmOutraTurma(Aluno aluno, Long turmaIdAtual) {
        List<TurmaAluno> matriculasAtivas = turmaAlunoDAO.findAllByAlunoAndIsAlunoAtivoTrue(aluno);

        return matriculasAtivas.stream()
                .anyMatch(ta -> turmaIdAtual == null || !ta.getTurma().getId().equals(turmaIdAtual));
    }

    private void validarAlunosNaoAtivosEmOutrasTurmas(List<Aluno> alunos, Long turmaIdAtual) {
        List<String> alunosInvalidos = new ArrayList<>();
        for (Aluno aluno : alunos) {
            if (isAlunoAtivoEmOutraTurma(aluno, turmaIdAtual)) {
                alunosInvalidos.add(aluno.getNome());
            }
        }

        if (!alunosInvalidos.isEmpty()) {
            String mensagemErro = "Operação cancelada. Os seguintes alunos já estão ativos em outra turma: "
                    + String.join(", ", alunosInvalidos);
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, mensagemErro);
        }
    }

    private void vincularOuReativarAlunos(Turma turma, List<Aluno> alunos) {
        for (Aluno aluno : alunos) {
            Optional<TurmaAluno> vinculoExistente = turma.getTurmaAlunos().stream()
                    .filter(ta -> ta.getAluno().getId().equals(aluno.getId()))
                    .findFirst();

            if (vinculoExistente.isPresent()) {
                vinculoExistente.get().setIsAlunoAtivo(true);
            } else {
                turma.addAluno(aluno, true);
            }
        }
    }

    private void validarProfessorUnicoPorTurno(Long professorId, Turma turmaNova){
        if (professorId == null || turmaNova == null) return;

        Professor professor= professorDAO.findByIdWithTurmas(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        if(professor.getTurmas()!=null){

            boolean conflito = professor.getTurmas().stream()
                    .anyMatch(turmaExistente -> turmaExistente.getTurno().equalsIgnoreCase(turmaNova.getTurno())
                            && turmaExistente.getAnoCriacao().equals(turmaNova.getAnoCriacao())
                            && Boolean.TRUE.equals(turmaExistente.getIsAtiva())
                            && (turmaNova.getId() == null || !turmaExistente.getId().equals(turmaNova.getId())) //pra ignorar a própria turma
                    );
            if(conflito){
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Não é possível alocar o professor " + professor.getNome() + ", pois já possui vínculo a uma turma ativa no turno " + turmaNova.getTurno() + " nesse mesmo ano");
            }

        }





    }


}