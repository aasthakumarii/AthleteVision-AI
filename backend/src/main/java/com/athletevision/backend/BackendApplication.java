package com.athletevision.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        var context = SpringApplication.run(BackendApplication.class, args);

        System.out.println("DATASOURCE URL = " +
                context.getEnvironment().getProperty("spring.datasource.url"));

        System.out.println("DATASOURCE USER = " +
                context.getEnvironment().getProperty("spring.datasource.username"));
    }
}