package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findAllByOrderByEventDateAsc();

    Optional<Event> findByEventId(String eventId);

    @Query("SELECT e FROM Event e WHERE e.eventId IN (SELECT ob.id.eventId FROM OrganizedBy ob WHERE ob.id.srn = :srn)")
    List<Event> findEventsByOrganizer(@Param("srn") String srn);
    
    // Fetch organizers for a specific event
    @Query("SELECT o FROM Organizer o WHERE o.srn IN (SELECT ob.id.srn FROM OrganizedBy ob WHERE ob.id.eventId = :eventId)")
    List<Organizer> findOrganizersByEventId(@Param("eventId") String eventId);

    // Fetch participants for a specific event using JPQL
    @Query("SELECT p FROM Participant p WHERE p.id.eventID = :eventId") 
    List<Participant> findParticipantsByEventId(@Param("eventId") String eventId);

    // Fetch sponsors for a specific event
    @Query("SELECT s FROM Sponsor s WHERE s.id.eventID = :eventId")
    List<Sponsor> findSponsorsByEventId(@Param("eventId") String eventId);

    // Fetch guests for a specific event
    @Query("SELECT g FROM Guest g WHERE g.guestId.EventID = :eventId")
    List<Guest> findGuestsByEventId(@Param("eventId") String eventId);

    // Fetch finances for a specific event
    @Query("SELECT f FROM Finance f WHERE f.financeId.eventID = :eventId")
    List<Finance> findFinancesByEventId(@Param("eventId") String eventId);

    @Query("SELECT s FROM Sponsor s WHERE s.id.id = :id")
    Optional<Sponsor> getSponsorById(@Param("id") String id);

    @Query("SELECT g FROM Guest g WHERE g.guestId.ID = :id")
    Optional<Guest> findGuestById(@Param("id") String id);

    @Query("SELECT f FROM Finance f WHERE f.financeId.transID = :transID")
    Optional<Finance> getFinanceByTransID(@Param("transID") String transID);
}

