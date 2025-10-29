package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.dto.TurmaRequestDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository dao;

    @Transactional
    public TurmaResponseDTO criar(TurmaRequestDTO dto){
        Turma turma = new Turma();
        mapearDtoParaEntity(dto, turma);
        Turma salvo = dao.save(turma);
        return new TurmaResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas(){
        return dao.findAll()
            .stream()
            .map(TurmaResponseDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(Long id){
        Turma turma = dao.findById(id)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + id));
        return new TurmaResponseDTO(turma);
    }

    @Transactional
    public TurmaResponseDTO atualizar(Long id, TurmaRequestDTO dto){
        Turma turma = dao.findById(id)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + id));
        mapearDtoParaEntity(dto, turma);
        Turma atualizado = dao.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public void deletarPorId(Long id){
        Turma turma = dao.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada com ID: " + id));
        dao.delete(turma);
    }

    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setNome(dto.getNome());
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());
        turma.setAlunos(dto.getAlunos());
        turma.setProfessor(dto.getProfessor());
    }


    
}
