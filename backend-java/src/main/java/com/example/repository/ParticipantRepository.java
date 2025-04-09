package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, ParticipantId> {

    @Query("SELECT p FROM Participant p WHERE p.id.eventID = :eventID")
    List<Participant> findParticipantsByEventId(@Param("eventID") String eventID);

    void deleteById_SrnAndId_EventID(String srn, String eventID);
}
