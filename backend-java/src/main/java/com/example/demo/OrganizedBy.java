package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "organized_by")
public class OrganizedBy {

    @EmbeddedId
    private OrganizedById id;  // Composite Key (srn + eventId)

    @ManyToOne
    @MapsId("eventId")  // Maps the "eventId" from OrganizedById
    @JoinColumn(name = "EventID", referencedColumnName = "EventID") // Linking to Event table
    private Event event;

    // Default constructor
    public OrganizedBy() {}

    // Constructor
    public OrganizedBy(OrganizedById id, Event event) {
        this.id = id;
        this.event = event;
    }

    // Getters & Setters
    public OrganizedById getId() { return id; }
    public void setId(OrganizedById id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}
