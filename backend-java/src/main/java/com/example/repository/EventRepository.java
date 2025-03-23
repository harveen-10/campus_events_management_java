package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findAllByOrderByEventDateAsc();

    Optional<Event> findByEname(String ename);

    Optional<Event> findByEventId(String eventId);

    int deleteByEventId(String eventId);

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
    @Query("SELECT g FROM Guest g WHERE g.guestId.eventID = :eventId")
    List<Guest> findGuestsByEventId(@Param("eventId") String eventId);

    // Fetch finances for a specific event
    @Query("SELECT f FROM Finance f WHERE f.financeId.eventID = :eventId")
    List<Finance> findFinancesByEventId(@Param("eventId") String eventId);

    @Query("SELECT s FROM Sponsor s WHERE s.id.id = :id")
    Optional<Sponsor> getSponsorById(@Param("id") String id);

    @Query("SELECT g FROM Guest g WHERE g.guestId.id = :id")
    Optional<Guest> findGuestById(@Param("id") String id);

    @Query("SELECT f FROM Finance f WHERE f.financeId.transID = :transID")
    Optional<Finance> getFinanceByTransID(@Param("transID") String transID);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.domain = :domain AND e.category = :category AND e.eventDate = :eventDate")
    int countSimilarEvents(@Param("domain") String domain, @Param("category") String category, @Param("eventDate") String eventDate);

    @Transactional
    default Event insertNewEvent(Event event) {
        // Generate random EventID and ecode
        String eventId = generateRandomId();
        String ecode = generateRandomId();
        event.setEventId(eventId);
        event.setEcode(ecode);

        // Check for existing events with the same domain, category, and date
        int eventCount = countSimilarEvents(event.getDomain(), event.getCategory(), event.getEventDate());

        if (eventCount > 0) {
            throw new RuntimeException("A similar event already exists at that time.");
        }

        // Save the event
        return save(event);
    }

    private static String generateRandomId() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder id = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            id.append(characters.charAt(random.nextInt(characters.length())));
        }
        return id.toString();
    }
}

