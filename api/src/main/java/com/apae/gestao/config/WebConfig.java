package com.apae.gestao.config; 

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") 
                .allowedOrigins(
                    "https://apae-gestao-escolar.vercel.app", 
                    "https://apae-gestao-escolar.onrender.com", 
                    "http://localhost:3000"
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .exposedHeaders("Authorization") 
                .allowCredentials(true);
    }
}