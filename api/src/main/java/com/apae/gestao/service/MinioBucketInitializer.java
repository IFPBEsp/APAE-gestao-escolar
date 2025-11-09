package com.apae.gestao.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MinioBucketInitializer {
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    public MinioBucketInitializer(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @PostConstruct
    public void createBucketIfNotExists() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );

            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
                System.out.println("Bucket criado: " + bucketName);
            } else {
                System.out.println("Bucket já existe: " + bucketName);
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao verificar/criar bucket no MinIO", e);
        }
    }
}
