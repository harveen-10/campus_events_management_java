package com.example.repository;

import com.example.demo.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest, GuestId> {
    Optional<Guest> findByGuestId_Id(String id);

    Optional<Guest> findByGuestId_IdAndGuestId_EventID(String id, String eventID);

    void deleteByGuestId_IdAndGuestId_EventID(String id, String eventID);
}