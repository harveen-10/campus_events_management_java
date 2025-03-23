package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, String> {

    Optional<Organizer> findBySrn(String srn);
    Optional<Organizer> findByEmailOrPhoneNo(String email, String phoneNo);
}
