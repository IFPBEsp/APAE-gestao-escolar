package com.apae.gestao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.repository.TurmaRepository;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository dto;

    
}
