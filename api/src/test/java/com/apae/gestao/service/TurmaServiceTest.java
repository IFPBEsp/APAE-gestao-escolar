package com.apae.gestao.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class TurmaServiceTest {

    //injeção das dependências com mockito
    @InjectMocks
    private TurmaService turmaService;

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private TurmaAlunoRepository turmaAlunoRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    private UUID turmaId;
    private UUID pacienteId;
    private Turma turma;
    private TurmaAluno turmaAluno;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        turmaId = UUID.randomUUID();
        pacienteId = UUID.randomUUID();

        turma = new Turma();
        turma.setId(turmaId);

        turmaAluno = new TurmaAluno();
        turmaAluno.setTurma(turma);
        turmaAluno.setPacienteId(pacienteId);
        turmaAluno.setAtivo(false);

        when(turmaRepository.findById(turmaId))
                .thenReturn(Optional.of(turma));

        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId))
                .thenReturn(Optional.of(turmaAluno));
    }

    //cenário turma inativa, não deve vincular nenhum aluno

    @Test
    @DisplayName("Partição inválida: Não deve ativar aluno em turma inativa")
    void testParticaoInvalida_NaoDeveAtivarAlunoEmTurmaInativa() {
        turma.setAtiva(false);

        //validações
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> turmaService.ativarAluno(turmaId, pacienteId)
        );

        assertEquals(
                HttpStatus.UNPROCESSABLE_ENTITY,
                exception.getStatusCode()
        );

        assertTrue(
                exception.getReason().contains(
                        "Não é possível adicionar aluno em uma turma inativa"
                )
        );

        verify(turmaAlunoRepository, never()).save(any());
    }

    //cenário turma ativa, aluno ativo em outra turma

    @Test
    @DisplayName("Partição inválida: Não deve ativar aluno que já está ativo em outra turma")
    void testParticaoInvalida_NaoDeveAtivarSeJaEstiverAtivoEmOutraTurma() {
        turma.setAtiva(true);

        Turma outraTurma = new Turma();
        outraTurma.setId(UUID.randomUUID());

        TurmaAluno vinculoOutraTurma = new TurmaAluno();
        vinculoOutraTurma.setTurma(outraTurma);
        vinculoOutraTurma.setPacienteId(pacienteId);
        vinculoOutraTurma.setAtivo(true);

        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId))
                .thenReturn(List.of(vinculoOutraTurma));

        //validações
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> turmaService.ativarAluno(turmaId, pacienteId)
        );

        assertEquals(
                HttpStatus.UNPROCESSABLE_ENTITY,
                exception.getStatusCode()
        );

        assertTrue(
                exception.getReason().contains(
                        "já está ativo em outra turma"
                )
        );

        verify(turmaAlunoRepository, never()).save(any());
    }


    //cenário turma ativa, aluno não está ativo em outra turma e não possui vínculo com a turma atual

    @Test
    @DisplayName("Partição inválida: Não deve ativar aluno que não pertence à turma")
    void testParticaoInvalida_NaoDeveAtivarAlunoQueNaoPertenceATurma() {

        turma.setAtiva(true);

        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId))
                .thenReturn(List.of());

        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId))
                .thenReturn(Optional.empty());

        //validações
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> turmaService.ativarAluno(turmaId, pacienteId)
        );

        assertEquals(
                "O aluno não pertence a esta turma.",
                exception.getMessage()
        );

        verify(turmaAlunoRepository, never()).save(any());
    }

    //cenário onde turma ativa, aluno não está ativo em outra turma e possui vínculo com a turma atual

    @Test
    @DisplayName("Partição válida: Deve ativar aluno quando a turma está ativa e o aluno está disponível")
    void testParticaoValida_DeveAtivarAlunoComSucesso() {

        turma.setAtiva(true);

        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId))
                .thenReturn(List.of());

        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId))
                .thenReturn(Optional.of(turmaAluno));


        turmaService.ativarAluno(turmaId, pacienteId);

        //validações
        assertTrue(turmaAluno.getAtivo());

        verify(turmaAlunoRepository, times(1))
                .findByTurmaAndPacienteId(turma, pacienteId);

        verify(turmaAlunoRepository, times(1))
                .save(turmaAluno);
    }
}

