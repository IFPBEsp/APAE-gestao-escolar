package com.apae.gestao.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MinioBucketInitializer implements ApplicationRunner {

    private final MinioClient minioClient;
    private final MinioProperties properties;

    @Override
    public void run(ApplicationArguments args) {
        String bucket = properties.getBucket();

        if (bucket == null || bucket.isBlank()) {
            log.warn("Nome do bucket MinIO nao configurado (minio.bucket). Pulando inicializacao.");
            return;
        }

        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build()
            );

            if (exists) {
                log.info("Bucket MinIO '{}' ja existe.", bucket);
                return;
            }

            minioClient.makeBucket(
                    MakeBucketArgs.builder().bucket(bucket).build()
            );
            log.info("Bucket MinIO '{}' criado com sucesso.", bucket);
        } catch (Exception e) {
            log.warn("Nao foi possivel verificar/criar o bucket MinIO '{}': {}", bucket, e.getMessage());
        }
    }
}
