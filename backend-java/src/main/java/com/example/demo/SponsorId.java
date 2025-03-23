package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class SponsorId implements Serializable {

    private String id;
    private String eventID;

    public SponsorId() {}

    public SponsorId(String id, String eventID) {
        this.id = id;
        this.eventID = eventID;
    }
    public String getEventID() {
        return eventID;
    }
    public String getId() {
        return id;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SponsorId sponsorId = (SponsorId) o;
        return Objects.equals(id, sponsorId.id) && Objects.equals(eventID, sponsorId.eventID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, eventID);
    }
}
