package com.example.repository;

import com.example.demo.Event;
import com.example.demo.Organizer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
