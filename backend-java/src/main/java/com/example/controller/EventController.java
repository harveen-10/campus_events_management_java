package com.example.controller;

import com.example.demo.*;
import com.example.repository.EventRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    // GET participants for a specific event
    @GetMapping("/participants")
    public List<Participant> getParticipants(@RequestParam String eventID) {
        System.out.println("Event ID: " + eventID);

        if (eventID == null || eventID.isEmpty()) {
            throw new IllegalArgumentException("EventID is required.");
        }

        List<Participant> participants = eventRepository.findParticipantsByEventId(eventID);

        if (participants.isEmpty()) {
            throw new RuntimeException("No participants found for this event.");
        }

        return participants;
    }

    // GET sponsors for a specific event
    @GetMapping("/sponsors")
    public ResponseEntity<?> getSponsorsByEvent(@RequestParam String eventID) {
        if (eventID == null || eventID.isEmpty()) {
            return ResponseEntity.badRequest().body("EventID is required.");
        }

        List<Sponsor> sponsors = eventRepository.findSponsorsByEventId(eventID);

        if (sponsors.isEmpty()) {
            return ResponseEntity.status(404).body("No sponsors found for this event.");
        }

        return ResponseEntity.ok(sponsors);
    }

    // GET guests for a specific event
    @GetMapping("/guests")
    public ResponseEntity<?> getGuestsByEvent(@RequestParam String eventID) {
        if (eventID == null || eventID.isEmpty()) {
            return ResponseEntity.badRequest().body("EventID is required.");
        }

        List<Guest> guests = eventRepository.findGuestsByEventId(eventID);

        if (guests.isEmpty()) {
            return ResponseEntity.status(404).body("No guests found for this event.");
        }

        return ResponseEntity.ok(guests);
    }

    // GET finances for a specific event along with total amount spent
    @GetMapping("/finances")
    public ResponseEntity<?> getFinancesByEvent(@RequestParam String eventID) {
        if (eventID == null || eventID.isEmpty()) {
            return ResponseEntity.badRequest().body("EventID is required.");
        }

        List<Finance> finances = eventRepository.findFinancesByEventId(eventID);
        if (finances.isEmpty()) {
            return ResponseEntity.status(404).body("No finance details found for this event.");
        }

        // Calculate total amount spent
        double totalAmountSpent = finances.stream().map(Finance::getAmount).mapToDouble(BigDecimal::doubleValue).sum();

        return ResponseEntity.ok(new FinanceResponse(finances, totalAmountSpent));
    }

    // Inner class for structured JSON response
    public static class FinanceResponse {
        private List<Finance> finances;
        private double totalAmountSpent;

        public FinanceResponse(List<Finance> finances, double totalAmountSpent) {
            this.finances = finances;
            this.totalAmountSpent = totalAmountSpent;
        }

        public List<Finance> getFinances() {
            return finances;
        }

        public double getTotalAmountSpent() {
            return totalAmountSpent;
        }
    }

    // POST new event (creating events)
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }
}