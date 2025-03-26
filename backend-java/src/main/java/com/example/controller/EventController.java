package com.example.controller;

import com.example.demo.*;
import com.example.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;


import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access
@RestController
@RequestMapping("/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final TeamRepository teamRepository;
    private final OrganizerRepository organizerRepository;
    private final OrganizedByRepository organizedByRepository;
    private final SponsorRepository sponsorRepository;
    private final GuestRepository guestRepository;
    private final FinanceRepository financeRepository;

    public EventController(
        EventRepository eventRepository,
        UserRepository userRepository,
        ParticipantRepository participantRepository,
        TeamRepository teamRepository,
        OrganizerRepository organizerRepository,
        OrganizedByRepository organizedByRepository,
        SponsorRepository sponsorRepository,
        GuestRepository guestRepository,
        FinanceRepository financeRepository
    ) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
        this.teamRepository = teamRepository;
        this.organizerRepository = organizerRepository;
        this.organizedByRepository = organizedByRepository;
        this.sponsorRepository = sponsorRepository;
        this.guestRepository = guestRepository;
        this.financeRepository = financeRepository;
    }


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


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
        System.out.println("Event ID: " + eventID);
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
        System.out.println("participant Event ID!!!!!!!!!!!!!: " + eventID);

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

    @GetMapping("/sponsorByID")
    public ResponseEntity<?> getSponsorByID(@RequestParam String sponsorID) {
        if (sponsorID == null || sponsorID.isEmpty()) {
            return ResponseEntity.badRequest().body("SponsorID is required.");
        }

        Optional<Sponsor> sponsor = eventRepository.getSponsorById(sponsorID);

        if (sponsor.isPresent()) {
            return ResponseEntity.ok(sponsor.get());
        } else {
            return ResponseEntity.status(404).body("Sponsor not found.");
        }
    }

    @GetMapping("/GuestByID")
    public ResponseEntity<?> getGuestById(@RequestParam String guestID) {
        System.out.println("guestID: " + guestID);
        if (guestID == null || guestID.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Guest ID is required.");
        }

        Optional<Guest> guest = eventRepository.findGuestById(guestID);

        if (guest.isEmpty()) {
            return ResponseEntity.status(404).body("Guest not found.");
        }

        return ResponseEntity.ok(guest.get());
    }

    @GetMapping("/FinanceByID")
    public ResponseEntity<?> getFinanceByID(@RequestParam String transID) {
        if (transID == null || transID.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("TransID is required.");
        }

        Optional<Finance> finance = eventRepository.getFinanceByTransID(transID);

        if (finance.isEmpty()) {
            return ResponseEntity.status(404).body("Finance record not found.");
        }

        return ResponseEntity.ok(finance.get());
    }

    

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("An error occurred during signup");
        }

        if (user.getSrn() == null || user.getSrn().trim().isEmpty()) {
            System.out.println("SRN validation failed");
            return ResponseEntity.badRequest().body("SRN is required.");
        }

        Optional<User> existingUser = userRepository.findBySrn(user.getSrn());
        if (existingUser.isPresent()) {
            System.out.println("User already exists: " + user.getSrn());
            return ResponseEntity.badRequest().body("This SRN already exists. Try logging in.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        if (loginRequest.getSrn() == null || loginRequest.getSrn().trim().isEmpty()) {
            return "SRN is required";
        }

        Optional<User> userOptional = userRepository.findBySrn(loginRequest.getSrn());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return "Login successful";
            } else {
                return "Incorrect password";
            }
        } else {
            return "User not found";
        }
    }

    // POST new event (creating events)
    @PostMapping("/newevent")
    public ResponseEntity<Map<String, String>> createEvent(@RequestBody Event event) {
        // System.out.println("Received Start Time: " + event.getStartTime());
        // System.out.println("Received End Time: " + event.getEndTime());
        try {
            Event savedEvent = eventRepository.insertNewEvent(event);
            return ResponseEntity.ok(Map.of(
                "EventID", savedEvent.getEventId(),
                "ecode", savedEvent.getEcode()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerForEvent(@RequestBody RegistrationRequest request) {
        String eventID = request.getEventID();
        System.out.println("EventID: " + eventID);
        List<ParticipantDTO> participants = request.getParticipants();
        String teamName = request.getTeamName();
        System.out.println("teamName: " + teamName);

        if (eventID == null || participants == null || participants.isEmpty()) {
            return ResponseEntity.badRequest().body("EventID and participant details are required.");
        }

        // Check if event exists and get the team size
        Optional<Event> eventOptional = eventRepository.findById(eventID);
        if (eventOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Event not found.");
        }

        int teamSize = eventOptional.get().getTeamSize();
        String teamID = null;

        if (teamSize > 1) {
            teamID = UUID.randomUUID().toString().substring(0, 6); // Generate 6-character TeamID
            Team team = new Team(teamID, teamName, eventID);
            teamRepository.save(team);
        }

        for (ParticipantDTO participantDTO : participants) {
            String srn = participantDTO.getSrn();
            System.out.println("srn: " + srn);
            String name = participantDTO.getName();
            System.out.println("name: " + name);
            String email = participantDTO.getEmail();
            System.out.println("email: " + email);
            String phoneNo = participantDTO.getPhoneNo();
            System.out.println("phoneNo: " + phoneNo);
    
            if (srn == null || name == null || email == null || phoneNo == null || srn.isEmpty() || name.isEmpty() || email.isEmpty() || phoneNo.isEmpty()) {
                return ResponseEntity.badRequest().body("All participant details are required.");
            }

            // Check if participant already exists
            ParticipantId participantId = new ParticipantId(srn, eventID);
            if (participantRepository.existsById(participantId)) {
                return ResponseEntity.badRequest().body("Participant with SRN " + srn + " has already registered for this event.");
            }

            Participant participant = new Participant(participantId, name, email, teamID, phoneNo);
            participantRepository.save(participant);
        }

        return ResponseEntity.status(201).body("Registration successful.");
    }
    

    @PostMapping("/addorganizer")
    public ResponseEntity<String> addOrganizer(@RequestBody OrganizerRequest request) {
        if (request.getSrn() == null || request.getEname() == null || request.getEcode() == null || 
            request.getName() == null || request.getEmail() == null || request.getPhoneNo() == null ||
            request.getSrn().isEmpty() || request.getEname().isEmpty() || request.getEcode().isEmpty() || 
            request.getName().isEmpty() || request.getEmail().isEmpty() || request.getPhoneNo().isEmpty()) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        // Check if the event exists and fetch the EventID
        Optional<Event> eventOpt = eventRepository.findByEname(request.getEname());
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Event not found.");
        }

        Event event = eventOpt.get();

        // Validate ecode
        if (!event.getEcode().equals(request.getEcode())) {
            return ResponseEntity.badRequest().body("The ecode entered is incorrect.");
        }

        // Check if the organizer exists
        Optional<Organizer> existingOrganizer = organizerRepository.findBySrn(request.getSrn());
        if (existingOrganizer.isEmpty()) {
            // Add new organizer
            Organizer newOrganizer = new Organizer(request.getSrn(), request.getName(), request.getEmail(), request.getPhoneNo());
            organizerRepository.save(newOrganizer);
        }

        // Add entry to organized_by table
        OrganizedById organizedById = new OrganizedById(request.getSrn(), event.getEventId());
        if (organizedByRepository.existsById(organizedById)) {
            return ResponseEntity.badRequest().body("This organizer is already assigned to the event.");
        }

        OrganizedBy organizedBy = new OrganizedBy(organizedById, event);
        organizedByRepository.save(organizedBy);

        return ResponseEntity.ok("Organizer added successfully.");
    }

    // Insert Sponsor Details
    @PostMapping("/insertsponsor")
    public ResponseEntity<?> insertSponsor(@RequestBody Sponsor sponsor) {        
        if (sponsor.getName() == null || sponsor.getEmail() == null || sponsor.getContribution() == null || sponsor.getPhoneNo() == null || sponsor.getId().getEventID() == null) {
            return ResponseEntity.badRequest().body("All sponsor details (Name, Email, Contribution, phone_no, EventID) are required.");
        }

        // Generate a random 6-character alphanumeric sponsor ID
        String sponsorId = generateRandomId();
        SponsorId id = new SponsorId(sponsorId, sponsor.getId().getEventID());        
        sponsor.setId(id);
        
        try{
            sponsorRepository.save(sponsor);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Sponsor details inserted successfully."));
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error inserting sponsor details: " + e.getMessage()));
        }
    }

    // Random ID Generator (6-character alphanumeric)
    private String generateRandomId() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder id = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            id.append(chars.charAt(random.nextInt(chars.length())));
        }
        return id.toString();
    }

    @PostMapping("/insertguest")
    public ResponseEntity<?> insertGuest(@RequestBody Guest guest) {
        System.out.println("Name: " + guest.getName());
        System.out.println("Email: " + guest.getEmail());
        System.out.println("Role: " + guest.getRole());
        System.out.println("Phone: " + guest.getPhone_no());
        System.out.println("eventID: " +guest.getGuestId().getEventID());
        if (guest.getName() == null || guest.getEmail() == null || guest.getRole() == null || 
            guest.getPhone_no() == null || guest.getGuestId().getEventID() == null) {
                return ResponseEntity.badRequest().body("All guest details are required.");
        }

        // Generate a random Guest ID
        String guestID = generateRandomId();
        GuestId guestId = new GuestId(guestID, guest.getGuestId().getEventID());

        // Create the Guest object with generated ID
        Guest newGuest = new Guest(guestId, guest.getName(), guest.getEmail(), guest.getRole(), guest.getPhone_no());

        // Save to database
        try{
            guestRepository.save(newGuest);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Guest details inserted successfully."));
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error inserting guest details: " + e.getMessage()));
        }
    }

    @PostMapping("/insertfinance")
    public ResponseEntity<?> insertFinance(@RequestBody Finance finance) {
        // System.out.println("spent on: " + finance.getSpentOn());
        // System.out.println("amount: " + finance.getAmount());
        // System.out.println("receipt: " + finance.getReceipt());
        // System.out.println("event id: " + finance.getFinanceId().getEventID());

        if (finance.getSpentOn() == null || finance.getAmount() == null || finance.getReceipt() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All finance details (SpentOn, Amount, Receipt, EventID) are required.");
        }

        String transID = generateRandomId();
        System.out.println("transID: " + transID);
        FinanceId financeId = new FinanceId(transID, finance.getFinanceId().getEventID());
        System.out.println("financeId: " + financeId);

        try{
            Finance newfinance = new Finance(financeId, finance.getSpentOn(), finance.getAmount(), finance.getReceipt());
            financeRepository.save(newfinance);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Finance details inserted successfully."));
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error inserting guest details: " + e.getMessage()));
        }
    }

    @PostMapping("/updateguest")
    public ResponseEntity<?> updateGuest(@RequestBody Guest updatedGuest) {
        if (updatedGuest.getGuestId() == null || updatedGuest.getGuestId().getId() == null) {
            return ResponseEntity.badRequest().body("Guest ID is required.");
        }

        String guestId = updatedGuest.getGuestId().getId();

        try{
            // Find the guest by ID (ignoring eventID)
            Optional<Guest> existingGuestOpt = guestRepository.findByGuestId_Id(guestId);
            Guest existingGuest = existingGuestOpt.get();

            // Update only provided fields
            if (updatedGuest.getName() != null) existingGuest.setName(updatedGuest.getName());
            if (updatedGuest.getEmail() != null) existingGuest.setEmail(updatedGuest.getEmail());
            if (updatedGuest.getRole() != null) existingGuest.setRole(updatedGuest.getRole());
            if (updatedGuest.getPhone_no() != null) existingGuest.setPhone_no(updatedGuest.getPhone_no());

            // Save the updated guest
            guestRepository.save(existingGuest);

            return ResponseEntity.ok().body(Collections.singletonMap("message", 
                "Guest details updated successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error updating guest details: " + e.getMessage()));
        }
    }

    @PostMapping("/updatesponsor")
    public ResponseEntity<?> updateSponsor(@RequestBody Sponsor updatedSponsor) {
        if (updatedSponsor.getId() == null || updatedSponsor.getId().getId() == null) {
            return ResponseEntity.badRequest().body("Sponsor ID is required.");
        }

        String sponsorId = updatedSponsor.getId().getId(); // Extract only Sponsor ID

        try{
            // Find sponsor by Sponsor ID
            Optional<Sponsor> existingSponsorOpt = sponsorRepository.findById_Id(sponsorId);
            Sponsor existingSponsor = existingSponsorOpt.get();

            // Update only if new values are provided
            if (updatedSponsor.getName() != null) existingSponsor.setName(updatedSponsor.getName());
            if (updatedSponsor.getEmail() != null) existingSponsor.setEmail(updatedSponsor.getEmail());
            if (updatedSponsor.getContribution() != null) existingSponsor.setContribution(updatedSponsor.getContribution());
            if (updatedSponsor.getPhoneNo() != null) existingSponsor.setPhoneNo(updatedSponsor.getPhoneNo());

            // Save the updated sponsor
            sponsorRepository.save(existingSponsor);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
                "Sponsor details updated successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error updating sponsor details: " + e.getMessage()));
        }
    }

    
    @PostMapping("/updatefinance")
    public ResponseEntity<?> updateFinance(@RequestBody Finance request) {
        // Extract values from request
        // System.out.println("spent on: " + request.getSpentOn());
        // System.out.println("amount: " + request.getAmount());
        // System.out.println("receipt: " + request.getReceipt());

        String transID = request.getFinanceId().getTransID();
        String spentOn = request.getSpentOn();
        String receipt = request.getReceipt();
        if (request.getAmount() == null) {
            return ResponseEntity.badRequest().body("Amount cannot be null.");
        }

        // Validate input
        if (transID == null || spentOn == null || receipt == null) {
            return ResponseEntity.badRequest().body("All finance details (ID, SpentOn, Amount, Receipt) are required.");
        }

        try{
            // Find the existing finance record by TransID
            Optional<Finance> optionalFinance = financeRepository.findByFinanceId_TransID(transID);
            Finance finance = optionalFinance.get();
            // Update finance details
            finance.setSpentOn(spentOn);
            finance.setAmount(request.getAmount());
            finance.setReceipt(receipt);
            // Save updated record
            financeRepository.save(finance);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Finance details updated successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error updating finance details: " + e.getMessage()));
        }
    }


    @Transactional
    @DeleteMapping("/deletefinance")
    public ResponseEntity<?> deleteFinance(@RequestBody Finance finance) {
        FinanceId financeId = finance.getFinanceId(); // Get composite key object
    
        if (financeId == null || financeId.getTransID() == null || financeId.getEventID() == null) {
            return ResponseEntity.badRequest().body("Both TransID and EventID are required.");
        }
    
        String transID = financeId.getTransID();
        String eventID = financeId.getEventID();
    
        System.out.println("TransID: " + transID + ", EventID: " + eventID);
    
        // Perform deletion
        try{
            financeRepository.deleteByFinanceId_TransIDAndFinanceId_EventID(transID, eventID);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Finance details deleted successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error deleting finance details: " + e.getMessage()));
        }
    }
    

    @Transactional
    @DeleteMapping("/deletesponsor")
    public ResponseEntity<?> deleteSponsor(@RequestBody Sponsor prevsponsor) {
        SponsorId sponsorId = prevsponsor.getId(); // Get composite key object
    
        if (sponsorId == null || sponsorId.getId() == null || sponsorId.getEventID() == null) {
            return ResponseEntity.badRequest().body("Both SponsorID and EventID are required.");
        }
    
        String sponsorID = sponsorId.getId();
        String eventID = sponsorId.getEventID();
    
        System.out.println("SponsorID: " + sponsorID + ", EventID: " + eventID);
    
        // Perform deletion
        try{
            sponsorRepository.deleteById_IdAndId_EventID(sponsorID, eventID);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Sponsor details deleted successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error deleting sponsor details: " + e.getMessage()));
        }
    }


    @Transactional
    @DeleteMapping("/deleteguest")
    public ResponseEntity<?> deleteGuest(@RequestBody Guest prevguest) {
        GuestId guestId = prevguest.getGuestId(); // Get composite key object
    
        if (guestId == null || guestId.getId() == null || guestId.getEventID() == null) {
            return ResponseEntity.badRequest().body("Both GuestID and EventID are required.");
        }
    
        String guestID = guestId.getId();
        String eventID = guestId.getEventID();
    
        System.out.println("GuestID: " + guestID + ", EventID: " + eventID);
    
        // Perform deletion
        try{
            guestRepository.deleteByGuestId_IdAndGuestId_EventID(guestID, eventID);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Guest details deleted successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error deleting guest details: " + e.getMessage()));
        }
    }


    @Transactional
    @DeleteMapping("/deleteorganizer")
    public ResponseEntity<?> deleteOrganizerFromEvent(@RequestBody OrganizedBy organizer) {
        OrganizedById id = organizer.getId(); // Get composite key object
    
        if (id == null || id.getSrn() == null || id.getEventId() == null) {
            return ResponseEntity.badRequest().body("SRN and EventID are required to delete the organizer.");
        }
    
        // Delete organizer from `organized_by`
        try{
            organizedByRepository.deleteById(id); // Now correctly passing an OrganizedById object
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Organizer with SRN: " + id.getSrn() + " deleted successfully."));
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error deleting organizer: " + e.getMessage()));
        }
    }


    @Transactional
    @DeleteMapping("/deleteparticipant")
    public ResponseEntity<?> deleteParticipant(@RequestBody Participant participant) {
        String srn = participant.getId().getSrn();
        String eventID = participant.getId().getEventID();

        if (srn == null || eventID == null) {
            return ResponseEntity.badRequest().body("SRN and eventID are required to delete participant details.");
        }

        try {
            participantRepository.deleteById_SrnAndId_EventID(srn, eventID);
            return ResponseEntity.ok().body(Collections.singletonMap("message", 
            "Participant with SRN: " + srn + " deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("message",
            "Error deleting participant: " + e.getMessage()));
        }
    }

    @Transactional
    @DeleteMapping("/deleteevent")
    public ResponseEntity<String> deleteEvent(@RequestBody Event event) {
        String EventID=event.getEventId();
        if (EventID == null || EventID.isEmpty()) {
            return ResponseEntity.badRequest().body("EventID is required.");
        }

        int deletedRows = eventRepository.deleteByEventId(EventID);

        if (deletedRows == 0) {
            return ResponseEntity.status(404).body("Event not found.");
        }

        return ResponseEntity.ok("Event and related data deleted successfully.");
    }
}