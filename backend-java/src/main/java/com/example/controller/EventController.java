package com.example.controller;

import com.example.demo.Event;
import com.example.demo.Organizer;
import com.example.repository.EventRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access
@RestController
@RequestMapping("/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // GET all events (like `/home` route in Node.js)
    @GetMapping("/home")
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();

        // Debugging output
        for (Event event : events) {
            System.out.println("Event ID: " + event.getEventId() + ", Team Size: " + event.getTeamSize());
        }

        return events;
    }

    // GET event details by ID (like `/eventdetails` route in Node.js)
    @GetMapping("/eventdetails")
    public Object getEventDetails(@RequestParam String eventId) {
        if (eventId == null || eventId.isEmpty()) {
            return "EventID is required.";
        }

        Optional<Event> event = eventRepository.findByEventId(eventId);
        return event.orElse(null); // If not found, return null
    }

    // GET all events organized by a specific SRN
    @GetMapping("/organizingdetails")
    public ResponseEntity<?> getOrganizingDetails(@RequestParam String srn) {
        if (srn == null || srn.isEmpty()) {
            return ResponseEntity.badRequest().body("SRN is required.");
        }

        List<Event> events = eventRepository.findEventsByOrganizer(srn);
        if (events.isEmpty()) {
            return ResponseEntity.status(404).body("No events found for this SRN.");
        }

        return ResponseEntity.ok(events);
    }


    @GetMapping("/organizers")
    @Transactional
    public ResponseEntity<?> getOrganizersByEvent(@RequestParam String eventID) {
        if (eventID == null) {
            return ResponseEntity.badRequest().body("EventID is required.");
        }

        List<Organizer> organizers = eventRepository.findOrganizersByEventId(eventID);

        if (organizers.isEmpty()) {
            return ResponseEntity.status(404).body("No organizers found for this event.");
        }

        return ResponseEntity.ok(organizers);
    }

    // POST new event (creating events)
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }
}