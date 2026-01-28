package com.apae.gestao.minio;

import io.minio.MinioClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class MinioConnectionTest {
    @Autowired
    private MinioClient minioClient;

    @Test
    void deveConectarAoMinioEListarBuckets() throws Exception {
        assertNotNull(minioClient, "O MinioClient não foi injetado pelo Spring");

        var buckets = minioClient.listBuckets();
        assertNotNull(buckets, "A lista de buckets retornou nula");
        
        assertTrue(true);
    }
}
