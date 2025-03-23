package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class GuestId implements Serializable {
    private String id;
    private String eventID;

    public GuestId() {}

    public GuestId(String id, String eventID) {
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
        GuestId guestId = (GuestId) o;
        return Objects.equals(id, guestId.id) && Objects.equals(eventID, guestId.eventID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, eventID);
    }
}