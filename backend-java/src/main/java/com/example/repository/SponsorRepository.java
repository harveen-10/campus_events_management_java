package com.example.repository;

import com.example.demo.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, SponsorId> {
    Optional<Sponsor> findById_Id(String id);

    Optional<Sponsor> findById_IdAndId_EventID(String id, String eventID);

    void deleteById_IdAndId_EventID(String id, String eventID);
}
