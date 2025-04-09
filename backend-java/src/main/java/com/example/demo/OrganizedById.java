package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class OrganizedById implements Serializable {
    private String srn;
    private String eventId;

    // Default constructor
    public OrganizedById() {}

    // Constructor
    public OrganizedById(String srn, String eventId) {
        this.srn = srn;
        this.eventId = eventId;
    }

    // Getters & Setters
    public String getSrn() { return srn; }
    public void setSrn(String srn) { this.srn = srn; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    // equals() and hashCode() are required for composite keys
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrganizedById that = (OrganizedById) o;
        return Objects.equals(srn, that.srn) && Objects.equals(eventId, that.eventId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(srn, eventId);
    }
}
