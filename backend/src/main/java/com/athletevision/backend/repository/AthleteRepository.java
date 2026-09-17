package com.athletevision.backend.repository;

import com.athletevision.backend.entity.Athlete;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AthleteRepository extends JpaRepository<Athlete, UUID> {

}